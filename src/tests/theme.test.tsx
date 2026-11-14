import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import fs from "fs";
import path from "path";
import { ThemeProvider, useTheme } from "@/lib/theme/context";
import {
  THEMES,
  THEME_STORAGE_KEY,
  isThemeName,
  getStoredTheme,
  applyTheme,
} from "@/lib/theme/theme";

describe("Theme system", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("recognizes exactly the four shipped themes", () => {
    expect(THEMES).toEqual(["emerald", "ocean", "violet", "light"]);
    for (const name of THEMES) expect(isThemeName(name)).toBe(true);
    expect(isThemeName("dark")).toBe(false);
    expect(isThemeName("")).toBe(false);
    expect(isThemeName(null)).toBe(false);
    expect(isThemeName(undefined)).toBe(false);
  });

  it("falls back to emerald when nothing valid is stored", () => {
    expect(getStoredTheme()).toBe("emerald");
    window.localStorage.setItem(THEME_STORAGE_KEY, "neon");
    expect(getStoredTheme()).toBe("emerald");
  });

  it("applyTheme writes the data-theme attribute on <html>", () => {
    applyTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      "light"
    );
  });

  it("provider restores the saved theme on mount", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "violet");
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme).toBe("violet");
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      "violet"
    );
  });

  it("setTheme applies and persists the choice", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("light"));
    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe(
      "light"
    );
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });

  it("globals.css defines the white theme and its compatibility layer", () => {
    const css = fs.readFileSync(
      path.resolve(process.cwd(), "src/app/globals.css"),
      "utf8"
    );
    expect(css).toContain('[data-theme="light"]');
    expect(css).toContain("color-scheme: light");
    // White-based utilities are re-tinted under the light theme.
    expect(css).toContain('[data-theme="light"] .text-white');
    expect(css).toContain('[data-theme="light"] .border-white\\/10');
    // Glass surfaces get light-theme shadows/borders, blur stays.
    expect(css).toContain('[data-theme="light"] .glass-card');
    // The white theme carries the brand color wash in its background.
    expect(css).toContain('[data-theme="light"] body');
    expect(css).toContain('[data-theme="light"] .glass-button-primary');
  });

  it("tailwind text/semantic colors are theme-variable driven", () => {
    const config = fs.readFileSync(
      path.resolve(process.cwd(), "tailwind.config.ts"),
      "utf8"
    );
    expect(config).toContain("var(--txt-primary-rgb)");
    expect(config).toContain("var(--semantic-error-rgb)");
  });
});
