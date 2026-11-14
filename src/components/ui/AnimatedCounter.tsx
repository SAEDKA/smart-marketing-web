"use client";

import React, { useEffect, useRef } from "react";

interface AnimatedCounterProps {
  value: number;
  durationMs?: number;
}

/**
 * Animated number that animates WITHOUT re-rendering React.
 *
 * Before: a `useAnimatedCounter` hook held the animated value in the
 * page's own state, so every animation frame (~33 frames in 550ms,
 * times 3 counters) re-rendered the entire dashboard page.
 *
 * Now: the animation writes directly to this component's own DOM node
 * via a ref. The parent renders once; this leaf updates its text
 * node once per frame with zero React renders. Users who prefer
 * reduced motion get the final value immediately.
 */
export const AnimatedCounter = React.memo(function AnimatedCounter({
  value,
  durationMs = 550,
}: AnimatedCounterProps) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = spanRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = value.toLocaleString();
      return;
    }

    let rafId: number;
    const startVal = Math.round(value * 0.72);
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = Math.round(
        startVal + (value - startVal) * eased
      ).toLocaleString();
      if (progress < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [value, durationMs]);

  return <span ref={spanRef}>{value.toLocaleString()}</span>;
});
