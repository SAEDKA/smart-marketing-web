"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { GlassSidebar } from "@/components/layout/GlassSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { MobileNav } from "@/components/layout/MobileNav";
import { SessionExpiredModal } from "@/components/layout/SessionExpiredModal";
import { UnauthorizedView } from "@/components/layout/UnauthorizedView";
import { Loader2 } from "lucide-react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    } else if (!isLoading && isAuthenticated && user?.role === "SYSTEM_ADMIN" && pathname === "/dashboard") {
      router.replace("/admin");
    }
  }, [isLoading, isAuthenticated, user?.role, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-accent-violet animate-spin" />
          <p className="text-xs text-txt-secondary uppercase tracking-widest font-mono">
            Initializing Workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isUnauthorized = isAdminRoute && user?.role !== "SYSTEM_ADMIN";

  return (
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
        <TopHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 max-w-7xl w-full mx-auto">
          {isUnauthorized ? <UnauthorizedView /> : children}
        </main>

        {/* Mobile Navigation (Bottom bar + Slide drawer) */}
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
          onOpen={() => setMobileNavOpen(true)}
        />
      </div>

      {/* Session Expiry Recovery Modal (WEB-01-05) */}
      <SessionExpiredModal />
    </div>
  );
}
