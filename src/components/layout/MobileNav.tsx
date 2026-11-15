"use client";

import Link from "next/link";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/layout/BrandLogo";
import {
  isHrefLocked,
  noticeKindForTier,
  showAccessNotice,
} from "@/lib/access/access";
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
  X,
  Lock,
  LogIn,
  LogOut,
  Menu,
  Activity,
  Users,
  MessageSquareWarning,
  Terminal,
} from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
}

export const MobileNav = React.memo(function MobileNav({ isOpen, onClose, onOpen }: MobileNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, locale } = useI18n();
  const { user, logout, accessTier } = useAuth();

  const isAdmin = user?.role === "SYSTEM_ADMIN";
  const handleLockedClick = () =>
    showAccessNotice(noticeKindForTier(accessTier));
  const currentAdminTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const customerBottomNav = [
    { href: "/dashboard", icon: LayoutDashboard, label: t.nav.dashboard },
    { href: "/products", icon: ShoppingBag, label: t.nav.products },
    { href: "/campaigns", icon: Megaphone, label: t.nav.campaigns },
    { href: "/content-studio", icon: Sparkles, label: t.nav.contentStudio },
  ];

  const adminBottomNav = [
    {
      href: "/admin?tab=overview",
      icon: ShieldCheck,
      label: locale === "ar" ? "نظرة عامة" : locale === "tr" ? "Genel" : "Overview",
    },
    {
      href: "/admin?tab=traffic",
      icon: Activity,
      label: locale === "ar" ? "الزوار" : locale === "tr" ? "Trafik" : "Traffic",
    },
    {
      href: "/admin?tab=tenants",
      icon: Users,
      label: locale === "ar" ? "الشركات" : locale === "tr" ? "Şirketler" : "Companies",
    },
    {
      href: "/admin?tab=complaints",
      icon: MessageSquareWarning,
      label: locale === "ar" ? "الشكاوى" : locale === "tr" ? "Şikayetler" : "Tickets",
    },
  ];

  const primaryBottomNav = isAdmin ? adminBottomNav : customerBottomNav;

  const customerDrawerLinks = [
    {
      group: t.nav.workspaceGroup,
      links: [
        { href: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
        { href: "/onboarding", label: t.nav.onboarding, icon: Building2 },
        { href: "/settings/brand", label: t.nav.brandSettings, icon: Sliders },
      ],
    },
    {
      group: t.nav.publishingGroup,
      links: [
        { href: "/products", label: t.nav.products, icon: ShoppingBag },
        { href: "/campaigns", label: t.nav.campaigns, icon: Megaphone },
        { href: "/content-studio", label: t.nav.contentStudio, icon: Sparkles },
        { href: "/posts", label: t.nav.posts, icon: PenTool },
        { href: "/calendar", label: t.nav.calendar, icon: Calendar },
        { href: "/integrations", label: t.nav.integrations, icon: Share2 },
      ],
    },
    {
      group: t.nav.intelligenceGroup,
      links: [
        { href: "/analytics", label: t.nav.analytics, icon: BarChart3 },
        { href: "/reports", label: t.nav.reports, icon: FileText },
      ],
    },
    {
      group: t.nav.systemGroup,
      links: [
        { href: "/notifications", label: t.nav.notifications, icon: Bell },
        { href: "/settings", label: t.nav.accountSettings, icon: Settings },
      ],
    },
  ];

  const adminDrawerLinks = [
    {
      group:
        locale === "ar"
          ? "إدارة المنصة والتحليلات"
          : locale === "tr"
          ? "Platform Yönetimi"
          : "Platform Administration",
      links: [
        {
          href: "/admin?tab=overview",
          label:
            locale === "ar"
              ? "نظرة عامة على المنصة"
              : locale === "tr"
              ? "Platform Genel Bakışı"
              : "Platform Overview",
          icon: ShieldCheck,
        },
        {
          href: "/admin?tab=traffic",
          label:
            locale === "ar"
              ? "إحصائيات الزوار والاستخدام"
              : locale === "tr"
              ? "Ziyaretçi ve Kullanım Analitiği"
              : "Visitors & Usage Analytics",
          icon: Activity,
        },
        {
          href: "/admin?tab=tenants",
          label:
            locale === "ar"
              ? "إدارة الشركات والعملاء"
              : locale === "tr"
              ? "Şirketler ve Müşteriler"
              : "Companies & Customers",
          icon: Users,
        },
        {
          href: "/admin?tab=complaints",
          label:
            locale === "ar"
              ? "شكاوى العملاء والدعم الفني"
              : locale === "tr"
              ? "Müşteri Şikayetleri ve Destek"
              : "Complaints & Support",
          icon: MessageSquareWarning,
        },
        {
          href: "/admin?tab=operations",
          label:
            locale === "ar"
              ? "الأوامر الإدارية والسجلات"
              : locale === "tr"
              ? "Yönetim Komutları ve Kayıtlar"
              : "Admin Commands & Logs",
          icon: Terminal,
        },
      ],
    },
    {
      group:
        locale === "ar"
          ? "حساب المدير"
          : locale === "tr"
          ? "Yönetici Hesabı"
          : "Admin Account",
      links: [
        { href: "/notifications", label: t.nav.notifications, icon: Bell },
        { href: "/settings", label: t.nav.accountSettings, icon: Settings },
      ],
    },
  ];

  const activeDrawerGroups = isAdmin ? adminDrawerLinks : customerDrawerLinks;

  const isLinkActive = (href: string) => {
    if (href.startsWith("/admin?tab=")) {
      const targetTab = href.split("tab=")[1];
      return pathname === "/admin" && currentAdminTab === targetTab;
    }
    return pathname === href;
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar (Visible only on <lg screens) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-navy-950/85 backdrop-blur-xl border-t border-white/10 px-2 flex items-center justify-around shadow-2xl"
      >
        {primaryBottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = isLinkActive(item.href);
          if (!isAdmin && isHrefLocked(accessTier, item.href)) {
            return (
              <button
                key={item.href}
                type="button"
                onClick={handleLockedClick}
                className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-[10px] font-medium text-txt-muted opacity-45"
              >
                <Icon className="w-5 h-5" />
                <span className="truncate max-w-[64px]">{item.label}</span>
              </button>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 py-1 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-accent-cyan"
                  : "text-txt-muted hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-transform",
                  isActive && "scale-110 text-accent-cyan"
                )}
              />
              <span className="truncate max-w-[64px]">{item.label}</span>
            </Link>
          );
        })}

        {/* Menu Drawer Toggle */}
        <button
          type="button"
          onClick={() => (isOpen ? onClose() : onOpen ? onOpen() : onClose())}
          aria-expanded={isOpen}
          className="flex flex-col items-center justify-center gap-1 flex-1 py-1 text-[10px] font-medium text-txt-muted hover:text-white"
        >
          <Menu className="w-5 h-5" />
          <span>{locale === "ar" ? "القائمة" : locale === "tr" ? "Menü" : "Menu"}</span>
        </button>
      </nav>

      {/* Slide-over Full Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 flex justify-end"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-md animate-in fade-in"
            onClick={onClose}
          />

          {/* Drawer Content */}
          <div className="relative z-10 w-4/5 max-w-sm h-full glass-panel border-s border-white/15 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="h-16 px-5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <BrandLogo className="w-8 h-8" />
                <span className="text-sm font-bold text-white">
                  {t.meta.appName}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation drawer"
                className="p-1.5 rounded-lg text-txt-muted hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between bg-white/5">
              <span className="text-xs text-txt-secondary">
                {locale === "ar" ? "اللغة" : locale === "tr" ? "Dil" : "Language"}
              </span>
              <LanguageSwitcher />
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {activeDrawerGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <h5 className="px-2 text-[10px] font-bold uppercase tracking-wider text-txt-muted">
                    {group.group}
                  </h5>
                  {group.links.map((link) => {
                    const Icon = link.icon;
                    const isActive = isLinkActive(link.href);
                    if (!isAdmin && isHrefLocked(accessTier, link.href)) {
                      return (
                        <button
                          key={link.href}
                          type="button"
                          onClick={() => {
                            onClose();
                            handleLockedClick();
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-txt-secondary opacity-45 text-start"
                        >
                          <Icon className="w-4 h-4 shrink-0 text-txt-muted" />
                          <span className="flex-1">{link.label}</span>
                          <Lock className="w-3 h-3 shrink-0 text-txt-muted" />
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                          isActive
                            ? "bg-accent-violet/20 text-white border border-accent-violet/30"
                            : "text-txt-secondary hover:text-white hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-4 h-4 shrink-0 text-txt-muted" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-white/10 bg-black/30 space-y-2.5 shrink-0">
              {!user ? (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="glass-button-primary w-full h-10 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-white"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t.access.signInCta}</span>
                </Link>
              ) : (
                <>
                  {/* Current role */}
                  <div className="flex items-center p-2.5 rounded-xl bg-white/5 text-xs">
                    <span className="text-txt-secondary text-[11px]">
                      {isAdmin ? t.nav.roleAdmin : t.nav.roleOwner}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-semantic-error bg-semantic-error/10 hover:bg-semantic-error/20 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.nav.logout}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});
