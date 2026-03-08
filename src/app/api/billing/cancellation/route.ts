import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/billing/auth";
import {
  getCustomer,
  updateCustomer,
  appendStatusHistory,
} from "@/lib/billing/customers";
import {
  notifyCancellationApproved,
  notifyCancellationDeclined,
  notifyCancellationDiscount,
} from "@/lib/billing/notifications";
import { getStripe } from "@/lib/billing/stripe";
import { z } from "zod";

const cancellationActionSchema = z.object({
  customerId: z.string().uuid(),
  action: z.enum(["approve", "decline", "discount"]),
  discountType: z.enum(["percent", "fixed"]).optional(),
  discountValue: z.number().positive().optional(),
  note: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = cancellationActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { customerId, action, discountType, discountValue, note } = parsed.data;

    const customer = await getCustomer(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    if (customer.status !== "cancellation_requested") {
      return NextResponse.json(
        { error: "Customer has not requested cancellation" },
        { status: 400 }
      );
    }

    switch (action) {
      case "approve": {
        // Cancel Stripe subscription if present
        if (customer.stripe_subscription_id) {
          try {
            const stripe = getStripe();
            await stripe.subscriptions.cancel(customer.stripe_subscription_id);
          } catch (stripeErr) {
            console.error("[BILLING] Failed to cancel Stripe subscription:", stripeErr);
            // Continue — update our DB regardless
          }
        }

        await updateCustomer(customerId, {
          status: "lost",
          cancellation_admin_response: note ?? null,
          stripe_subscription_id: "",
        });

        await appendStatusHistory(
          customerId,
          "lost",
          note ? `Cancellation approved: ${note}` : "Cancellation approved by admin"
        );

        const refreshed = await getCustomer(customerId);
        if (refreshed) {
          await notifyCancellationApproved(refreshed).catch((err) =>
            console.error("[BILLING] Failed to send cancellation approved email:", err)
          );
        }

        return NextResponse.json({ success: true, action: "approved" });
      }

      case "decline": {
        await updateCustomer(customerId, {
          status: "in_process",
          cancellation_admin_response: note ?? null,
        });

        await appendStatusHistory(
          customerId,
          "in_process",
          note ? `Cancellation declined: ${note}` : "Cancellation request declined by admin"
        );

        const refreshed = await getCustomer(customerId);
        if (refreshed) {
          await notifyCancellationDeclined(refreshed).catch((err) =>
            console.error("[BILLING] Failed to send cancellation declined email:", err)
          );
        }

        return NextResponse.json({ success: true, action: "declined" });
      }

      case "discount": {
        if (!discountType || discountValue === undefined) {
          return NextResponse.json(
            { error: "discountType and discountValue are required for discount action" },
            { status: 400 }
          );
        }

        const originalAmount = customer.amount;
        const newAmount =
          discountType === "percent"
            ? Math.max(0, originalAmount * (1 - discountValue / 100))
            : Math.max(0, originalAmount - discountValue);

        const roundedNewAmount = Math.round(newAmount * 100) / 100;

        await updateCustomer(customerId, {
          amount: roundedNewAmount,
          status: "in_process",
          cancellation_admin_response: note ?? null,
          cancellation_discount_type: discountType,
          cancellation_discount_value: discountValue,
        });

        await appendStatusHistory(
          customerId,
          "in_process",
          `Discount applied: ${discountType === "percent" ? `${discountValue}%` : `$${discountValue}`} off. New amount: $${roundedNewAmount}`
        );

        const refreshed = await getCustomer(customerId);
        if (refreshed) {
          await notifyCancellationDiscount(refreshed, roundedNewAmount).catch((err) =>
            console.error("[BILLING] Failed to send cancellation discount email:", err)
          );
        }

        return NextResponse.json({
          success: true,
          action: "discount",
          newAmount: roundedNewAmount,
        });
      }
    }
  } catch (err) {
    console.error("[BILLING] Cancellation action error:", err);
    return NextResponse.json(
      { error: "Failed to process cancellation action" },
      { status: 500 }
    );
  }
}
