import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/billing/auth";
import { getPayment, updatePaymentStatus, appendStatusHistory } from "@/lib/billing/customers";
import { getStripe } from "@/lib/billing/stripe";

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId, amount } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    const payment = await getPayment(paymentId);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.status === "refunded") {
      return NextResponse.json({ error: "Payment already refunded" }, { status: 400 });
    }

    const stripe = getStripe();

    // Resolve payment intent — stored directly, via session, or via subscription invoice
    let paymentIntentId = payment.stripe_payment_intent;
    if (!paymentIntentId && payment.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(payment.stripe_session_id, {
        expand: ["invoice"],
      });

      // One-time payment: payment_intent is directly on the session
      if (typeof session.payment_intent === "string") {
        paymentIntentId = session.payment_intent;
      } else if ((session.payment_intent as { id?: string } | null)?.id) {
        paymentIntentId = (session.payment_intent as { id: string }).id;
      }

      // Subscription checkout: payment_intent is on the invoice
      if (!paymentIntentId && session.invoice) {
        const inv = session.invoice as { payment_intent?: string | { id: string } | null };
        if (typeof inv.payment_intent === "string") {
          paymentIntentId = inv.payment_intent;
        } else if ((inv.payment_intent as { id?: string } | null)?.id) {
          paymentIntentId = (inv.payment_intent as { id: string }).id;
        }
      }

      // Last resort: look up subscription's latest invoice
      if (!paymentIntentId && session.subscription) {
        const subId = typeof session.subscription === "string"
          ? session.subscription
          : (session.subscription as { id: string }).id;
        const invoices = await stripe.invoices.list({
          subscription: subId,
          limit: 1,
        });
        const latestInv = invoices.data[0];
        if (latestInv) {
          const rawPi = (latestInv as unknown as Record<string, unknown>).payment_intent;
          paymentIntentId = typeof rawPi === "string" ? rawPi : (rawPi as { id?: string } | null)?.id ?? null;
        }
      }
    }

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "No Stripe payment intent found — cannot refund this payment automatically" },
        { status: 400 }
      );
    }

    // Validate refund amount
    const refundAmount = amount ?? payment.amount;
    if (refundAmount <= 0 || refundAmount > payment.amount) {
      return NextResponse.json(
        { error: `Refund amount must be between $0.01 and ${payment.amount}` },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: Math.round(refundAmount * 100), // cents
    });

    if (refund.status === "failed") {
      return NextResponse.json({ error: "Stripe refund failed" }, { status: 500 });
    }

    const isPartial = refundAmount < payment.amount;
    const note = isPartial
      ? `Partial refund of $${refundAmount.toFixed(2)} via Stripe`
      : `Full refund via Stripe`;

    await updatePaymentStatus(paymentId, "refunded", note);
    await appendStatusHistory(
      payment.customer_id,
      payment.status, // keep customer status unchanged
      note
    );

    return NextResponse.json({ success: true, refundId: refund.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Refund failed";
    console.error("[BILLING] Refund error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
