
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";
import React from "react";

describe("StatusBadge Component", () => {
  // 1. Happy Path
  it("renders the correct status text", () => {
    render(<StatusBadge status="Published" />);
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("applies the emerald color for Published status", () => {
    render(<StatusBadge status="Published" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveClass("bg-emerald-50");
  });

  // 2. Edge Cases
  it("renders Unknown when status is empty", () => {
    render(<StatusBadge status="" />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("applies default colors for unknown status", () => {
    render(<StatusBadge status="Strange Status" />);
    const badge = screen.getByTestId("status-badge");
    expect(badge).toHaveClass("bg-gray-50");
  });

  // 3. Error Handling / Extreme Values
  it("handles null status gracefully if passed via type trickery", () => {
    // @ts-ignore
    render(<StatusBadge status={null} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });
});
