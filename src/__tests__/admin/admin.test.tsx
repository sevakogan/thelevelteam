import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminPage from "@/app/(dashboard)/admin/page";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.confirm
global.confirm = vi.fn(() => true);

const MOCK_COMPANIES = [
  {
    id: "1",
    name: "CrownVault",
    slug: "crownvault",
    tagline: "Watch marketplace",
    description: "",
    image_url: "",
    live_url: "https://crownvault.vercel.app",
    color_primary: "#3B82F6",
    color_secondary: "#EC4899",
    tech_stack: ["Next.js", "TypeScript"],
    display_order: 1,
    is_featured: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "RevenuFlow",
    slug: "revenuflow",
    tagline: "AI revenue management",
    description: "",
    image_url: "",
    live_url: "https://revenuflow.vercel.app",
    color_primary: "#8B5CF6",
    color_secondary: "#06B6D4",
    tech_stack: ["Next.js"],
    display_order: 2,
    is_featured: true,
    created_at: "",
    updated_at: "",
  },
];

describe("Admin Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(MOCK_COMPANIES),
    });
  });

  it("renders login form when not authenticated", () => {
    render(<AdminPage />);
    expect(screen.getByPlaceholderText("Enter admin password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Admin Access")).toBeInTheDocument();
  });

  it("shows dashboard after login", async () => {
    const user = userEvent.setup();
    render(<AdminPage />);

    const passwordInput = screen.getByPlaceholderText("Enter admin password");
    await user.type(passwordInput, "test-password");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Portfolio Admin")).toBeInTheDocument();
    });
  });

  it("fetches and displays companies after login", async () => {
    const user = userEvent.setup();
    render(<AdminPage />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "test");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("CrownVault")).toBeInTheDocument();
      expect(screen.getByText("RevenuFlow")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/companies");
  });

  it("populates form when Edit is clicked", async () => {
    const user = userEvent.setup();
    render(<AdminPage />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "test");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("CrownVault")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);

    expect(screen.getByText("Edit Company")).toBeInTheDocument();
    expect(screen.getByDisplayValue("CrownVault")).toBeInTheDocument();
    expect(screen.getByDisplayValue("crownvault")).toBeInTheDocument();
  });

  it("resets form when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<AdminPage />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "test");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("CrownVault")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);

    expect(screen.getByDisplayValue("CrownVault")).toBeInTheDocument();

    await user.click(screen.getByText("Cancel"));

    // Form should show "New Company" (not editing anymore)
    expect(screen.getByText("New Company")).toBeInTheDocument();
  });

  it("calls DELETE when Delete is clicked and confirmed", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(MOCK_COMPANIES) }) // initial fetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ success: true }) }) // delete
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([MOCK_COMPANIES[1]]) }); // refetch

    render(<AdminPage />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "test");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("CrownVault")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    await user.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith("Delete this company?");
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/companies/1", expect.objectContaining({ method: "DELETE" }));
    });
  });

  it("submits create request for new company", async () => {
    const user = userEvent.setup();
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(MOCK_COMPANIES) }) // initial
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ id: "3", name: "NewCo" }) }) // create
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(MOCK_COMPANIES) }); // refetch

    render(<AdminPage />);

    await user.type(screen.getByPlaceholderText("Enter admin password"), "test");
    await user.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Portfolio Admin")).toBeInTheDocument();
    });

    // Fill form
    await user.type(screen.getByPlaceholderText("Company Name"), "NewCo");
    await user.type(screen.getByPlaceholderText("slug-name"), "newco");
    await user.type(screen.getByPlaceholderText("Tagline"), "A new company");

    await user.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/companies",
        expect.objectContaining({ method: "POST" })
      );
    });
  });

  it("does not login with empty password", async () => {
    const user = userEvent.setup();
    render(<AdminPage />);

    await user.click(screen.getByText("Login"));

    // Should still be on login page
    expect(screen.getByPlaceholderText("Enter admin password")).toBeInTheDocument();
    expect(screen.queryByText("Portfolio Admin")).not.toBeInTheDocument();
  });
});
