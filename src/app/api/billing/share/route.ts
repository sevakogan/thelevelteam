import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/billing/auth";
import {
  getCustomer,
  updateCustomer,
  getCustomerByToken,
  getCustomerPayments,
  getBillingSettingsByCustomerToken,
  appendStatusHistory,
} from "@/lib/billing/customers";
import { generateShareToken } from "@/lib/billing/share-token";
import { notifyAdminCancellationRequest } from "@/lib/billing/notifications";

// POST — Generate share token or handle public actions
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Public actions (from share page — no auth required)
    if (body.token && body.action) {
      const customer = await getCustomerByToken(body.token);
      if (!customer) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return handlePublicAction(customer.id, body.action, {
        signedBy: body.signedBy,
        reason: body.reason,
        currentStatus: customer.status,
      });
    }

    // Admin actions (auth required)
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
    }

    const customer = await getCustomer(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Return existing token or generate new one
    if (customer.share_token) {
      const base = process.env.NEXT_PUBLIC_SITE_URL || "https://thelevelteam.com";
      return NextResponse.json({
        token: customer.share_token,
        url: `${base}/billing/${customer.share_token}`,
        created: false,
      });
    }

    const token = generateShareToken();
    await updateCustomer(customer.id, { share_token: token });

    const base = process.env.NEXT_PUBLIC_SITE_URL || "https://thelevelteam.com";
    return NextResponse.json({
      token,
      url: `${base}/billing/${token}`,
      created: true,
    });
  } catch (err) {
    console.error("[BILLING] Share token error:", err);
    return NextResponse.json(
      { error: "Failed to generate share token" },
      { status: 500 }
    );
  }
}

// GET — Public fetch by token (no auth)
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const customer = await getCustomerByToken(token);
    if (!customer) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const payments = await getCustomerPayments(customer.id);
    const settings = await getBillingSettingsByCustomerToken(token);

    return NextResponse.json({
      customer: {
        id: customer.id,
        company_name: customer.company_name,
        description: customer.description,
        recurring: customer.recurring,
        amount: customer.amount,
        status: customer.status,
        contract_enabled: customer.contract_enabled,
        contract_content: customer.contract_content,
        contract_signed: customer.contract_signed,
        contract_signed_by: customer.contract_signed_by,
        contract_signed_date: customer.contract_signed_date,
        created_at: customer.created_at,
        cancellation_reason: customer.cancellation_reason,
        cancellation_requested_at: customer.cancellation_requested_at,
      },
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        method: p.method,
        status: p.status,
        paid_at: p.paid_at,
      })),
      settings: settings ?? {
        company_name: "TheLevelTeam",
        company_tagline: "",
        company_email: "",
        company_phone: "",
        company_address: "",
        logo_url: "",
      },
    });
  } catch (err) {
    console.error("[BILLING] Public fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}

// Handle public actions (no auth — from client share page)
async function handlePublicAction(
  customerId: string,
  action: string,
  data?: { signedBy?: string; reason?: string; currentStatus?: string }
) {
  try {
    const customer = await getCustomer(customerId);
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    switch (action) {
      case "signed": {
        if (!data?.signedBy) {
          return NextResponse.json(
            { error: "Missing signedBy" },
            { status: 400 }
          );
        }
        const updated = await updateCustomer(customer.id, {
          contract_signed: true,
          contract_signed_by: data.signedBy,
          contract_signed_date: new Date().toISOString(),
        });
        return NextResponse.json({ success: true, customer: updated });
      }

      case "viewed": {
        // Only update to "viewed" if currently "sent"
        if (data?.currentStatus === "sent") {
          await updateCustomer(customer.id, { status: "viewed" });
          await appendStatusHistory(customer.id, "viewed", "Customer opened the invoice");
        }
        return NextResponse.json({ success: true });
      }

      case "cancel_request": {
        const reason = data?.reason?.trim() ?? "";
        await updateCustomer(customer.id, {
          status: "cancellation_requested",
          cancellation_reason: reason || null,
          cancellation_requested_at: new Date().toISOString(),
        });
        await appendStatusHistory(
          customer.id,
          "cancellation_requested",
          reason ? `Customer reason: ${reason}` : "Customer requested cancellation"
        );

        // Notify admin
        const refreshed = await getCustomer(customer.id);
        if (refreshed) {
          await notifyAdminCancellationRequest(refreshed).catch((err) =>
            console.error("[BILLING] Failed to notify admin of cancel request:", err)
          );
        }

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err) {
    console.error("[BILLING] Public action error:", err);
    return NextResponse.json(
      { error: "Action failed" },
      { status: 500 }
    );
  }
}
