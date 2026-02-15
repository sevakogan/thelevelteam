import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "@/components/ui/Header";

describe("Header", () => {
  it("renders logo", () => {
    render(<Header />);
    expect(screen.getByAltText("TheLevelTeam Logo")).toBeInTheDocument();
  });

  it("renders brand name", () => {
    render(<Header />);
    expect(screen.getByText("Team")).toBeInTheDocument();
  });

  it("renders navigation links on desktop", () => {
    render(<Header />);
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  it("nav links point to correct anchors", () => {
    render(<Header />);
    expect(screen.getByText("Work").closest("a")).toHaveAttribute("href", "/#portfolio");
    expect(screen.getByText("About").closest("a")).toHaveAttribute("href", "/#about");
    expect(screen.getByText("Contact").closest("a")).toHaveAttribute("href", "/#contact");
  });

  it("renders Hire Us button", () => {
    render(<Header />);
    expect(screen.getByText("Hire Us")).toBeInTheDocument();
    expect(screen.getByText("Hire Us").closest("button")).toBeInTheDocument();
  });
});
