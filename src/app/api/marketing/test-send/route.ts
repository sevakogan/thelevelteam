import { NextRequest, NextResponse } from "next/server";
import { sendSMS } from "@/lib/marketing/twilio";
import { sendEmail } from "@/lib/marketing/sendgrid";
import { notifySlack } from "@/lib/marketing/slack";
import { getWelcomeEmail, getDripEmail } from "@/lib/marketing/templates";
import type { Lead } from "@/lib/marketing/types";

const FAKE_LEAD: Lead = {
  id: "test-preview-000",
  name: "Seva",
  email: "sevakogan@gmail.com",
  phone: "+19544591697",
  address: null,
  company: null,
  notes: null,
  message: "I need a website for my business",
  project_interest: null,
  sms_consent: true,
  email_consent: true,
  source: "drip-preview",
  status: "incoming",
  assigned_campaigns: [],
  assigned_pipelines: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (key !== "tlt-diag-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const mode = searchParams.get("mode");

  // mode=drip — send all drip emails with delay
  if (mode === "drip") {
    const delayMs = Number(searchParams.get("delay") || "30000");
    const results: Record<string, unknown>[] = [];

    // Welcome email first
    try {
      const { subject, html } = getWelcomeEmail(FAKE_LEAD);
      await sendEmail(FAKE_LEAD.email, subject, html);
      results.push({ step: "welcome", subject, status: "sent" });
    } catch (err: unknown) {
      const e = err as { message?: string };
      results.push({ step: "welcome", error: e.message ?? String(err) });
    }

    // Drip steps 0-3
    for (let i = 0; i < 4; i++) {
      await new Promise((r) => setTimeout(r, delayMs));
      try {
        const { subject, html } = getDripEmail(i, FAKE_LEAD);
        await sendEmail(FAKE_LEAD.email, subject, html);
        results.push({ step: `drip-${i}`, subject, status: "sent" });
      } catch (err: unknown) {
        const e = err as { message?: string };
        results.push({ step: `drip-${i}`, error: e.message ?? String(err) });
      }
    }

    return NextResponse.json({ emails: results });
  }

  // Default diagnostic mode
  const results: Record<string, unknown> = {};

  try {
    await notifySlack(":test_tube: *Diagnostic test* — if you see this, Slack works!");
    results.slack = "ok";
  } catch (err) {
    results.slack = { error: String(err) };
  }

  try {
    const sms = await sendSMS("+19544591697", "TheLevelTeam test — SMS is working!");
    results.sms = { ok: true, sid: sms.sid, status: sms.status };
  } catch (err) {
    results.sms = { error: String(err) };
  }

  try {
    const email = await sendEmail(
      "sevakogan@gmail.com",
      "TheLevelTeam Test — Email is working!",
      "<h1>It works!</h1><p>Your SendGrid email integration is live.</p>"
    );
    results.email = { ok: true, to: email.to };
  } catch (err: unknown) {
    const e = err as { response?: { body?: unknown }; message?: string };
    results.email = {
      error: e.message ?? String(err),
      details: e.response?.body ?? null,
    };
  }

  results.env = {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY ? `set (${process.env.SENDGRID_API_KEY.slice(0, 8)}...)` : "MISSING",
    SENDGRID_FROM_EMAIL: process.env.SENDGRID_FROM_EMAIL ?? "MISSING",
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID ? `set (${process.env.TWILIO_ACCOUNT_SID.slice(0, 8)}...)` : "MISSING",
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN ? "set" : "MISSING",
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER ?? "MISSING",
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL ? "set" : "MISSING",
  };

  return NextResponse.json(results);
}
