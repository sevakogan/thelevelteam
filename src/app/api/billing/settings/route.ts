import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, getAuthUserId } from "@/lib/billing/auth";
import { getBillingSettings, upsertBillingSettings } from "@/lib/billing/customers";
import { validateBillingSettings } from "@/lib/billing/validation";

export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getBillingSettings(userId);
    return NextResponse.json(settings ?? {
      company_name: "TheLevelTeam",
      company_tagline: "",
      company_email: "",
      company_phone: "",
      company_address: "",
      logo_url: "",
    });
  } catch (err) {
    console.error("[BILLING] Failed to fetch settings:", err);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
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
    const result = validateBillingSettings(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const settings = await upsertBillingSettings(userId, result.data);
    return NextResponse.json(settings);
  } catch (err) {
    console.error("[BILLING] Failed to save settings:", err);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 }
    );
  }
}
