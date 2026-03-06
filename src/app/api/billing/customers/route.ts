import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, getAuthUserId } from "@/lib/billing/auth";
import { getCustomers, createCustomer } from "@/lib/billing/customers";
import { validateCreateCustomer } from "@/lib/billing/validation";

export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customers = await getCustomers(userId);
    return NextResponse.json(customers);
  } catch (err) {
    console.error("[BILLING] Failed to fetch customers:", err);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = validateCreateCustomer(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const customer = await createCustomer(userId, result.data);
    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    console.error("[BILLING] Failed to create customer:", err);
    return NextResponse.json(
      { error: "Failed to create customer" },
      { status: 500 }
    );
  }
}
