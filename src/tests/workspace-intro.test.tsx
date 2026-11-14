import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { WorkspaceIntro } from "@/components/layout/WorkspaceIntro";

/**
 * The branded entry sequence replaced the plain "Initializing
 * Workspace..." spinner: it must hold while the session loads, and
 * once the session is ready it must play through (arrow flight +
 * iris reveal) and remove itself so the workspace is usable.
 */
describe("WorkspaceIntro", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the branded splash while the session is not ready", () => {
    render(<WorkspaceIntro ready={false} />);
    expect(screen.getByText("Initializing Workspace...")).toBeTruthy();
  });

  it("stays up on its own while the session is still loading", () => {
    vi.useFakeTimers();
    render(<WorkspaceIntro ready={false} />);
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.getByText("Initializing Workspace...")).toBeTruthy();
  });

  it("plays through and removes itself once the session is ready", () => {
    vi.useFakeTimers();
    render(<WorkspaceIntro ready />);
    act(() => {
      // Splash + flight + reveal, plus slack for the frame-settle
      // gate that arms the flight once the thread is painting.
      vi.advanceTimersByTime(550 + 680 + 800 + 700);
    });
    expect(screen.queryByText("Initializing Workspace...")).toBeNull();
  });
});
