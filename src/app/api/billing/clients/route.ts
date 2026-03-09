import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, getAuthUserId } from "@/lib/billing/auth";
import { getClients, createClient } from "@/lib/billing/clients";

export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clients = await getClients(userId);
    return NextResponse.json(clients);
  } catch (err) {
    console.error("[BILLING] Failed to fetch clients:", err);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = await getAuthUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.company_name?.trim()) {
      return NextResponse.json({ error: "company_name is required" }, { status: 400 });
    }

    const client = await createClient(userId, body);
    return NextResponse.json(client, { status: 201 });
  } catch (err) {
    console.error("[BILLING] Failed to create client:", err);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
