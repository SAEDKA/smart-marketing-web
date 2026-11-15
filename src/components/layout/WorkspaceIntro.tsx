"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

/**
 * Branded workspace entry sequence.
 *
 * Replaces the plain "Initializing Workspace..." spinner. The logo
 * appears, its growth arrow lifts off and flies to the right-hand
 * corner of the header — the account corner's height and edge inset,
 * measured live from the profile button and mirrored to the right
 * when that corner sits on the left (RTL) — and the workspace then
 * iris-opens from the exact point the arrow lands on. The arrow
 * always keeps the up-right shape it has in the logo artwork: the
 * owner reviewed the RTL flight (arrow flipped, flying left) on
 * 2026-11-15 and asked for the logo's own direction instead.
 *
 * Plays once per workspace mount (full load, refresh, fresh login);
 * in-app navigation never replays it because the workspace layout
 * stays mounted. Clicking skips ahead.
 *
 * Note: this sequence intentionally does NOT honor the OS
 * "prefers-reduced-motion" setting. It originally did, which made
 * the intro vanish on any machine with Windows animation effects
 * turned off — including the project owner's own PC (diagnosed
 * 2026-11-14: the dashboard appeared ~0.4s after entry there).
 * The branded entry is a product requirement, so it always plays.
 */

type Phase = "splash" | "fly" | "reveal" | "done";

// Timing: ≈2s end to end (550/680/800). Slower cuts (3.3s, then
// 6s) were tried while the sequence was being cancelled outright
// on the owner's PC by the OS reduced-motion setting — once that
// was fixed, the owner confirmed the original two-second pace is
// the right one, with the sequence playing for everyone.
const SPLASH_MS = 550;
const FLY_MS = 680;
const REVEAL_MS = 800;

interface Flight {
  dx: number;
  dy: number;
  x: number;
  y: number;
}

export function WorkspaceIntro({ ready }: { ready: boolean }) {
  const [phase, setPhase] = useState<Phase>("splash");
  const [flight, setFlight] = useState<Flight | null>(null);
  const [irisOpen, setIrisOpen] = useState(false);
  const logoRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const phaseRef = useRef<Phase>("splash");

  const go = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  const later = useCallback((fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms));
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const startFly = useCallback(() => {
    if (phaseRef.current !== "splash") return;
    const logoRect = logoRef.current?.getBoundingClientRect();
    const from = logoRect
      ? {
          x: logoRect.left + logoRect.width / 2,
          y: logoRect.top + logoRect.height / 2,
        }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const targetRect = document
      .querySelector('[data-intro-target="account"]')
      ?.getBoundingClientRect();
    const corner = targetRect
      ? {
          x: targetRect.left + targetRect.width / 2,
          y: targetRect.top + targetRect.height / 2,
        }
      : { x: window.innerWidth - 44, y: 40 };
    // Always land on the right: when the account corner is on the
    // left half (RTL), mirror it across the screen — same height,
    // same distance from the right edge as the button keeps from
    // the left — so the arrow flies right and never flips.
    const to =
      corner.x < window.innerWidth / 2
        ? { x: window.innerWidth - corner.x, y: corner.y }
        : corner;
    setFlight({
      dx: to.x - from.x,
      dy: to.y - from.y,
      x: to.x,
      y: to.y,
    });
    go("fly");
    later(() => go("reveal"), FLY_MS);
    later(() => go("done"), FLY_MS + REVEAL_MS);
  }, [go, later]);

  // Launch the flight only once the main thread is actually painting
  // again. On a busy machine (dev build, the workspace mounting
  // behind this overlay) the thread can stay blocked longer than
  // the whole 680ms flight; a transition started into that block
  // loses its opening frames and the arrow seems to teleport —
  // diagnosed by frame sampling on a throttled dev server, where
  // the arrow's first painted position was already 40% along its
  // path. So after `ready`: wait for a few fluid frames, then run
  // the splash countdown — with a hard cap so a pathological
  // machine still gets its flight, just possibly a choppier one.
  useEffect(() => {
    if (!ready || phase !== "splash") return;
    let cancelled = false;
    let raf = 0;
    let last = performance.now();
    let fluidFrames = 0;
    const arm = () => {
      if (cancelled) return;
      const id = window.setTimeout(startFly, SPLASH_MS);
      timersRef.current.push(id);
    };
    const cap = window.setTimeout(arm, 1000);
    timersRef.current.push(cap);
    const check = () => {
      if (cancelled) return;
      const now = performance.now();
      fluidFrames = now - last < 60 ? fluidFrames + 1 : 0;
      last = now;
      if (fluidFrames >= 2) {
        arm();
        return;
      }
      raf = window.requestAnimationFrame(check);
    };
    raf = window.requestAnimationFrame(check);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
    };
  }, [ready, phase, startFly]);

  useEffect(() => {
    if (phase !== "reveal") return;
    if (typeof window.requestAnimationFrame !== "function") {
      setIrisOpen(true);
      return;
    }
    const raf = window.requestAnimationFrame(() => setIrisOpen(true));
    return () => window.cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => clearTimers, [clearTimers]);

  const skip = () => {
    if (phase === "splash" && ready) {
      clearTimers();
      startFly();
    } else if (phase === "fly") {
      clearTimers();
      go("reveal");
      later(() => go("done"), REVEAL_MS);
    }
  };

  if (phase === "done") return null;

  const arrowTransform =
    phase === "splash"
      ? "translate(-50%, -50%)"
      : `translate(calc(-50% + ${flight?.dx ?? 0}px), calc(-50% + ${flight?.dy ?? 0}px)) scale(${phase === "fly" ? 0.3 : 0.05})`;

  return (
    <div
      role="status"
      aria-label="Initializing workspace"
      onClick={skip}
      className={cn(
        "fixed inset-0 z-[120]",
        phase === "reveal" && "pointer-events-none",
      )}
    >
      {phase !== "reveal" ? (
        <div className="absolute inset-0 bg-navy-950 overflow-hidden" aria-hidden="true">
          <div className="ambient-glow-violet -top-32 start-1/4" />
          <div className="ambient-glow-cyan top-1/3 -end-24" />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute rounded-full"
          style={{
            left: (flight?.x ?? 0) - 14,
            top: (flight?.y ?? 0) - 14,
            width: 28,
            height: 28,
            boxShadow: "0 0 0 200vmax rgb(var(--bg-deep-rgb))",
            transform: irisOpen ? "scale(320)" : "scale(1)",
            transition: `transform ${REVEAL_MS}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
          }}
        />
      )}

      {/* Brand stack: logo, wordmark, status caption */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div
          ref={logoRef}
          className="relative animate-in fade-in zoom-in-95 duration-500"
        >
          <div
            className={cn(
              "transition-opacity duration-300",
              phase !== "splash" && "opacity-0",
            )}
          >
            <BrandLogo className="w-28 h-28 shadow-glow-violet" />
          </div>

          {/* The arrow that lifts off the logo and flies to the right-hand corner */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 pointer-events-none"
            style={{
              transform: arrowTransform,
              willChange: "transform",
              opacity: phase === "reveal" ? 0 : 1,
              transition:
                phase === "fly"
                  ? `transform ${FLY_MS}ms cubic-bezier(0.3, 0.7, 0.3, 1)`
                  : phase === "reveal"
                    ? "transform 260ms ease-in, opacity 260ms ease"
                    : undefined,
            }}
          >
            <svg
              width="104"
              height="104"
              viewBox="0 0 96 96"
              fill="none"
            >
              <defs>
                <linearGradient id="intro-arrow" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#38c995" />
                  <stop offset="1" stopColor="#40d9e8" />
                </linearGradient>
              </defs>
              <path
                d="M14 68 L38 46 L52 58 L74 32"
                stroke="url(#intro-arrow)"
                strokeWidth="11"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M60 28 L80 25 L77 45 L68 35 Z" fill="url(#intro-arrow)" />
              <path
                d="M85 3 c1.3 4.7 2.4 5.8 7.1 7.1 -4.7 1.3 -5.8 2.4 -7.1 7.1 -1.3 -4.7 -2.4 -5.8 -7.1 -7.1 C82.6 8.8 83.7 7.7 85 3 Z"
                fill="#8ff5cf"
              />
            </svg>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-col items-center transition-opacity duration-300",
            phase !== "splash" && "opacity-0",
          )}
        >
          <p className="mt-6 text-base sm:text-lg tracking-[0.35em] ps-[0.35em] text-center text-txt-primary">
            <span className="font-bold">SMART</span>{" "}
            <span className="font-light">MARKETING</span>
          </p>
          <p className="mt-3 flex items-center gap-2 text-[11px] text-txt-secondary uppercase tracking-widest font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Initializing Workspace...
          </p>
        </div>
      </div>
    </div>
  );
}
