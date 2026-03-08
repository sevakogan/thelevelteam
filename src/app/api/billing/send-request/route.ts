import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/billing/auth";
import { getCustomer, updateCustomer } from "@/lib/billing/customers";
import { generateShareToken } from "@/lib/billing/share-token";
import { sendPaymentRequest } from "@/lib/billing/notifications";

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = await req.json();
    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    let customer = await getCustomer(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    if (!customer.email && !customer.phone) {
      return NextResponse.json(
        { error: "Customer has no email or phone" },
        { status: 400 }
      );
    }

    // Generate share token if missing
    if (!customer.share_token) {
      const token = generateShareToken();
      customer = await updateCustomer(customer.id, { share_token: token });
    }

    // Send email + SMS
    await sendPaymentRequest(customer);

    // Update status to sent
    if (customer.status === "lead") {
      await updateCustomer(customer.id, { status: "in_process" });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[BILLING] Send request error:", err);
    return NextResponse.json(
      { error: "Failed to send payment request" },
      { status: 500 }
    );
  }
}
