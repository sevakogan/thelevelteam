import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "@/components/ui/Logo";

describe("Logo", () => {
  it("renders image with correct alt text", () => {
    render(<Logo />);
    expect(screen.getByAltText("TheLevelTeam Logo")).toBeInTheDocument();
  });

  it("uses default size of 32", () => {
    render(<Logo />);
    const img = screen.getByAltText("TheLevelTeam Logo");
    expect(img).toHaveAttribute("width", "32");
    expect(img).toHaveAttribute("height", "32");
  });

  it("accepts custom size", () => {
    render(<Logo size={64} />);
    const img = screen.getByAltText("TheLevelTeam Logo");
    expect(img).toHaveAttribute("width", "64");
    expect(img).toHaveAttribute("height", "64");
  });

  it("accepts custom className", () => {
    render(<Logo className="my-custom-class" />);
    const img = screen.getByAltText("TheLevelTeam Logo");
    expect(img).toHaveClass("my-custom-class");
  });

  it("renders correct image source", () => {
    render(<Logo />);
    const img = screen.getByAltText("TheLevelTeam Logo");
    expect(img).toHaveAttribute("src", "/logo.png");
  });
});
