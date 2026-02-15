import { describe, it, expect } from "vitest";
import { getWelcomeSMS, getDripSMS, getWelcomeEmail, getDripEmail } from "@/lib/marketing/templates";
import type { Lead } from "@/lib/marketing/types";

const mockLead: Lead = {
  id: "test-id-123",
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "+14155551234",
  message: null,
  project_interest: "crownvault",
  source: "website",
  status: "new",
  sms_consent: true,
  email_consent: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

describe("SMS Templates", () => {
  it("generates welcome SMS with lead name", () => {
    const sms = getWelcomeSMS(mockLead);
    expect(sms).toContain("Jane Smith");
    expect(sms).toContain("TheLevelTeam");
    expect(sms).toContain("STOP");
  });

  it("generates drip SMS for each step", () => {
    for (let step = 0; step < 4; step++) {
      const sms = getDripSMS(step, mockLead);
      expect(sms).toBeTruthy();
      expect(typeof sms).toBe("string");
      expect(sms.length).toBeGreaterThan(10);
    }
  });

  it("returns last message for out-of-range step", () => {
    const sms = getDripSMS(99, mockLead);
    expect(sms).toBeTruthy();
  });
});

describe("Email Templates", () => {
  it("generates welcome email with subject and html", () => {
    const email = getWelcomeEmail(mockLead);
    expect(email.subject).toContain("Jane Smith");
    expect(email.html).toContain("Jane Smith");
    expect(email.html).toContain("crownvault");
    expect(email.html).toContain("Unsubscribe");
    expect(email.html).toContain("leadId=test-id-123");
  });

  it("generates welcome email without project interest", () => {
    const leadNoProject = { ...mockLead, project_interest: null };
    const email = getWelcomeEmail(leadNoProject);
    expect(email.html).not.toContain("crownvault");
  });

  it("generates drip emails for each step", () => {
    for (let step = 0; step < 4; step++) {
      const email = getDripEmail(step, mockLead);
      expect(email.subject).toBeTruthy();
      expect(email.html).toContain("Unsubscribe");
      expect(email.html).toContain("<!DOCTYPE html>");
    }
  });

  it("returns last email for out-of-range step", () => {
    const email = getDripEmail(99, mockLead);
    expect(email.subject).toBeTruthy();
    expect(email.html).toBeTruthy();
  });
});
