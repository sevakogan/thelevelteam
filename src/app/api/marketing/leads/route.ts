import { NextRequest, NextResponse } from "next/server";
import { validateLeadForm } from "@/lib/marketing/validation";
import { createLead, getLeads, updateLead, deleteLead } from "@/lib/marketing/leads";
import { sendEmail } from "@/lib/marketing/sendgrid";
import { getWelcomeEmail } from "@/lib/marketing/templates";
import { enrollLeadInCampaigns } from "@/lib/marketing/drip";
import { pushLeadToQuo } from "@/lib/quo";
import { createSupabaseServer } from "@/lib/supabase-auth-server";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = validateLeadForm(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const lead = await createLead({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone,
      message: result.data.message,
      projectInterest: result.data.projectInterest,
      smsConsent: result.data.smsConsent,
      emailConsent: result.data.emailConsent,
      source: result.data.source,
    });

    // Send immediate welcome messages (fire-and-forget, don't block response)
    const welcomePromises: Promise<unknown>[] = [];

    const supabase = getSupabaseAdmin();

    // Quo SMS auto-reply (if lead has phone + SMS consent)
    if (lead.sms_consent && lead.phone) {
      welcomePromises.push(
        pushLeadToQuo({
          name: lead.name,
          email: lead.email ?? undefined,
          phone: lead.phone ?? undefined,
          source: result.data.source || "website",
          message: lead.message ?? undefined,
          projectInterest: lead.project_interest ?? undefined,
        }).catch((err) => console.error("Quo SMS failed:", err))
      );
    }

    if (lead.email_consent) {
      const { subject, html } = getWelcomeEmail(lead);
      welcomePromises.push(
        sendEmail(lead.email, subject, html)
          .then(() => {
            // Store outbound welcome email
            supabase.from("email_messages").insert({
              lead_id: lead.id,
              email: lead.email,
              direction: "outbound",
              subject,
              body: `Welcome email sent to ${lead.name}`,
              status: "sent",
            }).then(({ error: insertErr }) => {
              if (insertErr) console.warn("Could not store welcome email:", insertErr.message);
            });
          })
          .catch((err) => console.error("Welcome email failed:", err))
      );
    }

    // Enroll in drip campaigns
    welcomePromises.push(
      enrollLeadInCampaigns(lead).catch((err) =>
        console.error("Drip enrollment failed:", err)
      )
    );

    // Wait for all welcome messages but don't fail the request
    await Promise.allSettled(welcomePromises);

    return NextResponse.json(
      { success: true, leadId: lead.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Lead creation failed:", err);
    return NextResponse.json(
      { error: "Failed to process inquiry" },
      { status: 500 }
    );
  }
}

async function isAuthorized(req: NextRequest): Promise<boolean> {
  const password = req.headers.get("x-admin-password");
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();
  if (password && adminPassword && password === adminPassword) return true;

  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (err) {
    console.error("Failed to fetch leads:", err);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...fields } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid lead id" },
        { status: 400 }
      );
    }

    // Strip client-only fields that don't exist in the DB
    delete fields.assigned_campaigns;
    delete fields.assigned_pipelines;

    const updated = await updateLead(id, fields);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update lead:", err);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAuthorized(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing lead id" },
        { status: 400 }
      );
    }

    await deleteLead(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete lead:", err);
    return NextResponse.json(
      { error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
