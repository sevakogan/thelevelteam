import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Supabase
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockEq = vi.fn();

const mockFrom = vi.fn(() => ({
  update: mockUpdate,
  delete: mockDelete,
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: mockFrom }),
}));

import { PUT, DELETE } from "@/app/api/companies/[id]/route";

describe("PUT /api/companies/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates a company with valid admin password", async () => {
    const updated = { name: "UpdatedCo", slug: "updated" };
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: { id: "1", ...updated }, error: null });

    const req = new Request("http://localhost/api/companies/1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": "test-password",
      },
      body: JSON.stringify(updated),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await PUT(req as any, { params: { id: "1" } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe("UpdatedCo");
    expect(mockFrom).toHaveBeenCalledWith("companies");
    expect(mockEq).toHaveBeenCalledWith("id", "1");
  });

  it("rejects with 401 when password is wrong", async () => {
    const req = new Request("http://localhost/api/companies/1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": "wrong",
      },
      body: JSON.stringify({ name: "Hack" }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await PUT(req as any, { params: { id: "1" } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 500 on Supabase error", async () => {
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ select: mockSelect });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockSingle.mockResolvedValue({ data: null, error: { message: "Update failed" } });

    const req = new Request("http://localhost/api/companies/1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": "test-password",
      },
      body: JSON.stringify({ name: "Test" }),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await PUT(req as any, { params: { id: "1" } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Update failed");
  });
});

describe("DELETE /api/companies/:id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes a company with valid admin password", async () => {
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: null });

    const req = new Request("http://localhost/api/companies/1", {
      method: "DELETE",
      headers: { "x-admin-password": "test-password" },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await DELETE(req as any, { params: { id: "1" } });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockEq).toHaveBeenCalledWith("id", "1");
  });

  it("rejects with 401 when password is missing", async () => {
    const req = new Request("http://localhost/api/companies/1", {
      method: "DELETE",
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await DELETE(req as any, { params: { id: "1" } });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 500 on Supabase error", async () => {
    mockDelete.mockReturnValue({ eq: mockEq });
    mockEq.mockResolvedValue({ error: { message: "Delete failed" } });

    const req = new Request("http://localhost/api/companies/1", {
      method: "DELETE",
      headers: { "x-admin-password": "test-password" },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await DELETE(req as any, { params: { id: "1" } });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Delete failed");
  });
});
