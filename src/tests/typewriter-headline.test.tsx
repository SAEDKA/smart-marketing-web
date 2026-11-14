import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  TypewriterHeadline,
  type HeadlineSegment,
} from "@/components/landing/TypewriterHeadline";

const SEGMENTS: HeadlineSegment[] = [
  { text: "AI", accent: true },
  { text: " social media " },
  { text: "marketing", accent: true },
  { text: " for independent businesses." },
];
const FULL = "AI social media marketing for independent businesses.";

function visualText(container: HTMLElement): string {
  return container.querySelector('[data-testid="typewriter-visual"]')
    ?.textContent as string;
}

describe("TypewriterHeadline", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("exposes the complete headline to assistive tech immediately", () => {
    vi.useFakeTimers();
    render(<TypewriterHeadline segments={SEGMENTS} />);
    expect(screen.getByRole("heading", { name: FULL })).toBeTruthy();
  });

  it("types progressively, accents included, then reports done once", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    const { container } = render(
      <TypewriterHeadline segments={SEGMENTS} onDone={onDone} />,
    );
    expect(visualText(container)).toBe("");
    act(() => {
      vi.advanceTimersByTime(28 * 5);
    });
    // "AI so" — the accent segment slices correctly mid-word-stream.
    expect(visualText(container)).toBe("AI so");
    expect(onDone).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(28 * FULL.length);
    });
    expect(visualText(container)).toBe(FULL);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("snaps to the full headline when the text changes (language switch)", () => {
    vi.useFakeTimers();
    const onDone = vi.fn();
    const { container, rerender } = render(
      <TypewriterHeadline segments={SEGMENTS} onDone={onDone} />,
    );
    act(() => {
      vi.advanceTimersByTime(28 * 3);
    });
    const turkish: HeadlineSegment[] = [
      { text: "Bağımsız işletmeler için " },
      { text: "yapay zeka", accent: true },
      { text: " sosyal medya " },
      { text: "pazarlaması", accent: true },
      { text: "." },
    ];
    rerender(<TypewriterHeadline segments={turkish} onDone={onDone} />);
    expect(visualText(container)).toBe(
      "Bağımsız işletmeler için yapay zeka sosyal medya pazarlaması.",
    );
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
