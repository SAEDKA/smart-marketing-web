"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { GlassSidebar } from "@/components/layout/GlassSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { SessionExpiredModal } from "@/components/layout/SessionExpiredModal";
import { AccessNoticeToast } from "@/components/layout/AccessNoticeToast";
import { UnauthorizedView } from "@/components/layout/UnauthorizedView";
import { WorkspaceIntro } from "@/components/layout/WorkspaceIntro";
import { isHrefLocked } from "@/lib/access/access";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user, accessTier } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Stable identities: previously these were inline arrows in JSX, so
  // TopHeader / MobileNav received a new prop on every layout render
  // and could never skip re-rendering.
  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);

  const isAdmin = user?.role === "SYSTEM_ADMIN";
  // The platform admin's own area: the admin console plus his personal
  // account pages (notifications, account settings). Client workspace
  // routes — a company's dashboard, products, campaigns, brand
  // settings — belong to client accounts, not to the admin.
  const isAdminAllowedRoute =
    pathname.startsWith("/admin") ||
    pathname === "/notifications" ||
    pathname === "/settings";

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      // Guests live on the dashboard only — it renders its guest view
      // (no data, just the sign-in notice and the first steps). Any
      // other workspace route sends them back to it.
      if (pathname !== "/dashboard") {
        router.replace("/dashboard");
      }
    } else if (isAdmin && !isAdminAllowedRoute) {
      router.replace("/admin");
    } else if (!isAdmin && isHrefLocked(accessTier, pathname)) {
      // Signed in but the company profile is not completed yet: this
      // route runs on company data, so it stays locked for now.
      router.replace("/dashboard");
    }
  }, [
    isLoading,
    isAuthenticated,
    isAdmin,
    isAdminAllowedRoute,
    accessTier,
    pathname,
    router,
  ]);

  // The branded entry sequence (WorkspaceIntro) is both the loading
  // screen and the reveal that follows it, so it stays mounted across
  // every state; the shell itself renders only once the session is
  // known and this route is allowed for the current access tier. A
  // guest headed anywhere but the dashboard, an owner headed to a
  // still-locked route and an admin headed to his own console render
  // nothing underneath while the redirect above fires.
  const showShell =
    !isLoading &&
    !isHrefLocked(accessTier, pathname) &&
    !(isAdmin && !isAdminAllowedRoute);

  const isAdminRoute = pathname.startsWith("/admin");
  const isUnauthorized = isAdminRoute && user?.role !== "SYSTEM_ADMIN";

  return (
    <>
      <WorkspaceIntro
        ready={!isLoading && (isAuthenticated || pathname === "/dashboard")}
      />
      {showShell ? (
    <div className="min-h-screen flex bg-navy-950 text-white relative overflow-x-hidden">
      {/* Ambient Liquid Glass Light Refraction Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="ambient-glow-violet -top-32 start-1/4" />
        <div className="ambient-glow-cyan top-1/3 -end-24" />
        <div className="ambient-glow-violet -bottom-40 end-1/3 opacity-70" />
      </div>

      {/* Desktop Glass Sidebar */}
      <GlassSidebar />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 min-h-screen">
        <TopHeader onOpenMobileNav={openMobileNav} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-10 max-w-7xl w-full mx-auto">
          {isUnauthorized ? <UnauthorizedView /> : children}
        </main>

        {/* Mobile navigation drawer */}
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={closeMobileNav}
        />
      </div>

      {/* Session Expiry Recovery Modal (WEB-01-05) */}
      <SessionExpiredModal />

      {/* Access ladder notice for locked areas */}
      <AccessNoticeToast />
    </div>
      ) : null}
    </>
  );
}
