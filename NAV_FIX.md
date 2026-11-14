# Navigation fix (step 2.5) — no more "Initializing Workspace..." on page switches

Applies **on top of** `bundle-fix.patch` (step 2). No visual changes.
Verified: `npm run build` passes, tests 86 → 102.

## Symptom

Switching pages inside the workspace flashed (or stuck on) the
full-screen **"Initializing Workspace..."** spinner every time.

## Root cause — not bundle weight

1. Every internal navigation element used a plain `<a href="/...">`
   instead of Next.js `<Link>` — the sidebar, top header, mobile nav,
   dashboard cards, landing page, auth pages. `next/link` was used in
   only 2 files in the whole app.
2. A plain anchor performs a **full document reload**: the root layout
   remounts, `AuthProvider` restarts with `isLoading = true`, and
   `WorkspaceLayout` blocks the entire UI behind the spinner until the
   mount effect re-reads the session from `localStorage`.
3. Each reload also re-downloads/re-parses the whole JS bundle and
   re-paints every backdrop-blur surface — which is why the project's
   rendering weight made the flash feel so heavy, even though weight
   was not the root cause.

## What changed

- **60 internal anchors converted to `<Link>` across 14 files:**
  `GlassSidebar`, `MobileNav`, `TopHeader`, `ReleasePlaceholder`,
  dashboard, posts, campaigns, content-studio, landing (`src/app/page.tsx`),
  and the auth pages (login / register / forgot-password / verify-email /
  auth layout).
- Left as plain `<a>` on purpose: external links
  (`product.purchaseUrl`, `selectedPost.externalPostUrl`) and in-page
  `#section` anchors on the landing page.
- Added `src/tests/navigation-links.test.ts` (16 tests) — a regression
  guard asserting the navigation components use `next/link` and contain
  no plain anchor to an internal route.

## Result

- Navigation is now client-side: the sidebar/header never unmount,
  `AuthProvider` never resets, and the workspace spinner appears only
  on a genuine first load / hard refresh (F5), briefly.
- As a bonus, `<Link>` prefetches nearby routes in production, so page
  switches feel instant once the app has been open a moment.

## Still open (unchanged from the audit)

- On a hard refresh the spinner still shows once, because the session
  lives in `localStorage` and can only be read after hydration. The
  long-term fix is moving the session to a cookie readable by a Server
  Component — worth doing together with the real backend.
- Each page still fetches its data in `useEffect` after mount, so a
  page can show its own skeleton briefly on first visit. That is the
  data-layer item from the reorganization plan, not this fix.
- When testing locally, prefer `npm run build && npm run start` over
  `npm run dev`: dev mode compiles each route on first visit and is
  noticeably slower than production by design.
