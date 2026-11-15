"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { AccessNoticeKind } from "@/lib/access/access";

/**
 * The professional on-screen notice for locked areas: guests are asked
 * to sign in for all features, signed-in owners without a company are
 * asked to complete the company profile. Triggered from anywhere via
 * showAccessNotice() (lib/access).
 */
export function AccessNoticeToast() {
  const { t } = useI18n();
  const router = useRouter();
  const [kind, setKind] = useState<AccessNoticeKind | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const onNotice = (event: Event) => {
      const detail = (event as CustomEvent<AccessNoticeKind>).detail;
      setKind(detail === "company" ? "company" : "login");
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setKind(null), 6500);
    };
    window.addEventListener("smp:access-notice", onNotice);
    return () => {
      window.removeEventListener("smp:access-notice", onNotice);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!kind) return null;

  const isLogin = kind === "login";
  const Icon = isLogin ? Lock : Building2;

  const handleAction = () => {
    setKind(null);
    router.push(isLogin ? "/login" : "/onboarding");
  };

  return (
    <div
      role="alert"
      className="fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 z-[70] w-[calc(100%-2rem)] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="glass-panel rounded-2xl p-4 flex items-start gap-3 shadow-2xl">
        <span className="w-10 h-10 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-accent-cyan" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">
            {isLogin ? t.access.loginNoticeTitle : t.access.companyNoticeTitle}
          </p>
          <p className="text-xs text-txt-secondary mt-1 leading-relaxed">
            {isLogin ? t.access.loginNoticeDesc : t.access.companyNoticeDesc}
          </p>
          <button
            type="button"
            onClick={handleAction}
            className="glass-button-primary mt-3 px-3.5 h-8 rounded-[10px] text-xs font-semibold text-white inline-flex items-center"
          >
            {isLogin ? t.access.signInCta : t.access.companyCta}
          </button>
        </div>
        <button
          type="button"
          onClick={() => setKind(null)}
          aria-label={t.common.cancel}
          className="p-1 rounded-lg text-txt-muted hover:text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
