"use client";

import Link from "next/link";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { useSpotlight } from "@/lib/hooks/use-spotlight";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { GettingStartedCard } from "@/components/dashboard/GettingStartedCard";
import { useI18n } from "@/lib/i18n/context";
import { companyApi } from "@/lib/api/company.api";
import { analyticsApi } from "@/lib/api/analytics.api";
import { campaignsApi } from "@/lib/api/campaigns.api";
import { postsApi } from "@/lib/api/posts.api";
import { socialApi } from "@/lib/api/social.api";
import { productsApi } from "@/lib/api/products.api";
import {
  AnalyticsMetricSummary,
  Campaign,
  CompanyProfile,
  Post,
  Product,
  SocialAccount,
} from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Sparkles,
  CheckCircle2,
  Sliders,
  ArrowRight,
  ArrowLeft,
  Users,
  Eye,
  TrendingUp,
  Megaphone,
  Calendar,
  FileText,
  BarChart3,
  PenTool,
  ShoppingBag,
  Instagram,
  Facebook,
  Wand2,
  MousePointerClick,
  Clock,
  Lightbulb,
  Lock,
  X,
} from "lucide-react";

const DASHBOARD_COPY = {
  en: {
    assistantPlaceholder:
      "Ask your AI Marketing Assistant: e.g. 'Create an Instagram launch post for Ethiopia Yirgacheffe with a luxury tone'...",
    generateNowBtn: "Generate in Studio",
    quickPromptsLabel: "Suggested Campaign Prompts:",
    prompts: [
      "Promote Ethiopia Yirgacheffe G1 micro-lot harvest",
      "Weekend artisanal sourdough & pour-over pairing",
      "Behind-the-scenes small-batch roasting story",
    ],
    workflowTitle: "Smart Marketing Pipeline",
    workflowSubtitle:
      "Live data flow from your brand identity and catalog through the AI content engine to Meta channels and SWOT reports",
    stages: {
      brand: "Brand Identity",
      products: "Product Catalog",
      campaigns: "Campaigns",
      studio: "AI Studio",
      approval: "Review & Approve",
      calendar: "Publishing",
      swot: "SWOT Insights",
    },
    activeCampaignsTitle: "Active Marketing Campaigns",
    activeCampaignsDesc:
      "Live multi-channel campaigns across Instagram Professional and Facebook Pages",
    newCampaignBtn: "New Campaign",
    contentQueueTitle: "Content Approval & Publishing Queue",
    contentQueueDesc:
      "AI-generated variations awaiting human review or scheduled for publication",
    reviewAllBtn: "Open Approval Desk",
    brandSnapshotTitle: "Brand Voice & Audience Profile",
    editBrandBtn: "Configure Brand",
    connectedChannelsTitle: "Connected Meta Channels",
    manageChannelsBtn: "Manage Integrations",
    swotHighlightTitle: "Top AI Strategic Recommendation",
    swotHighlightText:
      "Instagram carousel posts featuring single-origin tasting notes achieved 4.82% engagement (+31% above benchmark). Schedule 2 additional educational posts this week.",
    viewFullSwotBtn: "View Full SWOT Report",
    clicksLabel: "Link Clicks & Traffic",
    emptyTitle: "Your workspace is empty — for now",
    emptyDesc:
      "Everything you create will appear here: your products, campaigns, posts and results. Follow the steps above to set up your company and create your first ad.",
  },
  tr: {
    assistantPlaceholder:
      "YZ Pazarlama Asistanınıza sorun: örn. 'Etiyopya Yirgacheffe için lüks tonda bir Instagram lansman gönderisi oluştur'...",
    generateNowBtn: "Stüdyoda Üret",
    quickPromptsLabel: "Önerilen Kampanya Komutları:",
    prompts: [
      "Etiyopya Yirgacheffe G1 mikro-lot hasadını tanıt",
      "Hafta sonu ekşi mayalı ekmek ve filtre kahve eşleşmesi",
      "Sahne arkası butik kahve kavurma hikayesi",
    ],
    workflowTitle: "Akıllı Pazarlama Hattı",
    workflowSubtitle:
      "Marka kimliğiniz ve ürün kataloğunuzdan YZ içerik motoruna, Meta kanallarına ve SWOT raporlarına canlı veri akışı",
    stages: {
      brand: "Marka Kimliği",
      products: "Ürün Kataloğu",
      campaigns: "Kampanyalar",
      studio: "YZ Stüdyosu",
      approval: "İnceleme & Onay",
      calendar: "Yayın Takvimi",
      swot: "SWOT Analizi",
    },
    activeCampaignsTitle: "Aktif Pazarlama Kampanyaları",
    activeCampaignsDesc:
      "Instagram Profesyonel ve Facebook Sayfalarında yayında olan kampanyalar",
    newCampaignBtn: "Yeni Kampanya",
    contentQueueTitle: "İçerik Onay ve Yayın Kuyruğu",
    contentQueueDesc:
      "İnsan onayı bekleyen veya yayın için planlanmış YZ içerik varyasyonları",
    reviewAllBtn: "Onay Masasını Aç",
    brandSnapshotTitle: "Marka Sesi ve Hedef Kitle Profili",
    editBrandBtn: "Markayı Düzenle",
    connectedChannelsTitle: "Bağlı Meta Kanalları",
    manageChannelsBtn: "Kanalları Yönet",
    swotHighlightTitle: "Öne Çıkan YZ Stratejik Önerisi",
    swotHighlightText:
      "Tadım notlarını içeren Instagram kaydırmalı gönderileri %4,82 etkileşim oranına ulaştı (ortalamanın %31 üzerinde). Bu hafta 2 eğitici gönderi daha planlayın.",
    viewFullSwotBtn: "Tam SWOT Raporunu Gör",
    clicksLabel: "Bağlantı Tıklamaları",
    emptyTitle: "Çalışma alanınız şimdilik boş",
    emptyDesc:
      "Oluşturduğunuz her şey burada görünecek: ürünleriniz, kampanyalarınız, gönderileriniz ve sonuçlarınız. Şirketinizi kurmak ve ilk reklamınızı oluşturmak için yukarıdaki adımları izleyin.",
  },
  ar: {
    assistantPlaceholder:
      "اطلب من مساعد التسويق الذكي: مثلاً 'أنشئ منشور إطلاق على إنستغرام لقهوة إثيوبيا ييرغاتشيفي بنبرة فاخرة'...",
    generateNowBtn: "توليد في الاستوديو",
    quickPromptsLabel: "أفكار حملات مقترحة:",
    prompts: [
      "الترويج لمحصول قهوة إثيوبيا ييرغاتشيفي المختصة",
      "عرض نهاية الأسبوع: خبز الساوردو الحرفي مع القهوة المقطرة",
      "قصة من خلف الكواليس لتحميص القهوة بكميات صغيرة",
    ],
    workflowTitle: "مسار التسويق الذكي",
    workflowSubtitle:
      "تدفق حي للبيانات من هوية العلامة التجارية والمنتجات عبر محرك الذكاء الاصطناعي إلى قنوات ميتا وتقارير SWOT",
    stages: {
      brand: "هوية العلامة",
      products: "المنتجات",
      campaigns: "الحملات",
      studio: "استوديو الذكاء",
      approval: "الاعتماد البشري",
      calendar: "جدولة النشر",
      swot: "تقارير SWOT",
    },
    activeCampaignsTitle: "الحملات التسويقية النشطة",
    activeCampaignsDesc:
      "الحملات الجارية حالياً عبر حسابات إنستغرام الاحترافية وصفحات فيسبوك",
    newCampaignBtn: "حملة جديدة",
    contentQueueTitle: "طابور مراجعة وجدولة المحتوى",
    contentQueueDesc:
      "منشورات مولّدة بالذكاء الاصطناعي بانتظار المراجعة أو مجدولة للنشر التلقائي",
    reviewAllBtn: "فتح مكتب الاعتماد",
    brandSnapshotTitle: "نبرة العلامة التجارية والجمهور",
    editBrandBtn: "تعديل الهوية",
    connectedChannelsTitle: "قنوات ميتا المتصلة",
    manageChannelsBtn: "إدارة القنوات",
    swotHighlightTitle: "أهم توصية استراتيجية من الذكاء الاصطناعي",
    swotHighlightText:
      "حققت منشورات إنستغرام التفاعلية حول إيحاءات القهوة المختصة معدل تفاعل 4.82% (+31% أعلى من المعيار). ننصح بجدولة منشورين تعليميين إضافيين هذا الأسبوع.",
    viewFullSwotBtn: "عرض تقرير SWOT الكامل",
    clicksLabel: "نقرات الروابط والزيارات",
    emptyTitle: "مساحة عملك فاضية — لحد هلأ",
    emptyDesc:
      "كل شي بتعمله بيظهر هون: منتجاتك وحملاتك ومنشوراتك ونتائجك. اتبع الخطوات اللي فوق لتجهيز شركتك وإنشاء أول إعلان إلك.",
  },
} as const;

const DEFAULT_METRICS: AnalyticsMetricSummary = {
  reach: 18420,
  reachChangePercent: 14.2,
  impressions: 42910,
  impressionsChangePercent: 18.6,
  engagementRate: 4.82,
  engagementChangePercent: 0.65,
  likes: 1640,
  comments: 248,
  shares: 184,
  saves: 312,
  linkClicks: 1284,
  clickThroughRate: 2.99,
  clicksChangePercent: 22.4,
  measuredPeriod: "Last 30 Days",
  lastSynchronizedAt: "2026-11-11T10:30:00.000Z",
};

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale, dir } = useI18n();
  const copy = DASHBOARD_COPY[locale];
  const isRtl = dir === "rtl";
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  const [assistantPrompt, setAssistantPrompt] = useState("");
  // One-time green banner after the company onboarding is saved.
  const [companySaved, setCompanySaved] = useState(false);
  useEffect(() => {
    try {
      if (window.sessionStorage.getItem("smp_company_saved") === "1") {
        window.sessionStorage.removeItem("smp_company_saved");
        setCompanySaved(true);
      }
    } catch {
      // Storage unavailable; the banner simply never shows.
    }
  }, []);
  const [company, setCompany] = useState<CompanyProfile>({
    id: "cmp_lumiere_01",
    companyName: "Lumiere Artisan Roasters",
    industry: "Specialty Coffee & Artisanal Bakery",
    description:
      "Single-origin specialty coffee roastery and artisanal sourdough bakery serving urban coffee enthusiasts across Istanbul and online.",
    targetAudience:
      "Urban professionals, creatives, and specialty coffee lovers aged 24–45",
    countryRegion: "Turkey — Istanbul & MENA",
    preferredLanguage: "en",
    communicationTone: "LUXURY",
    brandInformation:
      "Highlight small-batch roasting, direct-trade farms, and sensory tasting notes.",
    onboardingCompleted: true,
    updatedAt: "2026-11-11T10:30:00.000Z",
  });
  const [metrics, setMetrics] = useState<AnalyticsMetricSummary>(DEFAULT_METRICS);
  const [products, setProducts] = useState<Product[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  // True once the overview fetch settles (success or failure). Until
  // then the dashboard shows the ladder card plus a loading panel —
  // never data sections built from placeholder state.
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    async function loadWorkspaceOverview() {
      try {
        const [compRes, metRes, prodRes, campRes, postRes, accRes] =
          await Promise.all([
            companyApi.getProfile(),
            analyticsApi.getSummary("30d"),
            productsApi.getProducts(),
            campaignsApi.getCampaigns(),
            postsApi.getPosts(),
            socialApi.getAccounts(),
          ]);
        if (compRes.data) setCompany(compRes.data);
        if (metRes.data) setMetrics(metRes.data);
        if (prodRes.data) setProducts(prodRes.data);
        if (campRes.data) setCampaigns(campRes.data);
        if (postRes.data) setPosts(postRes.data);
        if (accRes.data) setAccounts(accRes.data);
      } catch (err) {
        console.error("Workspace overview sync warning:", err);
      } finally {
        setLoaded(true);
      }
    }
    loadWorkspaceOverview();
  }, []);

  // A workspace counts as active only when the company actually has
  // something in it. A brand-new owner sees the ladder and an honest
  // empty state instead of another company's numbers.
  const hasActivity =
    products.length > 0 ||
    campaigns.length > 0 ||
    posts.length > 0 ||
    accounts.length > 0 ||
    metrics.reach > 0;

  const handleSpotlightMove = useSpotlight();

  const handleAssistantSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      router.push("/content-studio");
    },
    [router]
  );

  const workflowSteps = useMemo(
    () => [
    {
      label: copy.stages.brand,
      value: company.communicationTone,
      href: "/settings/brand",
      icon: Sliders,
    },
    {
      label: copy.stages.products,
      value: `${products.filter((p) => p.status === "ACTIVE").length} Active`,
      href: "/products",
      icon: ShoppingBag,
    },
    {
      label: copy.stages.campaigns,
      value: `${campaigns.filter((c) => c.status === "ACTIVE").length} Live`,
      href: "/campaigns",
      icon: Megaphone,
    },
    {
      label: copy.stages.studio,
      value: posts.length > 0 ? `${posts.length} Posts` : "Not yet",
      href: "/content-studio",
      icon: Sparkles,
    },
    {
      label: copy.stages.approval,
      value: `${posts.length} Posts`,
      href: "/posts",
      icon: PenTool,
    },
    {
      label: copy.stages.calendar,
      value: `${accounts.length} Channels`,
      href: "/calendar",
      icon: Calendar,
    },
    {
      label: copy.stages.swot,
      value: posts.some((p) => p.status === "PUBLISHED")
        ? "SWOT Ready"
        : "Not yet",
      href: "/reports",
      icon: FileText,
    },
    ],
    // Icons and hrefs are module constants; only these values vary.
    [copy, company.communicationTone, products, campaigns, posts, accounts]
  );

  // Guest dashboard: no data at all — just the professional sign-in
  // notice and the ladder card showing what signing up unlocks.
  if (!user) {
    return (
      <div className="space-y-7 animate-in fade-in duration-300">
        <section className="glass-panel rounded-[26px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
          <span className="w-12 h-12 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-accent-cyan" />
          </span>
          <div className="flex-1 min-w-0 space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {t.access.guestTitle}
            </h1>
            <p className="text-sm text-txt-secondary leading-relaxed max-w-xl">
              {t.access.guestDesc}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/login"
              className="inline-flex items-center h-10 px-4 rounded-[12px] glass-button-secondary text-xs font-semibold text-white"
            >
              {t.access.signInCta}
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center h-10 px-4 rounded-[12px] glass-button-primary text-xs font-semibold text-white"
            >
              {t.access.registerCta}
            </Link>
          </div>
        </section>
        <GettingStartedCard />
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-in fade-in duration-300" data-enter="">
      {/* One-time banner: the company details were just saved */}
      {companySaved && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-accent-mint/40 bg-accent-mint/15 px-4 py-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-accent-mint shrink-0" />
          <span className="flex-1 text-sm font-medium text-accent-mint">
            {t.access.companySaved}
          </span>
          <button
            type="button"
            onClick={() => setCompanySaved(false)}
            aria-label={t.common.cancel}
            className="p-1 rounded-lg text-accent-mint/70 hover:text-accent-mint hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Getting started: the access ladder (account, company, products) */}
      <GettingStartedCard />

      {/* While the overview loads: card + a plain loading panel only */}
      {!loaded && (
        <section className="glass-panel rounded-[26px] p-6 sm:p-8">
          <p className="text-sm text-txt-secondary">{t.common.loading}</p>
        </section>
      )}

      {/* Loaded but the company has done nothing yet: an honest empty
          state instead of demo numbers from another workspace */}
      {loaded && !hasActivity && (
        <section className="glass-panel rounded-[26px] p-6 sm:p-8 flex flex-col items-center text-center gap-3">
          <span className="w-12 h-12 rounded-full bg-accent-violet/15 border border-accent-violet/30 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-accent-violet" />
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-white">
            {copy.emptyTitle}
          </h2>
          <p className="text-sm text-txt-secondary leading-relaxed max-w-xl">
            {copy.emptyDesc}
          </p>
        </section>
      )}

      {loaded && hasActivity && (
        <>

      {/* 1. AI Marketing Assistant Command Center Hero with Cursor Spotlight */}
      <section
        onMouseMove={handleSpotlightMove}
        className="relative overflow-hidden rounded-[26px] glass-panel glass-spotlight p-6 sm:p-8"
      >
        <div
          className="absolute -top-24 -end-24 w-96 h-96 rounded-full bg-gradient-to-br from-accent-violet/25 via-accent-indigo/15 to-accent-cyan/20 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {t.dashboard.welcomePrefix},{" "}
                {user?.fullName?.split(" ")[0] || "Sarah"}
              </h1>
              <p className="text-sm sm:text-base text-txt-secondary max-w-2xl leading-relaxed">
                {company.companyName} &bull; {company.industry}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link href="/campaigns">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Megaphone className="w-4 h-4 text-accent-violet" />}
                >
                  {copy.newCampaignBtn}
                </Button>
              </Link>
              <Link href="/calendar">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Calendar className="w-4 h-4 text-accent-cyan" />}
                >
                  {t.nav.calendar}
                </Button>
              </Link>
              <Link href="/reports">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<FileText className="w-4 h-4 text-accent-mint" />}
                >
                  {t.nav.reports}
                </Button>
              </Link>
            </div>
          </div>

          {/* Interactive AI Assistant Prompt Bar */}
          <form
            onSubmit={handleAssistantSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 rounded-[16px] bg-navy-950/75 border border-white/15 shadow-inner"
          >
            <div className="flex items-center gap-3 flex-1 px-3 py-1.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-violet to-accent-cyan flex items-center justify-center shrink-0 shadow-glow-violet">
                <Wand2 className="w-4 h-4 text-navy-950" />
              </div>
              <input
                type="text"
                value={assistantPrompt}
                onChange={(e) => setAssistantPrompt(e.target.value)}
                placeholder={copy.assistantPlaceholder}
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-txt-muted focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="shrink-0"
            >
              {copy.generateNowBtn}
            </Button>
          </form>

          {/* Suggested Prompt Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-txt-muted me-1">
              {copy.quickPromptsLabel}
            </span>
            {copy.prompts.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setAssistantPrompt(promptText);
                  router.push("/content-studio");
                }}
                className="px-3 py-1 rounded-full text-xs text-txt-secondary hover:text-white bg-white/5 hover:bg-accent-violet/20 border border-white/10 hover:border-accent-violet/40 transition-all"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Executive KPI Strip (Animated Count-Up + Area Sparklines) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/analytics"
          onMouseMove={handleSpotlightMove}
          className="glass-card-interactive glass-spotlight p-5 flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-txt-secondary">
              {t.analytics.reachLabel}
            </span>
            <div className="w-9 h-9 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent-cyan" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 relative z-10">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums-metric tracking-tight">
                <AnimatedCounter value={metrics.reach} />
              </p>
              <span className="text-xs font-semibold text-accent-mint inline-flex items-center gap-1 mt-1 tabular-nums-metric">
                <TrendingUp className="w-3.5 h-3.5" />+{metrics.reachChangePercent}%
              </span>
            </div>
            <svg
              className="w-24 h-10 text-accent-cyan overflow-visible"
              viewBox="0 0 96 36"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 30 L20 24 L38 26 L56 15 L74 17 L94 4 L94 34 L2 34 Z"
                fill="currentColor"
                fillOpacity="0.14"
              />
              <path
                d="M2 30 L20 24 L38 26 L56 15 L74 17 L94 4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>

        <Link
          href="/analytics"
          onMouseMove={handleSpotlightMove}
          className="glass-card-interactive glass-spotlight p-5 flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-txt-secondary">
              {t.analytics.impressionsLabel}
            </span>
            <div className="w-9 h-9 rounded-xl bg-accent-violet/15 border border-accent-violet/30 flex items-center justify-center">
              <Eye className="w-4 h-4 text-accent-violet" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 relative z-10">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums-metric tracking-tight">
                <AnimatedCounter value={metrics.impressions} />
              </p>
              <span className="text-xs font-semibold text-accent-mint inline-flex items-center gap-1 mt-1 tabular-nums-metric">
                <TrendingUp className="w-3.5 h-3.5" />+
                {metrics.impressionsChangePercent}%
              </span>
            </div>
            <svg
              className="w-24 h-10 text-accent-violet overflow-visible"
              viewBox="0 0 96 36"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 31 L18 22 L38 23 L56 13 L76 10 L94 3 L94 34 L2 34 Z"
                fill="currentColor"
                fillOpacity="0.14"
              />
              <path
                d="M2 31 L18 22 L38 23 L56 13 L76 10 L94 3"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>

        <Link
          href="/analytics"
          onMouseMove={handleSpotlightMove}
          className="glass-card-interactive glass-spotlight p-5 flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-txt-secondary">
              {t.analytics.engagementRateLabel}
            </span>
            <div className="w-9 h-9 rounded-xl bg-accent-mint/15 border border-accent-mint/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-accent-mint" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 relative z-10">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums-metric tracking-tight">
                {metrics.engagementRate}%
              </p>
              <span className="text-xs font-semibold text-accent-mint inline-flex items-center gap-1 mt-1 tabular-nums-metric">
                <TrendingUp className="w-3.5 h-3.5" />+
                {metrics.engagementChangePercent}%
              </span>
            </div>
            <svg
              className="w-24 h-10 text-accent-mint overflow-visible"
              viewBox="0 0 96 36"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 28 L22 22 L42 18 L60 20 L78 11 L94 5 L94 34 L2 34 Z"
                fill="currentColor"
                fillOpacity="0.14"
              />
              <path
                d="M2 28 L22 22 L42 18 L60 20 L78 11 L94 5"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>

        <Link
          href="/analytics"
          onMouseMove={handleSpotlightMove}
          className="glass-card-interactive glass-spotlight p-5 flex flex-col justify-between space-y-4"
        >
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-txt-secondary">
              {copy.clicksLabel}
            </span>
            <div className="w-9 h-9 rounded-xl bg-accent-indigo/15 border border-accent-indigo/30 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4 text-accent-cyan" />
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 relative z-10">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums-metric tracking-tight">
                <AnimatedCounter value={metrics.linkClicks} />
              </p>
              <span className="text-xs font-semibold text-accent-cyan inline-flex items-center gap-1 mt-1 tabular-nums-metric">
                CTR {metrics.clickThroughRate}%
              </span>
            </div>
            <svg
              className="w-24 h-10 text-accent-cyan overflow-visible"
              viewBox="0 0 96 36"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 29 L20 26 L40 19 L58 16 L76 9 L94 4 L94 34 L2 34 Z"
                fill="currentColor"
                fillOpacity="0.14"
              />
              <path
                d="M2 29 L20 26 L40 19 L58 16 L76 9 L94 4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>
      </section>

      {/* 3. End-to-End Marketing Workflow Pipeline + Pulsing Vector Line */}
      <Card
        onMouseMove={handleSpotlightMove}
        className="p-6 glass-spotlight"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10 relative z-10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {copy.workflowTitle}
            </h2>
            <p className="text-xs text-txt-secondary mt-0.5">
              {copy.workflowSubtitle}
            </p>
          </div>
          <Badge variant="mint" size="sm">
            Pipeline up to date
          </Badge>
        </div>

        {/* Animated Pulsing SVG Line */}
        <div className="hidden lg:block pt-4 pb-1 relative z-10">
          <svg className="w-full h-5 overflow-visible" viewBox="0 0 1000 20" fill="none">
            <path
              d="M 40 10 L 960 10"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="2"
            />
            <path
              d="M 40 10 L 960 10"
              stroke="var(--accent-violet)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="diagram-pulse-line"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 relative z-10">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.href}
                href={step.href}
                className="group p-3.5 rounded-[16px] bg-white/[0.03] hover:bg-accent-violet/15 border border-white/10 hover:border-accent-violet/40 transition-all flex flex-col justify-between gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-accent-violet/15 text-accent-cyan flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint opacity-80" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-accent-cyan transition-colors truncate">
                    {step.label}
                  </p>
                  <p className="text-[11px] text-accent-mint font-medium mt-0.5 tabular-nums-metric">
                    {step.value}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* 4. Main Operational Grid: Active Campaigns + Content Queue (Left) & Brand + Channels + SWOT (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Campaigns & Content Approval Queue */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Campaigns */}
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {copy.activeCampaignsTitle}
                </h2>
                <p className="text-xs text-txt-secondary mt-0.5">
                  {copy.activeCampaignsDesc}
                </p>
              </div>
              <Link href="/campaigns">
                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<DirectionalArrow className="w-3.5 h-3.5" />}
                >
                  {t.nav.campaigns}
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-white/10 pt-2">
              {campaigns.slice(0, 3).map((camp) => (
                <div
                  key={camp.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <Link
                        href="/campaigns"
                        className="text-sm font-bold text-white hover:text-accent-cyan transition-colors truncate"
                      >
                        {camp.name}
                      </Link>
                      <Badge
                        variant={camp.status === "ACTIVE" ? "mint" : "violet"}
                        size="sm"
                      >
                        {camp.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-txt-secondary line-clamp-1">
                      {camp.targetAudience}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-txt-muted pt-0.5 tabular-nums-metric">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent-violet" />
                        {camp.startDate} &rarr; {camp.endDate}
                      </span>
                      <span>&bull;</span>
                      <span>{camp.publishingFrequency}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 me-1">
                      {camp.platforms.includes("INSTAGRAM") && (
                        <span className="w-7 h-7 rounded-lg bg-accent-violet/15 text-accent-violet flex items-center justify-center">
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {camp.platforms.includes("FACEBOOK") && (
                        <span className="w-7 h-7 rounded-lg bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
                          <Facebook className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <Link href={`/content-studio?campaignId=${camp.id}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Sparkles className="w-3.5 h-3.5 text-accent-cyan" />}
                      >
                        AI Studio
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Content Review & Publishing Queue */}
          <Card className="p-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {copy.contentQueueTitle}
                </h2>
                <p className="text-xs text-txt-secondary mt-0.5">
                  {copy.contentQueueDesc}
                </p>
              </div>
              <Link href="/posts">
                <Button
                  variant="secondary"
                  size="sm"
                  rightIcon={<DirectionalArrow className="w-3.5 h-3.5" />}
                >
                  {copy.reviewAllBtn}
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-white/10 pt-2">
              {posts.slice(0, 3).map((post) => (
                <Link
                  key={post.id}
                  href="/posts"
                  className="py-3.5 flex items-start justify-between gap-4 group block"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      {post.platform === "INSTAGRAM" ? (
                        <Instagram className="w-4 h-4 text-accent-violet" />
                      ) : (
                        <Facebook className="w-4 h-4 text-accent-cyan" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-accent-cyan transition-colors truncate">
                        {post.currentVersion.title}
                      </p>
                      <p className="text-xs text-txt-secondary line-clamp-1 mt-0.5">
                        {post.currentVersion.caption}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      post.status === "APPROVED" || post.status === "PUBLISHED"
                        ? "mint"
                        : post.status === "SCHEDULED"
                        ? "cyan"
                        : "warning"
                    }
                    size="sm"
                    className="shrink-0"
                  >
                    {post.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): Brand Profile, Meta Channels & SWOT Insight */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top AI Strategic Recommendation (SWOT Highlight) */}
          <Card className="p-6 border-accent-violet/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent-violet to-accent-cyan flex items-center justify-center shrink-0 shadow-glow-violet">
                <Lightbulb className="w-5 h-5 text-navy-950" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {copy.swotHighlightTitle}
                  </h3>
                  <Badge variant="cyan" size="sm">
                    AI Insight
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed">
                  {copy.swotHighlightText}
                </p>
                <div className="pt-2">
                  <Link
                    href="/reports"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-cyan hover:text-white transition-colors"
                  >
                    <span>{copy.viewFullSwotBtn}</span>
                    <DirectionalArrow className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Brand Voice & Audience Profile */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="text-base font-bold text-white">
                  {copy.brandSnapshotTitle}
                </h2>
                <p className="text-xs text-txt-secondary mt-0.5">
                  {company.companyName}
                </p>
              </div>
              <Link href="/settings/brand">
                <Button variant="ghost" size="sm" leftIcon={<Sliders className="w-3.5 h-3.5" />}>
                  {copy.editBrandBtn}
                </Button>
              </Link>
            </div>

            <dl className="divide-y divide-white/10 text-xs pt-1">
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-txt-muted font-medium">
                  {t.dashboard.brandToneLabel}
                </dt>
                <dd className="font-semibold text-accent-violet">
                  {company.communicationTone}
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-txt-muted font-medium">
                  {t.dashboard.contentLangLabel}
                </dt>
                <dd className="font-semibold text-accent-cyan uppercase">
                  {company.preferredLanguage}
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-txt-muted font-medium">
                  {t.dashboard.regionLabel}
                </dt>
                <dd className="font-medium text-white truncate max-w-[200px]">
                  {company.countryRegion}
                </dd>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <dt className="text-txt-muted font-medium">Target Audience</dt>
                <dd className="font-medium text-txt-secondary truncate max-w-[220px]">
                  {company.targetAudience}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Connected Meta Channels */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h2 className="text-base font-bold text-white">
                {copy.connectedChannelsTitle}
              </h2>
              <Link
                href="/integrations"
                className="text-xs font-semibold text-accent-cyan hover:text-white transition-colors"
              >
                {copy.manageChannelsBtn}
              </Link>
            </div>

            <div className="divide-y divide-white/10 pt-1">
              {accounts.map((acc) => (
                <Link
                  key={acc.id}
                  href="/integrations"
                  className="py-3.5 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      {acc.platform === "INSTAGRAM" ? (
                        <Instagram className="w-4 h-4 text-accent-violet" />
                      ) : (
                        <Facebook className="w-4 h-4 text-accent-cyan" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-accent-cyan transition-colors truncate">
                        {acc.accountName}
                      </p>
                      <p className="text-[11px] text-txt-muted truncate tabular-nums-metric">
                        {acc.accountHandle} &bull;{" "}
                        {(acc.followerCount ?? 0).toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                  <Badge variant="mint" size="sm">
                    {acc.status}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

        </>
      )}
    </div>
  );
}
