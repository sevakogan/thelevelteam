import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/billing/auth";
import {
  getCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerPayments,
} from "@/lib/billing/customers";
import { validateUpdateCustomer } from "@/lib/billing/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const customer = await getCustomer(id);
    if (!customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const payments = await getCustomerPayments(id);
    return NextResponse.json({ customer, payments });
  } catch (err) {
    console.error("[BILLING] Failed to fetch customer:", err);
    return NextResponse.json(
      { error: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const result = validateUpdateCustomer(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const customer = await updateCustomer(id, result.data);
    return NextResponse.json(customer);
  } catch (err) {
    console.error("[BILLING] Failed to update customer:", err);
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteCustomer(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[BILLING] Failed to delete customer:", err);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
