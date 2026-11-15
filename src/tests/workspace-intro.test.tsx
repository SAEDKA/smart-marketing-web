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

  it("flies right and never flips, even when the account corner is on the left (RTL)", () => {
    vi.useFakeTimers();
    // Account button parked at the top-left, as in the RTL header.
    const target = document.createElement("div");
    target.setAttribute("data-intro-target", "account");
    target.getBoundingClientRect = () =>
      ({ left: 8, top: 8, right: 48, bottom: 48, width: 40, height: 40, x: 8, y: 8, toJSON: () => {} }) as DOMRect;
    document.body.appendChild(target);
    try {
      const { container } = render(<WorkspaceIntro ready />);
      act(() => {
        // Past the frame-settle cap (1000ms) + splash (550ms): the
        // flight has started.
        vi.advanceTimersByTime(1600);
      });
      const svg = container.querySelector("svg");
      expect(svg).toBeTruthy();
      // No horizontal flip is ever applied to the arrow artwork.
      expect(svg?.style.transform ?? "").not.toContain("scaleX(-1)");
      // The flight translation heads right (positive dx): the
      // left-side corner (center x=28 of a 1024-wide window) is
      // mirrored to x=996.
      const flyer = svg?.parentElement as HTMLElement | null;
      expect(flyer?.style.transform).toContain("+ 996px");
    } finally {
      target.remove();
    }
  });
});
