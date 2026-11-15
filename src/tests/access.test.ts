import { describe, it, expect } from "vitest";
import {
  isHrefLocked,
  tierForUser,
} from "@/lib/access/access";
import type { AuthUser } from "@/types/domain";

function user(partial: Partial<AuthUser>): AuthUser {
  return {
    id: "usr_test",
    email: "test@example.com",
    fullName: "Test User",
    role: "COMPANY_OWNER",
    emailVerified: true,
    onboardingCompleted: false,
    createdAt: "2026-11-15T00:00:00.000Z",
    ...partial,
  };
}

describe("Access ladder (guest → account → company)", () => {
  it("classifies tiers from the session user", () => {
    expect(tierForUser(null)).toBe("guest");
    expect(tierForUser(user({ onboardingCompleted: false }))).toBe("account");
    expect(tierForUser(user({ onboardingCompleted: true }))).toBe("full");
    expect(
      tierForUser(user({ role: "SYSTEM_ADMIN", onboardingCompleted: false }))
    ).toBe("full");
  });

  it("guests can only reach the dashboard", () => {
    expect(isHrefLocked("guest", "/dashboard")).toBe(false);
    expect(isHrefLocked("guest", "/products")).toBe(true);
    expect(isHrefLocked("guest", "/onboarding")).toBe(true);
    expect(isHrefLocked("guest", "/notifications")).toBe(true);
    expect(isHrefLocked("guest", "/settings")).toBe(true);
  });

  it("accounts keep personal areas open but company features locked", () => {
    expect(isHrefLocked("account", "/dashboard")).toBe(false);
    expect(isHrefLocked("account", "/onboarding")).toBe(false);
    expect(isHrefLocked("account", "/notifications")).toBe(false);
    expect(isHrefLocked("account", "/settings")).toBe(false);
    expect(isHrefLocked("account", "/settings/brand")).toBe(true);
    expect(isHrefLocked("account", "/products")).toBe(true);
    expect(isHrefLocked("account", "/content-studio")).toBe(true);
    expect(isHrefLocked("account", "/campaigns")).toBe(true);
    expect(isHrefLocked("account", "/analytics")).toBe(true);
  });

  it("full accounts are never locked", () => {
    expect(isHrefLocked("full", "/products")).toBe(false);
    expect(isHrefLocked("full", "/settings/brand")).toBe(false);
    expect(isHrefLocked("full", "/reports")).toBe(false);
  });
});
