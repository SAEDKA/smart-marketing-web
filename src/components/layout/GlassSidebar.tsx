"use client";

import Link from "next/link";

import React, { useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/BrandLogo";
import {
  LayoutDashboard,
  Building2,
  Sliders,
  Sparkles,
  ShoppingBag,
  Megaphone,
  PenTool,
  Calendar,
  Share2,
  BarChart3,
  FileText,
  Bell,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCheck,
  Wand2,
  Activity,
  Users,
  MessageSquareWarning,
  Terminal,
} from "lucide-react";

interface NavItem {
  key: string;
  href: string;
  icon: React.ElementType;
  label: string;
  badgeText?: string;
  badgeTone?: "cyan" | "violet" | "mint";
}

export const GlassSidebar = React.memo(function GlassSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, dir, locale } = useI18n();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isAdmin = user?.role === "SYSTEM_ADMIN";
  const currentAdminTab = searchParams.get("tab") || "overview";

  const aiQuickCtaLabel =
    locale === "ar"
      ? "توليد محتوى بالذكاء الاصطناعي"
      : locale === "tr"
      ? "YZ ile İçerik Üret"
      : "Create with AI Studio";

  const adminQuickCtaLabel =
    locale === "ar"
      ? "مراجعة شكاوى العملاء"
      : locale === "tr"
      ? "Müşteri Şikayetlerini İncele"
      : "Review Customer Tickets";

  // Dedicated Customer Menu (COMPANY_OWNER) — Only business & marketing items
  // Rebuilt only when the dictionary changes (locale switch) —
  // previously this ~40-item structure was recreated on every render.
  const customerNavGroups: { groupLabel: string; items: NavItem[] }[] = useMemo(
    () => [
    {
      groupLabel: t.nav.workspaceGroup,
      items: [
        {
          key: "dashboard",
          href: "/dashboard",
          icon: LayoutDashboard,
          label: t.nav.dashboard,
        },
        {
          key: "onboarding",
          href: "/onboarding",
          icon: Building2,
          label: t.nav.onboarding,
        },
        {
          key: "brandSettings",
          href: "/settings/brand",
          icon: Sliders,
          label: t.nav.brandSettings,
        },
      ],
    },
    {
      groupLabel: t.nav.publishingGroup,
      items: [
        {
          key: "products",
          href: "/products",
          icon: ShoppingBag,
          label: t.nav.products,
        },
        {
          key: "campaigns",
          href: "/campaigns",
          icon: Megaphone,
          label: t.nav.campaigns,
        },
        {
          key: "contentStudio",
          href: "/content-studio",
          icon: Sparkles,
          label: t.nav.contentStudio,
          badgeText: "AI",
          badgeTone: "cyan",
        },
        {
          key: "posts",
          href: "/posts",
          icon: PenTool,
          label: t.nav.posts,
        },
        {
          key: "calendar",
          href: "/calendar",
          icon: Calendar,
          label: t.nav.calendar,
        },
        {
          key: "integrations",
          href: "/integrations",
          icon: Share2,
          label: t.nav.integrations,
        },
      ],
    },
    {
      groupLabel: t.nav.intelligenceGroup,
      items: [
        {
          key: "analytics",
          href: "/analytics",
          icon: BarChart3,
          label: t.nav.analytics,
        },
        {
          key: "reports",
          href: "/reports",
          icon: FileText,
          label: t.nav.reports,
          badgeText: "SWOT",
          badgeTone: "mint",
        },
      ],
    },
    {
      groupLabel: t.nav.systemGroup,
      items: [
        {
          key: "notifications",
          href: "/notifications",
          icon: Bell,
          label: t.nav.notifications,
        },
        {
          key: "settings",
          href: "/settings",
          icon: Settings,
          label: t.nav.accountSettings,
        },
      ],
    },
    ],
    [t]
  );

  // Dedicated System Admin Menu (SYSTEM_ADMIN) — Platform analytics, visitors, tenants, complaints, commands
  const adminNavGroups: { groupLabel: string; items: NavItem[] }[] = useMemo(
    () => [
    {
      groupLabel:
        locale === "ar"
          ? "إدارة المنصة والتحليلات"
          : locale === "tr"
          ? "Platform Yönetimi ve Analitik"
          : "Platform Administration",
      items: [
        {
          key: "admin-overview",
          href: "/admin?tab=overview",
          icon: ShieldCheck,
          label:
            locale === "ar"
              ? "نظرة عامة على المنصة"
              : locale === "tr"
              ? "Platform Genel Bakışı"
              : "Platform Overview",
        },
        {
          key: "admin-traffic",
          href: "/admin?tab=traffic",
          icon: Activity,
          label:
            locale === "ar"
              ? "إحصائيات الزوار والاستخدام"
              : locale === "tr"
              ? "Ziyaretçi ve Kullanım Analitiği"
              : "Visitors & Usage Analytics",
          badgeText: "Live",
          badgeTone: "cyan",
        },
        {
          key: "admin-tenants",
          href: "/admin?tab=tenants",
          icon: Users,
          label:
            locale === "ar"
              ? "إدارة الشركات والعملاء"
              : locale === "tr"
              ? "Şirketler ve Müşteriler"
              : "Companies & Customers",
        },
        {
          key: "admin-complaints",
          href: "/admin?tab=complaints",
          icon: MessageSquareWarning,
          label:
            locale === "ar"
              ? "شكاوى العملاء والدعم"
              : locale === "tr"
              ? "Müşteri Şikayetleri ve Destek"
              : "Complaints & Support",
          badgeText: "2",
          badgeTone: "violet",
        },
        {
          key: "admin-operations",
          href: "/admin?tab=operations",
          icon: Terminal,
          label:
            locale === "ar"
              ? "الأوامر الإدارية والسجلات"
              : locale === "tr"
              ? "Yönetim Komutları ve Kayıtlar"
              : "Admin Commands & Logs",
        },
      ],
    },
    {
      groupLabel:
        locale === "ar"
          ? "حساب المدير"
          : locale === "tr"
          ? "Yönetici Hesabı"
          : "Admin Account",
      items: [
        {
          key: "notifications",
          href: "/notifications",
          icon: Bell,
          label: t.nav.notifications,
        },
        {
          key: "settings",
          href: "/settings",
          icon: Settings,
          label: t.nav.accountSettings,
        },
      ],
    },
    ],
    [t, locale]
  );

  const activeNavGroups = isAdmin ? adminNavGroups : customerNavGroups;
  const isRtl = dir === "rtl";

  const isNavItemActive = (item: NavItem) => {
    if (item.href.startsWith("/admin?tab=")) {
      const targetTab = item.href.split("tab=")[1];
      return pathname === "/admin" && currentAdminTab === targetTab;
    }
    return (
      pathname === item.href ||
      (item.href !== "/dashboard" &&
        item.href !== "/settings" &&
        pathname.startsWith(item.href))
    );
  };

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col shrink-0 h-screen sticky top-0 z-30 transition-all duration-300",
        "glass-panel border-e border-white/15 shadow-2xl",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Brand Identity Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
        {!isCollapsed ? (
          <Link
            href={isAdmin ? "/admin" : "/dashboard"}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <BrandLogo className="w-10 h-10 shadow-glow-violet group-hover:scale-105 transition-transform" />
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold tracking-tight text-white truncate">
                {t.meta.appName}
              </span>
              <span className="text-[11px] text-accent-cyan font-medium truncate">
                {isAdmin
                  ? locale === "ar"
                    ? "لوحة الإدارة المركزية"
                    : locale === "tr"
                    ? "Merkezi Yönetim Paneli"
                    : "System Admin Console"
                  : "Lumiere Artisan Roasters"}
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href={isAdmin ? "/admin" : "/dashboard"}
            className="block w-10 h-10 mx-auto"
          >
            <BrandLogo className="w-10 h-10" />
          </Link>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? t.nav.expandSidebar : t.nav.collapseSidebar}
          className={cn(
            "p-1.5 rounded-xl text-txt-muted hover:text-white hover:bg-white/10 transition-colors",
            isCollapsed && "mx-auto mt-2"
          )}
        >
          {isRtl ? (
            isCollapsed ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Role-Specific Primary Action Button */}
      {!isCollapsed && (
        <div className="px-4 pt-4 pb-1 shrink-0">
          {isAdmin ? (
            <Link
              href="/admin?tab=complaints"
              className="w-full h-10 px-3.5 rounded-[13px] glass-button-primary flex items-center justify-center gap-2 text-xs font-semibold text-white"
            >
              <MessageSquareWarning className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{adminQuickCtaLabel}</span>
            </Link>
          ) : (
            <Link
              href="/content-studio"
              className="w-full h-10 px-3.5 rounded-[13px] glass-button-primary flex items-center justify-center gap-2 text-xs font-semibold text-white"
            >
              <Wand2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{aiQuickCtaLabel}</span>
            </Link>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {activeNavGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {!isCollapsed && (
              <p className="px-3.5 text-[10px] font-semibold uppercase tracking-wider text-txt-muted mb-1.5">
                {group.groupLabel}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-[13px] text-xs font-medium transition-all duration-200 group relative select-none",
                    isActive
                      ? "bg-gradient-to-r from-accent-violet/25 via-accent-indigo/15 to-transparent text-white border border-accent-violet/40 shadow-glow-violet/20"
                      : "text-txt-secondary hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive
                        ? "text-accent-cyan"
                        : "text-txt-muted group-hover:text-white"
                    )}
                  />

                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between truncate">
                      <span className="truncate">{item.label}</span>
                      {item.badgeText && (
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold ms-2 shrink-0",
                            item.badgeTone === "cyan" &&
                              "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30",
                            item.badgeTone === "mint" &&
                              "bg-accent-mint/15 text-accent-mint border border-accent-mint/30",
                            item.badgeTone === "violet" &&
                              "bg-accent-violet/20 text-accent-violet border border-accent-violet/30"
                          )}
                        >
                          {item.badgeText}
                        </span>
                      )}
                    </div>
                  )}

                  {isActive && (
                    <span className="absolute start-1 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-accent-cyan shadow-glow-cyan" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Dock: User Profile */}
      <div className="p-3.5 border-t border-white/10 bg-navy-950/50 shrink-0 space-y-2.5">
        {!isCollapsed ? (
          <>
            <div className="flex items-center px-2.5 py-2 rounded-[13px] bg-white/5 border border-white/10 text-xs">
              <div className="flex items-center gap-2 truncate">
                <UserCheck className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                <span className="text-txt-secondary truncate text-[11px] font-medium">
                  {isAdmin ? t.nav.roleAdmin : t.nav.roleOwner}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-violet to-accent-indigo flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-glow-violet">
                  {user?.fullName?.charAt(0) || "S"}
                </div>
                <div className="truncate text-start">
                  <p className="text-xs font-semibold text-white truncate">
                    {user?.fullName || "Sarah Jenkins"}
                  </p>
                  <p className="text-[10px] text-txt-muted truncate">
                    {user?.email || "sarah@lumierecoffee.com"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                title={t.nav.logout}
                className="p-1.5 text-txt-muted hover:text-semantic-error hover:bg-semantic-error/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <button
              type="button"
              onClick={logout}
              title={t.nav.logout}
              className="p-2 text-txt-muted hover:text-semantic-error hover:bg-semantic-error/10 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
});
