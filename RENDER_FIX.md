# Re-render fix — what changed and why

Scope: **excessive re-rendering only.** No visual changes, no behavior
changes, no API changes. Verified: `npm run build` passes, tests go
from 82 → 85 passing.

## The four root causes found

1. **Context values were recreated on every render.**
   `I18nProvider` and `AuthProvider` passed an inline object to
   `Context.Provider`, so any render of a provider invalidated every
   `useI18n()` / `useAuth()` consumer — effectively the whole app.
2. **Animated counters lived in the dashboard's own state.**
   `useAnimatedCounter` called `setState` on every animation frame:
   3 counters × ~33 frames = roughly 100 full-page re-renders in the
   first 550ms after the dashboard mounted.
3. **The spotlight effect thrashed layout.**
   Every `mousemove` event (dozens/sec, per card) called
   `getBoundingClientRect()` — a forced synchronous layout — and the
   handler was copy-pasted into 3 pages and recreated per render.
4. **Nothing was memoized where it mattered.**
   The sidebar rebuilt a ~40-item navigation structure per render,
   the workspace layout passed new inline callbacks to the header and
   mobile nav per render, and the shared UI primitives (`Card`,
   `Button`, `Badge`, `Skeleton`) re-rendered with every parent.

## The fix, file by file

| File | Change |
|---|---|
| `src/lib/i18n/context.tsx` | `setLocale` is now `useCallback`; provider value is `useMemo` |
| `src/lib/auth/context.tsx` | Provider value is `useMemo` (all callbacks were already `useCallback`) |
| `src/components/ui/AnimatedCounter.tsx` | **New.** Animation writes to its own DOM node via ref — zero React renders; respects `prefers-reduced-motion` |
| `src/app/(workspace)/dashboard/page.tsx` | Uses `AnimatedCounter` (old hook deleted); `workflowSteps` memoized; submit handler `useCallback` |
| `src/lib/hooks/use-spotlight.ts` | **New.** One shared, stable handler; events coalesced into one `requestAnimationFrame`; rect read once per frame |
| `src/app/page.tsx`, `content-studio/page.tsx`, `dashboard/page.tsx` | Duplicated spotlight handlers replaced by `useSpotlight()` |
| `src/components/ui/{Card,Button,Badge,Skeleton}.tsx` | Wrapped in `React.memo` (implementation renamed to `*Impl`) |
| `src/components/layout/{GlassSidebar,TopHeader,MobileNav}.tsx` | Wrapped in `React.memo`; sidebar nav groups built in `useMemo` |
| `src/app/(workspace)/layout.tsx` | Mobile-nav open/close handlers are stable `useCallback`s, so the memoized header/nav can actually skip renders |
| `src/tests/render-optimizations.test.tsx` | **New.** 3 tests: counter first paint, spotlight handler stability, spotlight writes the CSS vars |

## What this does NOT do (deliberately, separate steps)

- Bundle size is essentially unchanged (+0.1–0.3 kB on a few routes
  for the new counter component). Splitting dictionaries / mock
  adapter out of the production bundle is a different fix.
- Pages are still all client components with per-page `useEffect`
  fetching. That is the data-layer step, best done when the backend
  contract lands.
- Blur / GPU cost is untouched in this patch — see the tiered-blur
  approach: keep `backdrop-filter` on large static surfaces (sidebar,
  header, modal), drop or halve it on repeated list cards, where the
  visible difference is near zero because cards already carry a
  gradient, border and inset highlight over a dark background.
