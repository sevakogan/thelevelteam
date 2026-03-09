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

    // Resolve payment intent — stored directly or via session lookup
    let paymentIntentId = payment.stripe_payment_intent;
    if (!paymentIntentId && payment.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(payment.stripe_session_id);
      paymentIntentId = typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent as { id: string } | null)?.id ?? null;
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

    console.log(`[BILLING] Refund processed: ${paymentId} — $${refundAmount}`);

    return NextResponse.json({ success: true, refundId: refund.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Refund failed";
    console.error("[BILLING] Refund error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
