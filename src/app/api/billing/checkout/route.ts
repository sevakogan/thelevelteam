import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/billing/stripe";
import { getCustomer, updateCustomer } from "@/lib/billing/customers";

export async function POST(req: NextRequest) {
  try {
    const { customerId, token } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    const customer = await getCustomer(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    if (customer.amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const stripe = getStripe();
    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://thelevelteam.com";

    const returnPath = token
      ? `/billing/${token}`
      : "/dashboard/billing";
    const successUrl = `${origin}${returnPath}?payment=success`;
    const cancelUrl = `${origin}${returnPath}?payment=cancelled`;

    // Create or reuse Stripe Customer
    let stripeCustomerId = customer.stripe_customer_id;
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        name: customer.company_name,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        metadata: { billing_customer_id: customer.id },
      });
      stripeCustomerId = stripeCustomer.id;
      await updateCustomer(customer.id, {
        stripe_customer_id: stripeCustomerId,
      });
    }

    if (customer.recurring) {
      // Recurring: Create subscription via Checkout
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: stripeCustomerId,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${customer.company_name} — ${customer.description || "Subscription"}`,
              },
              unit_amount: Math.round(customer.amount * 100),
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        metadata: {
          billing_customer_id: customer.id,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return NextResponse.json({ url: session.url });
    } else {
      // One-time payment
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Invoice — ${customer.company_name}`,
                description: customer.description || undefined,
              },
              unit_amount: Math.round(customer.amount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          billing_customer_id: customer.id,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      return NextResponse.json({ url: session.url });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("[BILLING CHECKOUT] error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
