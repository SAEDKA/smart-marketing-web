"use client";

import Link from "next/link";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import {
  Menu,
  Bell,
  Search,
  Sliders,
  LogOut,
  Shield,
  Calendar,
  Settings,
} from "lucide-react";

interface TopHeaderProps {
  onOpenMobileNav: () => void;
}

export const TopHeader = React.memo(function TopHeader({ onOpenMobileNav }: TopHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale } = useI18n();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "SYSTEM_ADMIN";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (pathname.includes("/dashboard")) return t.nav.dashboard;
    if (pathname.includes("/onboarding")) return t.nav.onboarding;
    if (pathname.includes("/settings/brand")) return t.nav.brandSettings;
    if (pathname.includes("/products")) return t.nav.products;
    if (pathname.includes("/campaigns")) return t.nav.campaigns;
    if (pathname.includes("/content-studio")) return t.nav.contentStudio;
    if (pathname.includes("/posts")) return t.nav.posts;
    if (pathname.includes("/calendar")) return t.nav.calendar;
    if (pathname.includes("/integrations")) return t.nav.integrations;
    if (pathname.includes("/analytics")) return t.nav.analytics;
    if (pathname.includes("/reports")) return t.nav.reports;
    if (pathname.includes("/notifications")) return t.nav.notifications;
    if (pathname.includes("/admin")) return t.nav.admin;
    if (pathname.includes("/settings")) return t.nav.accountSettings;
    return t.meta.appName;
  };

  const aiReadyLabel =
    locale === "ar"
      ? "مساعد الذكاء الاصطناعي متصل"
      : locale === "tr"
      ? "YZ Pazarlama Asistanı Aktif"
      : "AI Marketing Assistant Ready";

  const adminModeLabel =
    locale === "ar"
      ? "وضع إدارة النظام المركزي"
      : locale === "tr"
      ? "Merkezi Sistem Yönetimi"
      : "System Administration Mode";

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    if (isAdmin) {
      router.push("/admin?tab=tenants");
      return;
    }
    const q = quickQuery.toLowerCase();
    if (q.includes("product") || q.includes("coffee") || q.includes("منتج")) {
      router.push("/products");
    } else if (q.includes("campaign") || q.includes("حمل")) {
      router.push("/campaigns");
    } else if (q.includes("cal") || q.includes("sched") || q.includes("تقويم")) {
      router.push("/calendar");
    } else if (q.includes("swot") || q.includes("report")) {
      router.push("/reports");
    } else {
      router.push("/content-studio");
    }
  };

  return (
    <header className="h-20 shrink-0 sticky top-0 z-20 glass-panel border-b border-white/10 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile hamburger + Current Workspace Section */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open mobile navigation drawer"
          className="lg:hidden p-2 rounded-xl text-txt-muted hover:text-white hover:bg-white/10 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <span className="text-base sm:text-lg font-bold text-white tracking-tight">
            {getPageTitle()}
          </span>
          {isAdmin ? (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-accent-violet/15 text-accent-cyan border border-accent-violet/30">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
              <span>{adminModeLabel}</span>
            </span>
          ) : (
            <Link
              href="/content-studio"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/25 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
              <span>{aiReadyLabel}</span>
            </Link>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search / Command Input (Desktop) */}
        <form
          onSubmit={handleQuickSearch}
          className="hidden xl:flex items-center relative w-60"
        >
          <Search className="w-4 h-4 text-txt-muted absolute start-3 pointer-events-none" />
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="glass-input h-9 w-full ps-9 pe-3 text-xs text-white placeholder:text-txt-muted focus:outline-none"
          />
        </form>

        {/* Quick Calendar Shortcut (Only for Company Owners) */}
        {!isAdmin && (
          <Link
            href="/calendar"
            title={t.nav.calendar}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full glass-button-secondary text-txt-secondary hover:text-white transition-colors"
          >
            <Calendar className="w-4 h-4" />
          </Link>
        )}

        {/* 3-Language Switcher (EN, TR, AR with RTL) */}
        <LanguageSwitcher />

        {/* Notification Bell */}
        <Link
          href="/notifications"
          aria-label="View notifications"
          className="relative flex items-center justify-center w-9 h-9 rounded-full glass-button-secondary text-txt-secondary hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-accent-violet" />
        </Link>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-expanded={profileOpen}
            aria-label="User profile menu"
            data-intro-target="account"
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-violet via-accent-indigo to-accent-cyan p-[1px] shadow-glow-violet">
              <div className="w-full h-full rounded-full bg-navy-950 flex items-center justify-center text-xs font-bold text-white">
                {user?.fullName?.charAt(0) || "S"}
              </div>
            </div>
            <div className="hidden md:flex flex-col text-start">
              <span className="text-xs font-semibold text-white leading-tight">
                {user?.fullName?.split(" ")[0] || "Sarah"}
              </span>
              <span className="text-[10px] text-accent-cyan leading-tight font-medium">
                {isAdmin ? t.nav.roleAdmin : t.nav.roleOwner}
              </span>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute end-0 mt-2 w-64 rounded-2xl glass-panel border border-white/15 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
              <div className="p-3 border-b border-white/10">
                <p className="text-xs font-bold text-white truncate">
                  {user?.fullName}
                </p>
                <p className="text-[11px] text-txt-muted truncate">
                  {user?.email}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-violet/20 text-accent-violet border border-accent-violet/30">
                  <Shield className="w-3 h-3" />
                  <span>{isAdmin ? t.nav.roleAdmin : t.nav.roleOwner}</span>
                </div>
              </div>

              <div className="py-1">
                {!isAdmin && (
                  <Link
                    href="/settings/brand"
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-txt-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-txt-muted" />
                    <span>{t.nav.brandSettings}</span>
                  </Link>
                )}

                <Link
                  href="/settings"
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-txt-secondary hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-txt-muted" />
                  <span>{t.nav.accountSettings}</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-white/10">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-semantic-error hover:bg-semantic-error/10 rounded-xl transition-colors text-start"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.logout}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
});
