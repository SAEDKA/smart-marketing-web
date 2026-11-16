/**
 * Interface themes. The palettes themselves live in `globals.css` as
 * `[data-theme="..."]` variable blocks; this module only tracks which
 * theme is active and applies it to the document root.
 *
 * - "dark"  — the brand dark mode (also the `:root` values)
 * - "light" — pure-white light mode, same Liquid Glass on white
 */
export const THEMES = ["dark", "light"] as const;

export type ThemeName = (typeof THEMES)[number];

export const DEFAULT_THEME: ThemeName = "dark";

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
