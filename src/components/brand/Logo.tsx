import React, { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Smart Marketing brand identity.
 *
 * Mark: a single-stroke geometric "S" (the growth curve of a campaign)
 * that releases a small four-point spark (the AI assist).
 * Emerald → glacial cyan stroke on an obsidian tile, with one champagne
 * accent on the spark for a quiet, premium finish.
 */

// Geometric S built from two 274° arcs that meet at the optical centre.
const S_PATH =
  "M22 9.5A6.5 6.5 0 1 0 16 16A6.5 6.5 0 1 1 10 22.5";

// Four-point spark sitting just off the S terminal.
const SPARK_PATH =
  "M26 1.8Q26.55 4.45 29.2 5Q26.55 5.55 26 8.2Q25.45 5.55 22.8 5Q25.45 4.45 26 1.8Z";

interface LogoMarkProps {
  size?: number;
  /** `tile` renders the obsidian app-icon tile, `plain` renders the bare glyph. */
  variant?: "tile" | "plain";
  className?: string;
  title?: string;
}

export function LogoMark({
  size = 40,
  variant = "tile",
  className,
  title = "Smart Marketing",
}: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const strokeId = `sm-stroke-${uid}`;
  const tileId = `sm-tile-${uid}`;
  const sheenId = `sm-sheen-${uid}`;

  const glyph = (
    <>
      <path
        d={S_PATH}
        fill="none"
        stroke={`url(#${strokeId})`}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <path d={SPARK_PATH} fill="#F2E2B6" />
    </>
  );

  return (
    <svg
      width={size}
      height={size}
      viewBox={variant === "tile" ? "0 0 40 40" : "6.5 0.5 25 31"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient
          id={strokeId}
          x1="22"
          y1="4"
          x2="10"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" style={{ stopColor: "rgb(var(--accent-cyan-rgb, 64 217 232))" }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--accent-violet-rgb, 56 201 149))" }} />
        </linearGradient>
        <linearGradient id={tileId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#18222C" />
          <stop offset="1" stopColor="#0A0F14" />
        </linearGradient>
        <linearGradient id={sheenId} x1="20" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.14" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {variant === "tile" ? (
        <>
          <rect x="0.5" y="0.5" width="39" height="39" rx="11" fill={`url(#${tileId})`} />
          <rect x="0.5" y="0.5" width="39" height="39" rx="11" fill={`url(#${sheenId})`} />
          <rect
            x="0.5"
            y="0.5"
            width="39"
            height="39"
            rx="11"
            stroke="#FFFFFF"
            strokeOpacity="0.12"
          />
          <g transform="translate(1 4.5)">{glyph}</g>
        </>
      ) : (
        glyph
      )}
    </svg>
  );
}

interface LogoProps {
  size?: number;
  /** Small line under the wordmark (e.g. workspace or console name). */
  tagline?: string;
  showWordmark?: boolean;
  className?: string;
}

export function Logo({
  size = 40,
  tagline,
  showWordmark = true,
  className,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3 min-w-0", className)} dir="ltr">
      <LogoMark size={size} />
      {showWordmark && (
        <span className="flex flex-col min-w-0 leading-none">
          <span className="text-sm tracking-tight text-white truncate">
            <span className="font-semibold">Smart</span>
            <span className="font-light text-white/75"> Marketing</span>
          </span>
          {tagline && (
            <span className="mt-1.5 text-[11px] font-medium text-accent-cyan/90 truncate">
              {tagline}
            </span>
          )}
        </span>
      )}
    </span>
  );
}
