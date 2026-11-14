# Brand logo + animated workspace entry

## The logo

The chosen mark (glossy glass speech bubble, rising growth arrow, AI
spark) is now the project's brand identity:

- `public/brand/logo-icon.webp` — production artwork (512×512, 19 KB),
  served through a shared `BrandLogo` component
  (`src/components/layout/BrandLogo.tsx`).
- Brand tiles replaced everywhere the gradient `Sparkles` tile used to
  stand for the product: sidebar (expanded + collapsed), mobile drawer,
  auth header, login card, register card, and the landing page header.
  Role icons inside menus (e.g. Content Studio, the admin nav) are
  unchanged — only the brand mark changed.
- Browser tab icon: `src/app/favicon.ico` was replaced by
  `src/app/icon.png` (+ `apple-icon.png`) using the same artwork.

## The entry animation

`src/components/layout/WorkspaceIntro.tsx`, mounted by the workspace
layout, replaces the plain "Initializing Workspace..." spinner:

1. **Splash** — the logo and wordmark appear on the brand backdrop
   while the session loads (this is the old spinner's time slot).
2. **Flight** — once the session is ready, the growth arrow lifts off
   the logo and flies to the account corner. The landing point is
   measured live from the header profile button
   (`data-intro-target="account"` in `TopHeader`), so it is exact in
   LTR and RTL and on any screen size; the arrow flips when the corner
   is on the left.
3. **Reveal** — the workspace iris-opens from the exact point the
   arrow lands on (a growing circular opening in the backdrop),
   while the arrow shrinks into the point and disappears.

Behaviour notes:

- Plays once per workspace mount: full page load, F5 refresh, and a
  fresh login. In-app navigation never replays it (the layout stays
  mounted, which is also why page switches stay instant).
- Clicking during the splash/flight skips ahead.
- `prefers-reduced-motion` disables the sequence entirely.
- The layout no longer renders the shell before the session is known
  (`showShell` gate), so there is no flash of workspace behind the
  splash; guest/admin redirects work exactly as before.

## Verification

- `npm run build` passes; test suite 112/112 (3 new tests in
  `src/tests/workspace-intro.test.tsx` cover: splash holds while
  loading, splash does not finish on its own, and the sequence plays
  through and unmounts once the session is ready).
- Production smoke test: `/`, `/login`, `/dashboard` return 200,
  `/brand/logo-icon.webp` and `/icon.png` are served, and the
  dashboard's server-rendered HTML contains the intro splash.
