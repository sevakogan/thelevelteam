import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase-server", () => ({
  getSupabaseAdmin: vi.fn(),
}));

vi.mock("@/lib/marketing/twilio", () => ({
  sendSMS: vi.fn().mockResolvedValue({ sid: "SM123", status: "queued", to: "+14155551234" }),
}));

vi.mock("@sendgrid/mail", () => ({
  default: {
    setApiKey: vi.fn(),
    send: vi.fn().mockResolvedValue([{ statusCode: 202 }]),
  },
}));

import { enrollLeadInCampaigns, processNextDripMessages } from "@/lib/marketing/drip";
import { getSupabaseAdmin } from "@/lib/supabase-server";
import type { Lead, DripCampaign } from "@/lib/marketing/types";

const mockLead: Lead = {
  id: "lead-123",
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "+14155551234",
  message: null,
  project_interest: null,
  source: "website",
  status: "new",
  sms_consent: true,
  email_consent: true,
  created_at: "2024-01-01T00:00:00Z",
  updated_at: "2024-01-01T00:00:00Z",
};

const mockSmsCampaign: DripCampaign = {
  id: "campaign-sms",
  name: "Welcome SMS",
  channel: "sms",
  messages: [
    { delay_days: 2, body: "Hello!" },
    { delay_days: 5, body: "Follow up!" },
  ],
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
};

const mockEmailCampaign: DripCampaign = {
  id: "campaign-email",
  name: "Welcome Email",
  channel: "email",
  messages: [
    { delay_days: 1, subject: "Welcome", body: "" },
    { delay_days: 3, subject: "Follow up", body: "" },
  ],
  is_active: true,
  created_at: "2024-01-01T00:00:00Z",
};

describe("enrollLeadInCampaigns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enrolls lead in all active campaigns", async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    const mockSupa = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [mockSmsCampaign, mockEmailCampaign],
            error: null,
          }),
        }),
        insert: insertMock,
      }),
    };
    vi.mocked(getSupabaseAdmin).mockReturnValue(mockSupa as never);

    await enrollLeadInCampaigns(mockLead);

    expect(insertMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ lead_id: "lead-123", campaign_id: "campaign-sms" }),
        expect.objectContaining({ lead_id: "lead-123", campaign_id: "campaign-email" }),
      ])
    );
  });

  it("skips SMS campaign when lead has no SMS consent", async () => {
    const leadNoSms = { ...mockLead, sms_consent: false };
    const insertMock = vi.fn().mockResolvedValue({ error: null });
    const mockSupa = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: [mockSmsCampaign, mockEmailCampaign],
            error: null,
          }),
        }),
        insert: insertMock,
      }),
    };
    vi.mocked(getSupabaseAdmin).mockReturnValue(mockSupa as never);

    await enrollLeadInCampaigns(leadNoSms);

    expect(insertMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ campaign_id: "campaign-email" }),
      ])
    );
    const insertedData = insertMock.mock.calls[0][0];
    expect(insertedData.find((d: { campaign_id: string }) => d.campaign_id === "campaign-sms")).toBeUndefined();
  });
});

describe("processNextDripMessages", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns zero when no messages are due", async () => {
    const mockSupa = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            lte: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      }),
    };
    vi.mocked(getSupabaseAdmin).mockReturnValue(mockSupa as never);

    const result = await processNextDripMessages();

    expect(result).toEqual({ sent: 0, errors: 0 });
  });
});
