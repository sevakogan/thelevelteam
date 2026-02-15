import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all external dependencies
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

vi.mock("@/lib/marketing/drip", () => ({
  enrollLeadInCampaigns: vi.fn().mockResolvedValue(undefined),
}));

import { POST, GET } from "@/app/api/marketing/leads/route";
import { getSupabaseAdmin } from "@/lib/supabase-server";

const mockLead = {
  id: "lead-123",
  name: "John Doe",
  email: "john@example.com",
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

function createMockSupabase(overrides?: { insertError?: string; selectError?: string }) {
  const selectChain = {
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockResolvedValue({
      data: [mockLead],
      error: overrides?.selectError ? { message: overrides.selectError } : null,
    }),
    single: vi.fn().mockResolvedValue({
      data: mockLead,
      error: null,
    }),
  };

  const insertChain = {
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: mockLead,
          error: overrides?.insertError ? { message: overrides.insertError } : null,
        }),
      }),
    }),
  };

  return {
    from: vi.fn((table: string) => {
      void table;
      return { ...selectChain, ...insertChain };
    }),
  };
}

function createRequest(body: Record<string, unknown>, headers?: Record<string, string>) {
  return new Request("http://localhost:3000/api/marketing/leads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

function createGetRequest(headers?: Record<string, string>) {
  return new Request("http://localhost:3000/api/marketing/leads", {
    method: "GET",
    headers: headers ?? {},
  }) as unknown as Parameters<typeof GET>[0];
}

describe("POST /api/marketing/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_PASSWORD = "test-password";
    process.env.TWILIO_ACCOUNT_SID = "AC_test";
    process.env.TWILIO_AUTH_TOKEN = "test_token";
    process.env.TWILIO_PHONE_NUMBER = "+15005550006";
    process.env.SENDGRID_API_KEY = "SG.test";
    process.env.SENDGRID_FROM_EMAIL = "test@example.com";
  });

  it("creates a lead with valid input", async () => {
    const mockSupa = createMockSupabase();
    vi.mocked(getSupabaseAdmin).mockReturnValue(mockSupa as never);

    const res = await POST(
      createRequest({
        name: "John Doe",
        email: "john@example.com",
        phone: "+14155551234",
        smsConsent: true,
        emailConsent: true,
      })
    );

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.leadId).toBe("lead-123");
  });

  it("rejects invalid input (missing fields)", async () => {
    const res = await POST(
      createRequest({
        name: "J",
        email: "not-an-email",
        phone: "bad-phone",
      })
    );

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Validation failed");
    expect(data.details).toBeDefined();
  });

  it("rejects empty body", async () => {
    const res = await POST(createRequest({}));

    expect(res.status).toBe(400);
  });
});

describe("GET /api/marketing/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_PASSWORD = "test-password";
  });

  it("returns leads for admin", async () => {
    const mockSupa = createMockSupabase();
    vi.mocked(getSupabaseAdmin).mockReturnValue(mockSupa as never);

    const res = await GET(
      createGetRequest({ "x-admin-password": "test-password" })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it("rejects unauthenticated requests", async () => {
    const res = await GET(createGetRequest());

    expect(res.status).toBe(401);
  });

  it("rejects wrong password", async () => {
    const res = await GET(
      createGetRequest({ "x-admin-password": "wrong" })
    );

    expect(res.status).toBe(401);
  });
});
