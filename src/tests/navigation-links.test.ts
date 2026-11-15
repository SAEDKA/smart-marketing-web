import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";

/**
 * Navigation regression guard.
 *
 * Plain <a href="/..."> triggers a full document reload: the root layout
 * remounts, AuthProvider restarts with isLoading=true, and the workspace
 * layout hides everything behind the full-screen "Initializing Workspace..."
 * spinner on every page switch. Internal navigation must use next/link so
 * routing stays client-side and the auth session is never torn down.
 */
const NAV_FILES = [
  "src/components/layout/GlassSidebar.tsx",
  "src/components/layout/MobileNav.tsx",
  "src/components/layout/TopHeader.tsx",
  "src/app/(workspace)/dashboard/page.tsx",
  "src/app/(workspace)/posts/page.tsx",
  "src/app/(workspace)/campaigns/page.tsx",
  "src/app/(workspace)/content-studio/page.tsx",
];

function read(rel: string) {
  return readFileSync(path.resolve(process.cwd(), rel), "utf-8");
}

describe("Client-side navigation (no full page reloads)", () => {
  it.each(NAV_FILES)("%s uses next/link for internal navigation", (file) => {
    const src = read(file);
    expect(src).toContain('from "next/link"');
    expect(src).toContain("<Link");
  });

  it.each(NAV_FILES)("%s has no plain anchor to an internal route", (file) => {
    const src = read(file);
    // <a ... href="/ or href={internal targets}
    expect(src).not.toMatch(/<a[\s>][^>]*href\s*=\s*["'{]/u);
  });
});
