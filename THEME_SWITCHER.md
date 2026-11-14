# Theme switcher + white theme (on top of ROLES_LABEL_FIX.md)

## What was there before

`globals.css` already defined three accent palettes via `[data-theme]`
(emerald = default, ocean, violet), but nothing in the app ever set the
attribute — there was no switcher anywhere, so the palettes were dead code.

## What this change adds

1. **A fourth theme: white (`light`)** — a full light palette in
   `globals.css` (`[data-theme="light"]`): white/frosted surfaces, deepened
   emerald-family accents for contrast, dark slate text. The Liquid Glass
   look is preserved: the same blur/saturate glass classes are retinted
   (soft slate shadows, dark hairline borders, frosted white gradients),
   not replaced.
2. **A theme switcher in Settings** (Profile section, next to Language):
   four options — Emerald / Ocean / Violet / White — in EN/TR/AR.
   Applies immediately and persists per device (`localStorage`,
   key `smp_theme_preference`).
3. **Theme plumbing**, following the existing i18n patterns:
   `src/lib/theme/theme.ts` (names, storage, apply) +
   `src/lib/theme/context.tsx` (`ThemeProvider`/`useTheme`), wired into
   the root layout, plus an inline pre-paint script so a saved theme
   never flashes the default one.

## How the white theme flips a dark-first codebase

- Backgrounds (`navy-*`) and accents were already CSS-variable driven.
- `txt-*` and `semantic-*` colors in `tailwind.config.ts` were hardcoded
  hex; they now read `--txt-*-rgb` / `--semantic-*-rgb` variables defined
  per theme (dark themes keep the exact same values).
- The markup uses white-based utilities hundreds of times
  (`text-white` ×399, `border-white/10` ×161, `bg-white/5` ×80, …).
  A light-theme compatibility layer at the end of `globals.css`
  re-tints those utilities to slate-based equivalents under
  `[data-theme="light"]` only, with a guard that keeps white text on
  solid accent/gradient/semantic backgrounds (avatars, primary CTAs).

## Verification

- Build passes; tests 102 → 109 (7 new in `src/tests/theme.test.tsx`:
  theme registry, storage fallback, provider restore/apply/persist,
  CSS + config contracts).
- Production CSS verified to contain the light palette, the glass
  retints and the compatibility rules; `/` and `/settings` return 200
  and the pre-paint script is present in the served HTML.

Known cosmetic limits: a handful of one-off hardcoded gradient buttons
(pink/violet Tailwind palette classes) keep their dark-theme colors in
the white theme — they stay readable, just not re-paletted.
