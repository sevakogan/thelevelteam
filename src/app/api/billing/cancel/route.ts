import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/billing/stripe";
import { getCustomerByToken, updateCustomer } from "@/lib/billing/customers";
import { notifyAdminCancellation } from "@/lib/billing/notifications";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const customer = await getCustomerByToken(token);
    if (!customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!customer.stripe_subscription_id) {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    // Cancel in Stripe immediately
    const stripe = getStripe();
    await stripe.subscriptions.cancel(customer.stripe_subscription_id);

    // Update local status (webhook will also fire, but update immediately for UX)
    await updateCustomer(customer.id, {
      status: "cancelled",
      stripe_subscription_id: "",
    });

    // Notify admin (fire-and-forget)
    await notifyAdminCancellation(customer).catch((err) =>
      console.error("[BILLING] Failed to notify admin of cancellation:", err)
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[BILLING CANCEL] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
