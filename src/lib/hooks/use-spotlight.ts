"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Shared handler for the `.glass-spotlight` cursor effect.
 *
 * Before: every `mousemove` event called `getBoundingClientRect()`
 * (a forced synchronous layout) and wrote CSS variables — dozens of
 * times per second, per card, with the handler re-created on every
 * render of the page that owned it.
 *
 * Now: the handler is stable (`useCallback`, created once), events are
 * coalesced into a single `requestAnimationFrame`, and the rect is
 * read exactly once per frame, only for the element under the cursor.
 * Visual result is identical — the CSS variables are the same.
 */
export function useSpotlight() {
  const rafIdRef = useRef<number | null>(null);
  const pendingRef = useRef<{ el: HTMLElement; x: number; y: number } | null>(null);

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    pendingRef.current = { el: e.currentTarget, x: e.clientX, y: e.clientY };
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const pending = pendingRef.current;
      if (!pending) return;
      const rect = pending.el.getBoundingClientRect();
      pending.el.style.setProperty("--mouse-x", `${pending.x - rect.left}px`);
      pending.el.style.setProperty("--mouse-y", `${pending.y - rect.top}px`);
    });
  }, []);
}
