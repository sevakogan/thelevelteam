import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockSingle = vi.fn();

const mockFrom = vi.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
  order: mockOrder,
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: mockFrom }),
}));

import { GET, POST } from "@/app/api/companies/route";

const MOCK_COMPANIES = [
  {
    id: "1",
    name: "CrownVault",
    slug: "crownvault",
    tagline: "Watch marketplace",
    color_primary: "#3B82F6",
    color_secondary: "#EC4899",
    tech_stack: ["Next.js"],
    display_order: 1,
    is_featured: true,
  },
  {
    id: "2",
    name: "RevenuFlow",
    slug: "revenuflow",
    tagline: "AI revenue management",
    color_primary: "#8B5CF6",
    color_secondary: "#06B6D4",
    tech_stack: ["Next.js"],
    display_order: 2,
    is_featured: true,
  },
];

describe("GET /api/companies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all companies ordered by display_order", async () => {
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: MOCK_COMPANIES, error: null });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(2);
    expect(data[0].name).toBe("CrownVault");
    expect(data[1].name).toBe("RevenuFlow");
    expect(mockFrom).toHaveBeenCalledWith("companies");
    expect(mockOrder).toHaveBeenCalledWith("display_order", { ascending: true });
  });

  it("returns 500 on Supabase error", async () => {
    mockSelect.mockReturnValue({ order: mockOrder });
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB error" } });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("DB error");
  });
});

describe("POST /api/companies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a company with valid admin password", async () => {
    const newCompany = { name: "TestCo", slug: "testco", tagline: "Test" };
    mockInsert.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: { id: "3", ...newCompany }, error: null });

    const req = new Request("http://localhost/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": "test-password",
      },
      body: JSON.stringify(newCompany),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await POST(req as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe("TestCo");
  });

  it("rejects with 401 when password is missing", async () => {
    const req = new Request("http://localhost/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "TestCo" }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await POST(req as any);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("rejects with 401 when password is wrong", async () => {
    const req = new Request("http://localhost/api/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": "wrong-password",
      },
      body: JSON.stringify({ name: "TestCo" }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await POST(req as any);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });
});
