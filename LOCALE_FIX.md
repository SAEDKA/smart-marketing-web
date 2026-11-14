# Locale boot fix — "the language changes on F5"

## Symptom

Pressing F5 visibly switched the site's language: the page first
appeared in English (LTR), then flipped to the saved language —
for Arabic also flipping the whole layout LTR → RTL — once the
saved locale's dictionary chunk finished loading.

## Root cause

Since the bundle split (step 2), only English ships in the initial
bundle; TR/AR are lazy chunks. The `I18nProvider` always started in
English and restored the saved preference from `localStorage` in a
mount effect, so every refresh painted English first and swapped
languages when the chunk arrived. On a dev server (chunks compile
on demand after each restart) the English phase could last
seconds. The preference itself was never lost — the swap was the
bug. The root layout also hard-coded `dir="ltr"` on `<html>`, so
the direction flipped together with the text.

## Fix

- `src/lib/i18n/context.tsx` — a **boot gate**: children render
  only once the saved locale's dictionary is loaded. English (the
  bundled default) opens the gate immediately; a saved TR/AR
  preference loads its chunk first, so the first painted frame is
  already in the user's language. If the chunk fails, the gate
  still opens on English (previous fallback behavior). While the
  gate is closed, a neutral `bg-navy-950` backdrop renders —
  identical on server and client first render, so hydration
  matches and no wrong-language frame is ever painted.
- `src/app/layout.tsx` — a pre-paint inline script (same pattern
  as the theme script) reads `smp_locale_preference` and sets
  `<html lang/dir>` before first paint; the hard-coded `dir="ltr"`
  attribute was removed so nothing fights it.

Deliberately unchanged: the per-locale bundle split (TR/AR are
still lazy chunks), the `smp_locale_preference` storage key, and
the language switchers (header + Settings), which already saved
the preference correctly.

## Trade-off

The first paint is now a brief neutral backdrop instead of
English-then-saved-language. For English users it is a single
frame; for TR/AR users it lasts until the (cached, small)
dictionary chunk arrives. In return, no refresh ever shows the
wrong language or flips direction again.

## Tests

`src/tests/i18n-boot.test.tsx` (3 new): no saved preference boots
straight into English/LTR; a saved Arabic preference boots into
Arabic with `documentElement` lang `ar` / dir `rtl`; a saved
Turkish preference boots into Turkish. Full suite: 115/115,
production build passes, routes remain static.
