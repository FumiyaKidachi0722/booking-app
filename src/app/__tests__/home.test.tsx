import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Home from "../page";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

describe("Home page", () => {
  it("links to reservation page", () => {
    render(<Home />);
    const link = screen.getByRole("link", { name: "予約する" });
    expect(link).toHaveAttribute("href", "/reserve");
  });
});
