"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export interface HeadlineSegment {
  readonly text: string;
  readonly accent?: boolean;
}

const TYPE_MS = 28;

/**
 * Landing hero headline with a one-shot typewriter reveal.
 *
 * The headline is defined as segments so the brand words (the
 * "AI" / "marketing" equivalents in each locale) can carry the
 * emerald-to-cyan gradient — including mid-typing, because the
 * reveal slices each segment's text rather than the joined string.
 *
 * Layout never jumps: an invisible full copy of the headline
 * reserves its exact space, and the typed rendering is overlaid
 * on top of it. The full text is also the h1's aria-label, so
 * assistive tech and crawlers always get the complete headline;
 * the typing is purely visual.
 *
 * The effect plays once for the first headline shown on this
 * mount. If the text changes afterwards (a language switch), the
 * full headline snaps in instantly instead of re-typing.
 *
 * Per the product owner's standing decision for this site's
 * branded animations (see WorkspaceIntro), the sequence plays
 * for everyone and is not gated on prefers-reduced-motion.
 */
export function TypewriterHeadline({
  segments,
  className,
  onDone,
}: {
  segments: readonly HeadlineSegment[];
  className?: string;
  onDone?: () => void;
}) {
  const fullText = useMemo(
    () => segments.map((segment) => segment.text).join(""),
    [segments],
  );
  const [count, setCount] = useState(0);
  const [settled, setSettled] = useState(false);
  const firstTextRef = useRef<string | null>(null);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (firstTextRef.current === null) {
      firstTextRef.current = fullText;
    }
    if (fullText !== firstTextRef.current) {
      // Language switched mid-visit: show the new headline whole.
      setCount(fullText.length);
      setSettled(true);
      if (!doneRef.current) {
        doneRef.current = true;
        onDoneRef.current?.();
      }
      return;
    }
    if (doneRef.current) return;
    let typed = 0;
    const id = window.setInterval(() => {
      typed += 1;
      setCount(typed);
      if (typed >= fullText.length) {
        window.clearInterval(id);
        doneRef.current = true;
        setSettled(true);
        onDoneRef.current?.();
      }
    }, TYPE_MS);
    return () => window.clearInterval(id);
  }, [fullText]);

  let remaining = count;

  return (
    <h1 aria-label={fullText} className={`relative ${className ?? ""}`}>
      <span aria-hidden="true" className="invisible">
        {fullText}
      </span>
      <span
        aria-hidden="true"
        data-testid="typewriter-visual"
        className="absolute inset-0"
      >
        {segments.map((segment, index) => {
          const take = Math.max(0, Math.min(segment.text.length, remaining));
          remaining -= take;
          if (take === 0) return null;
          const text = segment.text.slice(0, take);
          if (!segment.accent) return <span key={index}>{text}</span>;
          return (
            <span
              key={index}
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(92deg, var(--accent-mint), var(--accent-cyan))",
              }}
            >
              {text}
            </span>
          );
        })}
        <span
          className={`ms-1 inline-block h-[0.8em] w-[3px] translate-y-[0.1em] rounded-full bg-accent-mint transition-opacity duration-500 ${
            settled ? "opacity-0" : "animate-pulse"
          }`}
        />
      </span>
    </h1>
  );
}
