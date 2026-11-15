"use client";

import Link from "next/link";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { useSpotlight } from "@/lib/hooks/use-spotlight";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
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
    workflowTitle: "Intelligent Marketing Pipeline & Neural Hub",
    workflowSubtitle:
      "Live data flow from your brand identity and catalog through the AI synthesis engine to Meta channels and SWOT intelligence",
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
    getStarted: {
      title: "New here? Start in 3 simple steps",
      subtitle:
        "Everything else can wait. Start with your first ad — products are optional, they only make it stronger.",
      dismiss: "Hide this guide",
      steps: [
        {
          title: "Create your first ad",
          desc: "Write your idea in your own words and let the AI draft it for you.",
        },
        {
          title: "Add products (optional)",
          desc: "Saved products strengthen ads with real names, prices and photos.",
        },
        {
          title: "Review & schedule",
          desc: "Approve the post and choose when it goes out.",
        },
      ],
    },
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
    workflowTitle: "Akıllı Pazarlama Hattı ve Sinirsel Merkez",
    workflowSubtitle:
      "Marka kimliğiniz ve ürün kataloğunuzdan YZ sentez motoruna, Meta kanallarına ve SWOT istihbaratına canlı veri akışı",
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
    getStarted: {
      title: "Yeni misiniz? 3 basit adımda başlayın",
      subtitle:
        "Gerisi bekleyebilir. İlk reklamınızla başlayın — ürünler isteğe bağlıdır, reklamı sadece güçlendirir.",
      dismiss: "Bu kılavuzu gizle",
      steps: [
        {
          title: "İlk reklamınızı oluşturun",
          desc: "Fikrinizi kendi sözlerinizle yazın, yapay zeka sizin için hazırlasın.",
        },
        {
          title: "Ürün ekleyin (isteğe bağlı)",
          desc: "Kayıtlı ürünler; gerçek ad, fiyat ve fotoğraflarla reklamı güçlendirir.",
        },
        {
          title: "İnceleyin ve planlayın",
          desc: "Gönderiyi onaylayın ve ne zaman yayınlanacağını seçin.",
        },
      ],
    },
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
    workflowTitle: "مسار التسويق الذكي والمركز العصبي",
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
    getStarted: {
      title: "جديد هون؟ بلّش بـ ٣ خطوات بسيطة",
      subtitle:
        "كل شي تاني بيستنى. بلّش بأول إعلان — المنتجات اختيارية وبتقوّيه بس.",
      dismiss: "إخفاء هذا الدليل",
      steps: [
        {
          title: "اعمل أول إعلان",
          desc: "اكتب فكرتك بكلماتك وخلي الذكاء الاصطناعي يجهّزها.",
        },
        {
          title: "أضف منتجات (اختياري)",
          desc: "المنتجات المحفوظة بتقوّي الإعلان بالاسم والسعر والصور الحقيقية.",
        },
        {
          title: "راجع وجدول النشر",
          desc: "وافق عالمنشور واختار إيمتى يطلع.",
        },
      ],
    },
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
  const [getStartedDismissed, setGetStartedDismissed] = useState<boolean>(() => {
    try {
      return (
        typeof window !== "undefined" &&
        window.localStorage.getItem("smp_get_started_dismissed") === "1"
      );
    } catch {
      return false;
    }
  });
  const dismissGetStarted = useCallback(() => {
    setGetStartedDismissed(true);
    try {
      window.localStorage.setItem("smp_get_started_dismissed", "1");
    } catch {
      // Storage unavailable; the guide just stays for this session.
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
      }
    }
    loadWorkspaceOverview();
  }, []);

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
      value: `${products.length || 5} Active`,
      href: "/products",
      icon: ShoppingBag,
    },
    {
      label: copy.stages.campaigns,
      value: `${campaigns.length || 4} Live`,
      href: "/campaigns",
      icon: Megaphone,
    },
    {
      label: copy.stages.studio,
      value: "3 Variants",
      href: "/content-studio",
      icon: Sparkles,
    },
    {
      label: copy.stages.approval,
      value: `${posts.length || 7} Posts`,
      href: "/posts",
      icon: PenTool,
    },
    {
      label: copy.stages.calendar,
      value: `${accounts.length || 2} Channels`,
      href: "/calendar",
      icon: Calendar,
    },
    {
      label: copy.stages.swot,
      value: "SWOT Ready",
      href: "/reports",
      icon: FileText,
    },
    ],
    // Icons and hrefs are module constants; only these values vary.
    [copy, company.communicationTone, products.length, campaigns.length, posts.length, accounts.length]
  );

  const getStartedSteps = [
    { href: "/content-studio", Icon: Wand2 },
    { href: "/products", Icon: ShoppingBag },
    { href: "/calendar", Icon: Calendar },
  ];

  return (
    <div className="space-y-7 animate-in fade-in duration-300" data-enter="">
      {/* Get Started guide: the beginner's path to a first post, dismissible */}
      {!getStartedDismissed && (
        <section className="relative overflow-hidden rounded-[26px] glass-panel p-6 sm:p-7">
          <button
            type="button"
            aria-label={copy.getStarted.dismiss}
            onClick={dismissGetStarted}
            className="absolute top-4 end-4 p-1.5 text-txt-muted hover:text-white rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="space-y-1.5 pe-8">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {copy.getStarted.title}
            </h2>
            <p className="text-sm text-txt-secondary max-w-2xl leading-relaxed">
              {copy.getStarted.subtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
            {getStartedSteps.map(({ href, Icon }, i) => (
              <Link
                key={href}
                href={href}
                className="group flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-accent-mint/40 hover:bg-white/[0.07] transition-colors"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-mint/15 border border-accent-mint/30 text-accent-mint text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="space-y-1 min-w-0">
                  <span className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Icon className="w-4 h-4 text-accent-cyan shrink-0" />
                    {copy.getStarted.steps[i].title}
                  </span>
                  <span className="block text-xs text-txt-secondary leading-relaxed">
                    {copy.getStarted.steps[i].desc}
                  </span>
                </span>
                <DirectionalArrow className="w-4 h-4 text-txt-muted group-hover:text-accent-mint transition-colors ms-auto shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>
        </section>
      )}

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

      {/* 2. Executive KPI Telemetry Strip (Animated Count-Up + Area Sparklines) */}
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

      {/* 3. End-to-End Marketing Workflow Pipeline + Pulsing Neural Vector Line */}
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
            Neural Pipeline Synchronized
          </Badge>
        </div>

        {/* Animated Pulsing SVG Neural Line (taste-skill Rule 7) */}
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
    </div>
  );
}
