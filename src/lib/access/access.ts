import type { AuthUser } from "@/types/domain";

/**
 * The access ladder (owner's product model):
 * - "guest":   no session. Only the dashboard is reachable, and it shows
 *              no data — just the sign-in notice and the first steps.
 * - "account": signed in, but no company yet. Personal areas are open;
 *              everything that runs on company data stays locked until
 *              the company onboarding is completed.
 * - "full":    signed in with a completed company profile (the platform
 *              admin always counts as full inside his own console).
 */
export type AccessTier = "guest" | "account" | "full";

/** Workspace routes that need a completed company profile. */
export const COMPANY_GATED_HREFS = [
  "/settings/brand",
  "/products",
  "/campaigns",
  "/content-studio",
  "/posts",
  "/calendar",
  "/integrations",
  "/analytics",
  "/reports",
] as const;

export function tierForUser(user: AuthUser | null): AccessTier {
  if (!user) return "guest";
  if (user.role === "SYSTEM_ADMIN") return "full";
  return user.onboardingCompleted ? "full" : "account";
}

export function isHrefLocked(tier: AccessTier, href: string): boolean {
  if (tier === "full") return false;
  const path = href.split("?")[0];
  if (tier === "guest") return path !== "/dashboard";
  return COMPANY_GATED_HREFS.some(
    (gated) => path === gated || path.startsWith(`${gated}/`)
  );
}

export type AccessNoticeKind = "login" | "company";

/**
 * Ask the workspace shell to show the access notice (rendered by
 * AccessNoticeToast in the workspace layout). Locked navigation items
 * across the sidebar, mobile nav and header all funnel through here.
 */
export function showAccessNotice(kind: AccessNoticeKind) {
  window.dispatchEvent(
    new CustomEvent<AccessNoticeKind>("smp:access-notice", { detail: kind })
  );
}

export function noticeKindForTier(tier: AccessTier): AccessNoticeKind {
  return tier === "guest" ? "login" : "company";
}
