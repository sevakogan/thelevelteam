import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/billing/auth";
import { getCustomer, getCustomerPayments } from "@/lib/billing/customers";
import { sendPaymentReceipt } from "@/lib/billing/notifications";
import { MARKETING_CONFIG } from "@/lib/marketing/config";

export async function POST(
  req: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = params;
    const body = await req.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    const customer = await getCustomer(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    const payments = await getCustomerPayments(customerId);
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (!customer.email) {
      return NextResponse.json(
        { error: "Customer has no email address" },
        { status: 400 }
      );
    }

    await sendPaymentReceipt(customer, payment);

    console.log(
      `[BILLING] Receipt sent for payment ${paymentId} to ${customer.email} (${MARKETING_CONFIG.company.name})`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[BILLING] Send receipt error:", err);
    return NextResponse.json(
      { error: "Failed to send receipt" },
      { status: 500 }
    );
  }
}
