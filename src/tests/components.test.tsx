import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";

describe("Liquid Glass Design System Components (WEB-01-08)", () => {
  it("renders Button with primary styling and handles loading state", () => {
    const { rerender } = render(<Button variant="primary">Click Me</Button>);
    expect(screen.getByRole("button", { name: "Click Me" })).toBeDefined();

    rerender(
      <Button variant="primary" isLoading>
        Click Me
      </Button>
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders Input with accessible error message and label", () => {
    render(
      <Input
        label="Work Email"
        error="Invalid format"
        placeholder="user@company.com"
      />
    );
    expect(screen.getByLabelText(/Work Email/i)).toBeDefined();
    expect(screen.getByText("Invalid format")).toBeDefined();
  });

  it("renders Badge with semantic mint variant", () => {
    render(<Badge variant="mint">R1 Completed</Badge>);
    expect(screen.getByText("R1 Completed")).toBeDefined();
  });

  it("renders Card with title and content", () => {
    render(
      <Card>
        <CardTitle>Workspace Overview</CardTitle>
        <CardContent>SaaS Control Center</CardContent>
      </Card>
    );
    expect(screen.getByText("Workspace Overview")).toBeDefined();
    expect(screen.getByText("SaaS Control Center")).toBeDefined();
  });
});
