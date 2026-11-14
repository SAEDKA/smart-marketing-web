/**
 * Interface themes. The palettes themselves live in `globals.css` as
 * `[data-theme="..."]` variable blocks; this module only tracks which
 * theme is active and applies it to the document root.
 *
 * - "emerald" — the original default (also the `:root` values)
 * - "ocean"   — cyan-leaning dark
 * - "violet"  — purple dark
 * - "light"   — white theme, same Liquid Glass retinted for light surfaces
 */
export const THEMES = ["emerald", "ocean", "violet", "light"] as const;

export type ThemeName = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeName = "emerald";

export const THEME_STORAGE_KEY = "smp_theme_preference";

export function isThemeName(value: unknown): value is ThemeName {
  return (
    typeof value === "string" &&
    (THEMES as readonly string[]).includes(value)
  );
}

export function getStoredTheme(): ThemeName {
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeName(saved) ? saved : DEFAULT_THEME;
  } catch {
    // Storage can be unavailable in restricted environments.
    return DEFAULT_THEME;
  }
}

export function storeTheme(theme: ThemeName): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Non-fatal: the theme still applies for this session.
  }
}

export function applyTheme(theme: ThemeName): void {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }
}
