# White theme, colored (on top of THEME_SWITCHER.md)

Feedback: the first white theme read as lifeless — flat gray-white
surfaces, color only in tiny accents. This change keeps the white base
and the Liquid Glass identity, but lets the brand colors live in the
surfaces themselves. CSS-only (plus the Settings swatch); no markup,
no text colors touched, so readability is unchanged.

## What changed (all under `[data-theme="light"]` only)

- **Surfaces are mint-ice, not gray**: `--bg-deep` #e2efe9,
  `--bg-dark` #eef6f2 — inset panels and page backdrop now carry a
  soft green tint from the emerald family.
- **Ambient wash is stronger**: the body's fixed radial gradients rise
  to 22–26% of the accent colors (emerald / cyan / indigo), plus one
  warm amber glow (12%) in the corner for contrast — the same ambient
  system the dark themes use, tuned up for a light base.
- **Glass is tinted**: `.glass-card` / `.glass-panel` gradients are
  washed with 9–11% mint over white, and their shadows are
  emerald-tinted (rgb(11 90 66 / .22)) instead of neutral slate.
- **Primary gradient is livelier**: `.glass-button-primary` runs
  #0a8f66 → #07829b (emerald → teal-cyan) instead of the flatter
  two-dark-greens variable gradient.
- **Accents freshened**: cyan #0b7285 and mint #0da678 — brighter,
  still ≥ ~4.5:1 on white where they carry text.
- The Settings swatch for White now previews white → mint → sky.

Text variables (`--txt-*`) and semantic colors are unchanged from the
previous step; every color addition sits in backgrounds, gradients,
glass tints or shadows.

## Verification

Build passes, tests 109/109 (CSS contract test extended to the new
rules), and the production CSS was checked to contain the enriched
body wash and the new surface values.
