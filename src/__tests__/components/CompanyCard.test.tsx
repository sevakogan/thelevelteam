import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CompanyCard from "@/components/ui/CompanyCard";
import type { Company } from "@/lib/types";

const MOCK_COMPANY: Company = {
  id: "1",
  name: "CrownVault",
  slug: "crownvault",
  tagline: "Exclusive watch marketplace for premium dealers",
  description: "",
  image_url: "",
  live_url: "https://crownvault.vercel.app",
  color_primary: "#3B82F6",
  color_secondary: "#EC4899",
  tech_stack: ["Next.js", "TypeScript", "Supabase"],
  display_order: 1,
  is_featured: true,
  created_at: "",
  updated_at: "",
};

describe("CompanyCard", () => {
  it("renders company name", () => {
    render(<CompanyCard company={MOCK_COMPANY} index={0} />);
    expect(screen.getByText("CrownVault")).toBeInTheDocument();
  });

  it("renders company tagline", () => {
    render(<CompanyCard company={MOCK_COMPANY} index={0} />);
    expect(screen.getByText("Exclusive watch marketplace for premium dealers")).toBeInTheDocument();
  });

  it("renders tech stack badges", () => {
    render(<CompanyCard company={MOCK_COMPANY} index={0} />);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Supabase")).toBeInTheDocument();
  });

  it("links to project detail page", () => {
    render(<CompanyCard company={MOCK_COMPANY} index={0} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/projects/crownvault");
  });

  it("renders with reversed layout for odd index", () => {
    const { container } = render(<CompanyCard company={MOCK_COMPANY} index={1} />);
    const flexDiv = container.querySelector(".md\\:flex-row-reverse");
    expect(flexDiv).toBeInTheDocument();
  });

  it("renders with normal layout for even index", () => {
    const { container } = render(<CompanyCard company={MOCK_COMPANY} index={0} />);
    const flexDiv = container.querySelector(".md\\:flex-row");
    expect(flexDiv).toBeInTheDocument();
  });
});
