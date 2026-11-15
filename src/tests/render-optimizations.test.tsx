import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, renderHook } from "@testing-library/react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { useSpotlight } from "@/lib/hooks/use-spotlight";

describe("Render optimizations (re-render fix)", () => {
  it("AnimatedCounter renders the formatted final value on first paint", () => {
    render(<AnimatedCounter value={43000} />);
    expect(screen.getByText("43,000")).toBeDefined();
  });

  it("useSpotlight returns a stable handler across re-renders", () => {
    const { result, rerender } = renderHook(() => useSpotlight());
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });

  it("useSpotlight writes --mouse-x/--mouse-y on the hovered element", () => {
    const { result } = renderHook(() => useSpotlight());
    const el = document.createElement("div");
    el.getBoundingClientRect = () =>
      ({ left: 10, top: 20, right: 110, bottom: 120, width: 100, height: 100, x: 10, y: 20, toJSON: () => {} }) as DOMRect;

    result.current({
      currentTarget: el,
      clientX: 60,
      clientY: 70,
    } as unknown as React.MouseEvent<HTMLElement>);

    // The write is coalesced into the next animation frame.
    return new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        expect(el.style.getPropertyValue("--mouse-x")).toBe("50px");
        expect(el.style.getPropertyValue("--mouse-y")).toBe("50px");
        resolve();
      });
    });
  });
});
