import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/billing/auth";
import { getCustomer, getCustomerPayments } from "@/lib/billing/customers";
import { paymentReceiptEmail } from "@/lib/billing/email-templates";
import { MARKETING_CONFIG } from "@/lib/marketing/config";

export async function GET(
  req: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    if (!(await isAuthorized(req))) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { customerId } = params;
    const paymentId = req.nextUrl.searchParams.get("paymentId");

    if (!paymentId) {
      return new NextResponse("Missing paymentId", { status: 400 });
    }

    const customer = await getCustomer(customerId);
    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    const payments = await getCustomerPayments(customerId);
    const payment = payments.find((p) => p.id === paymentId);

    if (!payment) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    const companyName = MARKETING_CONFIG.company.name;
    const { html } = paymentReceiptEmail(customer, payment, companyName);

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    console.error("[BILLING] Receipt view error:", err);
    return new NextResponse("Failed to generate receipt", { status: 500 });
  }
}
