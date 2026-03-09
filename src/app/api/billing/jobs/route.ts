import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, getAuthUserId } from "@/lib/billing/auth";
import { getJobs, createJob } from "@/lib/billing/jobs";
import { validateCreateJob } from "@/lib/billing/validation";

export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getAuthUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = req.nextUrl.searchParams.get("clientId");

    if (clientId) {
      // Return only jobs used in previous invoices for this client
      const { getSupabaseAdmin } = await import("@/lib/supabase-server");
      const supabase = getSupabaseAdmin();
      const { data } = await supabase
        .from("billing_customers")
        .select("job_id")
        .eq("client_id", clientId)
        .not("job_id", "is", null);

      const jobIds = [...new Set((data ?? []).map((r: { job_id: string }) => r.job_id).filter(Boolean))];
      if (jobIds.length === 0) return NextResponse.json([]);

      const allJobs = await getJobs(userId);
      return NextResponse.json(allJobs.filter((j) => jobIds.includes(j.id)));
    }

    const jobs = await getJobs(userId);
    return NextResponse.json(jobs);
  } catch (err) {
    console.error("[BILLING] Failed to fetch jobs:", err);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
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
    const result = validateCreateJob(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const job = await createJob(userId, result.data);
    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create job";
    const status = message.includes("already exists") ? 409 : 500;
    console.error("[BILLING] Failed to create job:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
