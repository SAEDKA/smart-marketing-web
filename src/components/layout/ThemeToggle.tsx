"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme/context";
import { useI18n } from "@/lib/i18n/context";

/**
 * One-tap dark/light switch for the headers. Shows the icon of the
 * mode you switch TO: a sun while dark (tap for light), a moon while
 * light (tap for dark). Icon only — no label text.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { locale } = useI18n();

  const isDark = theme === "dark";
  const label = isDark
    ? { en: "Light mode", tr: "Açık mod", ar: "الوضع الفاتح" }[locale]
    : { en: "Dark mode", tr: "Koyu mod", ar: "الوضع الداكن" }[locale];

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={label}
      aria-label={label}
      className="flex items-center justify-center w-9 h-9 rounded-full glass-button-secondary text-txt-secondary hover:text-white transition-colors shrink-0"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
