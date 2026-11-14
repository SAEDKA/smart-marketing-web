# Bundle fix (step 2) — languages and mock out of the first-load bundle

Applies **on top of** `rerender-fix.patch` (step 1). No visual changes;
the only behavior difference is that switching to Turkish or Arabic
now loads that language's strings asynchronously (a brief moment on
the previous language on a cold cache, then it swaps — never a blank
or broken UI). Verified: `npm run build` passes, tests 85 → 86.

## Result (measured, production build)

| Metric | Before | After |
|---|---|---|
| First Load JS, every route | 154–172 kB | **121–139 kB** |
| Dictionaries in first load | all 3 locales (~89 kB chunk) | English only |
| Mock adapter in first load | yes (~58 kB chunk) | no — async chunk, on first mock call only |

New lazy chunks created by the split: AR dictionary ~36 kB,
TR dictionary ~28 kB, mock adapter ~57 kB — all downloaded only when
actually needed. A live-mode user never downloads the mock chunk.

## What changed

| File | Change |
|---|---|
| `src/lib/i18n/dictionaries.ts` | **Deleted** (115 kB, 2,378 lines, all locales in one module) |
| `src/lib/i18n/dictionary.ts` | **New.** The `Dictionary` interface only (types erase at build) |
| `src/lib/i18n/locales/{en,tr,ar}.ts` | **New.** One dictionary per file, content moved verbatim |
| `src/lib/i18n/load-dictionary.ts` | **New.** `loadDictionary()` — EN static (app default), TR/AR via `import()`, cached after first load |
| `src/lib/i18n/context.tsx` | Provider holds the active dictionary in state, loads non-EN locales on mount (saved preference) and on switch; a sequence guard prevents out-of-order loads; a failed chunk load keeps the current working language |
| `src/lib/api/client.ts` | Mock adapter is now `await import("./mock-adapter")` inside the mock branch only |
| `src/tests/i18n.test.ts` | Imports the per-locale modules; adds a loader test (on-demand load + cache identity) |

Breaking change to know about: anything importing
`@/lib/i18n/dictionaries` must now import the type from
`@/lib/i18n/dictionary`, a locale from `@/lib/i18n/locales/<locale>`,
or — in app code — just use `useI18n()` as before. Only the provider
and one test imported it, both updated here.

## Deliberately NOT in this step

The per-page copy objects (`LANDING_COPY`, `DASHBOARD_COPY`,
`ADMIN_COPY`, `AUTH_SHOWCASE_COPY`) still embed all three locales
inside their page's chunk. They are already code-split *by page*
(only the landing page downloads landing copy), so the waste is
bounded to ~a few kB per page; converting them to async loading
means adding loading states to four pages. The clean long-term home
for that copy is the per-locale dictionary modules added here — a
mechanical move that can happen page by page.
