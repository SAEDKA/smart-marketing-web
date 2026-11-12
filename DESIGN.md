---
version: alpha
name: Smart-Marketing-Liquid-Glass-Taste-System
description: Premium Liquid Glass SaaS design system for SMART MARKETING PLATFORM, combining taste-skill non-violet obsidian-emerald-cyan tokens and switchable themes with Stripe-inspired typographic precision (ss01 stylistic set, negative display tracking, and tabular numerals tnum for KPIs, telemetry, and pricing).

colors:
  primary: "#38c995"
  primary-deep: "#209677"
  primary-press: "#177a5f"
  primary-soft: "#55d6a6"
  primary-bg-subdued-hover: "#8fa68e"
  accent-cyan: "#40d9e8"
  accent-mint: "#55d6a6"
  accent-violet: "#8b72ff"
  accent-indigo: "#6c7dff"
  bg-deep: "#0b1020"
  bg-dark: "#111a2e"
  bg-surface: "#151e33"
  obsidian-deep: "#0c1116"
  obsidian-dark: "#121920"
  obsidian-surface: "#17212b"
  brand-dark-900: "#1c1e54"
  ink: "#ffffff"
  ink-secondary: "#a8b2c6"
  ink-mute: "#77839a"
  ink-mute-2: "#64748d"
  on-primary: "#ffffff"
  canvas: "#0b1020"
  canvas-soft: "#111a2e"
  canvas-cream: "#151e33"
  hairline: "#1e293b"
  hairline-input: "#334155"
  semantic-success: "#38c995"
  semantic-warning: "#f5b85c"
  semantic-error: "#f16c7d"
  ruby: "#ea2261"
  magenta: "#f96bee"
  lemon: "#9b6829"
  shadow-blue: "#050812"

typography:
  display-xxl:
    fontFamily: "'Schibsted Grotesk', Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: -1.4px
    fontFeature: ss01
  display-xl:
    fontFamily: "'Schibsted Grotesk', Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.96px
    fontFeature: ss01
  display-lg:
    fontFamily: "'Schibsted Grotesk', Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.64px
    fontFeature: ss01
  display-md:
    fontFamily: "'Schibsted Grotesk', Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 30px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.4px
    fontFeature: ss01
  heading-xl:
    fontFamily: "'Schibsted Grotesk', Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.3px
    fontFeature: ss01
  heading-lg:
    fontFamily: "'Schibsted Grotesk', Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.2px
    fontFeature: ss01
  heading-md:
    fontFamily: "'Schibsted Grotesk', Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.15px
    fontFeature: ss01
  body-lg:
    fontFamily: "Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
    fontFeature: ss01
  body-md:
    fontFamily: "Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
    fontFeature: ss01
  body-tabular:
    fontFamily: "Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.2px
    fontFeature: tnum
  caption:
    fontFamily: "Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: tnum
  micro:
    fontFamily: "Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
    fontFeature: ss01
  micro-cap:
    fontFamily: "Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
    fontSize: 10px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.4px
    fontFeature: ss01

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  input: 13px
  xl: 16px
  card: 20px
  dialog: 24px
  surface: 26px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px

components:
  glass-button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-md}"
    rounded: "{rounded.input}"
    padding: 10px 18px
  glass-button-secondary:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.input}"
    padding: 10px 18px
  glass-input:
    backgroundColor: "{colors.bg-deep}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.input}"
    padding: 10px 14px
  glass-card:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.card}"
    padding: 24px
  glass-panel:
    backgroundColor: "{colors.bg-dark}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.surface}"
    padding: 32px
---

## Overview

SMART MARKETING PLATFORM combines a **Liquid Glass** atmospheric dark workspace with **taste-skill non-violet editorial tokens (`#0c1116`, `#121920`, `#17212b`, `#38c995` Emerald, `#40d9e8` Glacial Cyan)** and a live token theme switcher. Translucent glass cards with `backdrop-filter: blur(24px) saturate(165%)`, cursor-tracking specular illumination, and subtle inner highlights (`inset 0 1px 0 0 rgba(255,255,255,0.18)`) create depth without compromising readability.
