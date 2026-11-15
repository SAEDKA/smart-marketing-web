"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Lock, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { productsApi } from "@/lib/api/products.api";
import { cn } from "@/lib/utils";

type StepState = "done" | "current" | "locked";

interface LadderStep {
  key: string;
  title: string;
  desc: string;
  state: StepState;
  ctaLabel?: string;
  ctaHref?: string;
}

const DISMISS_KEY = "smp_get_started_dismissed";

/**
 * The access-ladder card from the owner's design: three steps —
 * account, company, products — each marked with a ✓ Done badge as it
 * completes, one clear action on the current step, and later steps
 * faded until their turn comes. It doubles as the guest's guide on the
 * guest dashboard.
 */
export function GettingStartedCard() {
  const { t } = useI18n();
  const { user, accessTier } = useAuth();
  const [productsCount, setProductsCount] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  // Step 3 completes with the first real product; only a full account
  // can have products, so only then is the count worth fetching.
  useEffect(() => {
    if (accessTier !== "full") return;
    let cancelled = false;
    productsApi
      .getProducts()
      .then((res) => {
        if (!cancelled) setProductsCount(res.data.length);
      })
      .catch(() => {
        if (!cancelled) setProductsCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [accessTier]);

  const accountDone = !!user;
  const companyDone = accessTier === "full";
  const productsDone = companyDone && (productsCount ?? 0) > 0;
  const allDone = accountDone && companyDone && productsDone;

  if (dismissed && allDone) return null;

  const steps: LadderStep[] = [
    {
      key: "account",
      title: t.access.stepAccountTitle,
      desc: t.access.stepAccountDesc,
      state: accountDone ? "done" : "current",
      ctaLabel: t.access.registerCta,
      ctaHref: "/register",
    },
    {
      key: "company",
      title: t.access.stepCompanyTitle,
      desc: t.access.stepCompanyDesc,
      state: companyDone ? "done" : accountDone ? "current" : "locked",
      ctaLabel: t.access.stepCompanyCta,
      ctaHref: "/onboarding",
    },
    {
      key: "products",
      title: t.access.stepProductsTitle,
      desc: t.access.stepProductsDesc,
      state: productsDone ? "done" : companyDone ? "current" : "locked",
      ctaLabel: t.access.stepProductsCta,
      ctaHref: "/products",
    },
  ];

  const dismiss = () => {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Best-effort persistence only.
    }
  };

  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-white">
          {t.access.gettingStartedTitle}
        </h2>
        {allDone && (
          <button
            type="button"
            onClick={dismiss}
            aria-label={t.common.cancel}
            className="p-1.5 rounded-lg text-txt-muted hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-2 divide-y divide-white/5">
        {steps.map((step, idx) => (
          <div
            key={step.key}
            className={cn(
              "flex items-center gap-4 py-4",
              step.state === "locked" && "opacity-50"
            )}
          >
            <span
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold border",
                step.state === "done" &&
                  "bg-accent-mint/20 border-accent-mint/50 text-accent-mint",
                step.state === "current" &&
                  "bg-accent-cyan/15 border-accent-cyan/50 text-accent-cyan",
                step.state === "locked" &&
                  "bg-white/5 border-white/15 text-txt-muted"
              )}
            >
              {step.state === "done" ? (
                <Check className="w-4 h-4" />
              ) : (
                idx + 1
              )}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="truncate">{step.title}</span>
                {step.state === "done" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-mint/15 text-accent-mint border border-accent-mint/30 shrink-0">
                    <Check className="w-3 h-3" />
                    {t.access.doneBadge}
                  </span>
                )}
              </p>
              <p className="text-xs text-txt-secondary mt-0.5">{step.desc}</p>
            </div>

            {step.state === "current" && step.ctaHref && (
              <Link
                href={step.ctaHref}
                className="glass-button-primary px-3.5 h-9 rounded-[11px] inline-flex items-center text-xs font-semibold text-white shrink-0"
              >
                {step.ctaLabel}
              </Link>
            )}
            {step.state === "locked" && (
              <Lock className="w-4 h-4 text-txt-muted shrink-0" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
