import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/billing/stripe";
import {
  getCustomer,
  updateCustomer,
  recordPayment,
} from "@/lib/billing/customers";
import {
  sendPaymentReceipt,
  sendPaymentFailed,
  notifyAdminPaymentReceived,
  notifyAdminPaymentFailed,
} from "@/lib/billing/notifications";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let event: Stripe.Event;

  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[BILLING WEBHOOK] Missing STRIPE_WEBHOOK_SECRET");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    event = getStripe().webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[BILLING WEBHOOK] Signature verification failed:", msg);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        // Unhandled event type — acknowledge
        break;
    }
  } catch (err) {
    console.error("[BILLING WEBHOOK] Handler error:", err);
    // Return 200 to prevent Stripe from retrying
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.metadata?.billing_customer_id;
  if (!customerId) {
    console.error("[BILLING WEBHOOK] No billing_customer_id in metadata");
    return;
  }

  const customer = await getCustomer(customerId);
  if (!customer) {
    console.error("[BILLING WEBHOOK] Customer not found:", customerId);
    return;
  }

  const amountPaid = (session.amount_total || 0) / 100;

  // Record payment
  const payment = await recordPayment(customerId, {
    amount: amountPaid,
    method: "Credit Card (Stripe)",
    stripe_session_id: session.id,
    stripe_payment_intent:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? undefined,
    status: "completed",
    note: `Stripe Checkout — Session ${session.id}`,
  });

  // Update customer status
  const newStatus = customer.recurring ? "active" : "paid";
  const updates: Record<string, unknown> = { status: newStatus };

  // Store subscription ID for recurring
  if (session.subscription) {
    updates.stripe_subscription_id =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription.id;
  }

  await updateCustomer(customerId, updates);

  // Send notifications (fire-and-forget)
  const refreshed = await getCustomer(customerId);
  if (refreshed) {
    await Promise.allSettled([
      sendPaymentReceipt(refreshed, payment),
      notifyAdminPaymentReceived(refreshed, payment),
    ]);
  }

  console.log(
    `[BILLING WEBHOOK] Customer ${customerId} marked as ${newStatus} — $${amountPaid}`
  );
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Look up billing customer via stripe_customer_id
  const stripeCustomerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  if (!stripeCustomerId) return;

  const { getSupabaseAdmin } = await import("@/lib/supabase-server");
  const supabase = getSupabaseAdmin();
  const { data: customer } = await supabase
    .from("billing_customers")
    .select("*")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (!customer) return;

  const amountPaid = (invoice.amount_paid || 0) / 100;

  const payment = await recordPayment(customer.id, {
    amount: amountPaid,
    method: "Credit Card (Stripe Subscription)",
    status: "completed",
    note: `Recurring payment — Invoice ${invoice.id}`,
  });

  await Promise.allSettled([
    sendPaymentReceipt(customer, payment),
    notifyAdminPaymentReceived(customer, payment),
  ]);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const stripeCustomerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id;

  if (!stripeCustomerId) return;

  const { getSupabaseAdmin } = await import("@/lib/supabase-server");
  const supabase = getSupabaseAdmin();
  const { data: customer } = await supabase
    .from("billing_customers")
    .select("*")
    .eq("stripe_customer_id", stripeCustomerId)
    .single();

  if (!customer) return;

  const amountFailed = (invoice.amount_due || 0) / 100;

  await recordPayment(customer.id, {
    amount: amountFailed,
    method: "Credit Card (Stripe)",
    status: "failed",
    note: `Payment declined — Invoice ${invoice.id}`,
  });

  await Promise.allSettled([
    sendPaymentFailed(customer),
    notifyAdminPaymentFailed(customer),
  ]);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { getSupabaseAdmin } = await import("@/lib/supabase-server");
  const supabase = getSupabaseAdmin();
  const { data: customer } = await supabase
    .from("billing_customers")
    .select("*")
    .eq("stripe_subscription_id", subscription.id)
    .single();

  if (!customer) return;

  await updateCustomer(customer.id, {
    status: "cancelled",
    stripe_subscription_id: "",
  });

  console.log(
    `[BILLING WEBHOOK] Subscription cancelled for customer ${customer.id}`
  );
}
