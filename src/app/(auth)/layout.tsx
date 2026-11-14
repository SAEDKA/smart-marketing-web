"use client";

import React from "react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Logo } from "@/components/brand/Logo";
import { useI18n } from "@/lib/i18n/context";
import {
  Sparkles,
  Instagram,
  Facebook,
  CheckCircle2,
  TrendingUp,
  Sliders,
  BarChart3,
} from "lucide-react";

const AUTH_SHOWCASE_COPY = {
  en: {
    headline: "From brand voice to verified social reach in one workspace.",
    subhead:
      "Connect your product catalog, synthesize multi-channel campaigns in AI Studio, approve with confidence, and track evidence-based SWOT insights.",
    liveCardTitle: "Lumiere Artisan Roasters • AI Campaign Preview",
    approvedBadge: "Human Approved",
    captionSample:
      "Delicate floral notes of jasmine blossom and bergamot citrus in our washed Ethiopia Yirgacheffe G1 micro-lot — roasted fresh every Tuesday in Istanbul.",
    metric1Label: "30d Audience Reach",
    metric2Label: "Avg. Engagement Rate",
    metric3Label: "SWOT Benchmark Lift",
  },
  tr: {
    headline: "Marka sesinden doğrulanmış sosyal medya erişimine tek merkez.",
    subhead:
      "Ürün kataloğunuzu bağlayın, YZ Stüdyosunda çok kanallı kampanyalar üretin, güvenle onaylayın ve kanıta dayalı SWOT analizlerini takip edin.",
    liveCardTitle: "Lumiere Artisan Roasters • YZ Kampanya Önizlemesi",
    approvedBadge: "İnsan Onaylı",
    captionSample:
      "Yıkanmış Etiyopya Yirgacheffe G1 mikro-lotumuzda yasemin çiçeği ve bergamot narenciye notaları — İstanbul'da her Salı taze kavrulur.",
    metric1Label: "30G Kitle Erişimi",
    metric2Label: "Ort. Etkileşim Oranı",
    metric3Label: "SWOT Kıyaslama Artışı",
  },
  ar: {
    headline: "من نبرة العلامة التجارية إلى الوصول الرقمي الموثّق في منصة واحدة.",
    subhead:
      "اربط كتالوج منتجاتك، ولّد حملات متعددة القنوات في استوديو الذكاء الاصطناعي، اعتمد المنشورات بثقة، وتابع تقارير SWOT المبنية على الأرقام.",
    liveCardTitle: "Lumiere Artisan Roasters • معاينة حملة الذكاء الاصطناعي",
    approvedBadge: "معتمد بشرياً",
    captionSample:
      "إيحاءات زهر الياسمين والبرغموت في محصول قهوة إثيوبيا ييرغاتشيفي المختصة — تحميص طازج بكميات صغيرة كل ثلاثاء.",
    metric1Label: "وصول الجمهور (30 يوماً)",
    metric2Label: "متوسط معدل التفاعل",
    metric3Label: "نمو الأداء حسب SWOT",
  },
} as const;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t, locale } = useI18n();
  const showcase = AUTH_SHOWCASE_COPY[locale];

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-x-hidden">
      {/* Top Header with Brand, Theme Switcher, and Language Switcher */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between py-2 relative z-10">
        <a href="/" className="flex items-center" aria-label="Smart Marketing">
          <Logo size={38} tagline={t.meta.appTagline} />
        </a>

        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-8 relative z-10">
        {/* Left/Start Column: Auth Form */}
        <div className="lg:col-span-5 flex justify-center">{children}</div>

        {/* Right/End Column: Live Interactive AI Marketing Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-7 flex-col justify-center">
          <div className="rounded-[26px] glass-panel border border-white/15 p-8 space-y-7 shadow-2xl">
            <div className="space-y-3">
              <h2 className="text-2xl xl:text-3xl font-bold tracking-tight text-white leading-tight">
                {showcase.headline}
              </h2>
              <p className="text-sm text-txt-secondary leading-relaxed">
                {showcase.subhead}
              </p>
            </div>

            {/* Pulsing Neural Pipeline Mini-Diagram */}
            <div className="grid grid-cols-3 gap-3 items-center pt-1">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-accent-violet shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    Brand DNA
                  </p>
                  <p className="text-[10px] text-txt-muted truncate">
                    Luxury &bull; EN/TR/AR
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-accent-violet/15 border border-accent-violet/35 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-accent-cyan shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    AI Content Studio
                  </p>
                  <p className="text-[10px] text-accent-mint truncate">
                    3 Variations Ready
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-accent-mint shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    SWOT Engine
                  </p>
                  <p className="text-[10px] text-txt-muted truncate">
                    Verified Telemetry
                  </p>
                </div>
              </div>
            </div>

            {/* Live Social Post Preview Surface */}
            <div className="p-5 rounded-2xl bg-navy-950/75 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-accent-violet" />
                  <Facebook className="w-4 h-4 text-accent-cyan" />
                  <span className="text-xs font-bold text-white">
                    {showcase.liveCardTitle}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-accent-mint/15 text-accent-mint border border-accent-mint/30">
                  <CheckCircle2 className="w-3 h-3" />
                  {showcase.approvedBadge}
                </span>
              </div>

              <p className="text-xs text-txt-secondary leading-relaxed">
                {showcase.captionSample}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-white/10 tabular-nums-metric">
                <div>
                  <span className="text-[10px] text-txt-muted block">
                    {showcase.metric1Label}
                  </span>
                  <span className="text-base font-bold text-white">18,420</span>
                </div>
                <div>
                  <span className="text-[10px] text-txt-muted block">
                    {showcase.metric2Label}
                  </span>
                  <span className="text-base font-bold text-accent-cyan">
                    4.82%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-txt-muted block">
                    {showcase.metric3Label}
                  </span>
                  <span className="text-base font-bold text-accent-mint inline-flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +31%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-7xl mx-auto text-center py-4 border-t border-white/5 relative z-10">
        <p className="text-xs text-txt-muted">
          SMART MARKETING PLATFORM &copy; 2026 &bull; AI-Powered Social Media Marketing Suite
        </p>
      </footer>
    </div>
  );
}
