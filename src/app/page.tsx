"use client";

import Link from "next/link";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { useSpotlight } from "@/lib/hooks/use-spotlight";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { TypewriterHeadline } from "@/components/landing/TypewriterHeadline";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Instagram,
  Facebook,
  CheckCircle2,
  Calendar,
  BarChart3,
  FileText,
  Wand2,
  ShoppingBag,
  Sliders,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const LANDING_COPY = {
  en: {
    navProduct: "Platform",
    navPipeline: "Neural Pipeline",
    navWorkflow: "Live Studio",
    openDashboard: "Open Workspace",
    signIn: "Sign In",
    startFree: "Start Free Workspace",
    heroHeadline: [
      { text: "AI", accent: true },
      { text: " social media " },
      { text: "marketing", accent: true },
      { text: " for independent businesses." },
    ],
    heroSubhead:
      "Turn your product catalog and brand voice into approved Instagram Professional and Facebook Page campaigns, scheduled publications, and evidence-based SWOT intelligence in one workspace.",
    tryStudioBtn: "Launch AI Content Studio",
    exploreDashboardBtn: "Explore Marketing Command",
    liveFrameTitle: "Interactive Studio Preview — Select a business to test live synthesis",
    approvePreviewBtn: "Approved for Meta Schedule",
    diagramHeading: "One brand input drives three parallel marketing lanes.",
    diagramSub:
      "Your brand identity and product catalog feed the neural synthesis engine, dispatching human-approved posts to Instagram, Facebook, and the SWOT telemetry loop.",
    inputNodeTitle: "Brand & Catalog Input",
    inputNodeSub: "Tone, audience & product media",
    coreNodeTitle: "Neural Marketing Engine",
    coreNodeSub: "Multi-variant synthesis & readiness gate",
    lane1Title: "Instagram Professional",
    lane1Sub: "Carousels, Reels captions & hashtags",
    lane2Title: "Facebook Page",
    lane2Sub: "Community stories & direct link CTAs",
    lane3Title: "SWOT Intelligence",
    lane3Sub: "Reach vs. impressions & strategic actions",
    momentHeading: "Every campaign moves from raw product notes to verified reach.",
    momentSub:
      "Switch between the three core stages below to inspect how a single product entry becomes a scheduled campaign and an evidence-backed SWOT recommendation.",
    stage1Tab: "1. Product & Brand DNA",
    stage2Tab: "2. AI Multi-Variant Drafts",
    stage3Tab: "3. Published & SWOT Verified",
    ctaClosingHeading: "Run your entire social media marketing workflow in one place.",
    ctaClosingSub:
      "Start with your brand voice, add your first product, and generate three campaign-ready social variations in under two minutes.",
  },
  tr: {
    navProduct: "Platform",
    navPipeline: "Sinirsel Hat",
    navWorkflow: "Canlı Stüdyo",
    openDashboard: "Çalışma Alanını Aç",
    signIn: "Giriş Yap",
    startFree: "Ücretsiz Başla",
    heroHeadline: [
      { text: "Bağımsız işletmeler için " },
      { text: "yapay zeka", accent: true },
      { text: " sosyal medya " },
      { text: "pazarlaması", accent: true },
      { text: "." },
    ],
    heroSubhead:
      "Ürün kataloğunuzu ve marka sesinizi tek bir çalışma alanında onaylı Instagram Profesyonel ve Facebook Sayfası kampanyalarına, yayın takvimine ve kanıta dayalı SWOT analizlerine dönüştürün.",
    tryStudioBtn: "YZ İçerik Stüdyosunu Aç",
    exploreDashboardBtn: "Pazarlama Merkezini Keşfet",
    liveFrameTitle: "Canlı Stüdyo Önizlemesi — Sentezi test etmek için bir işletme seçin",
    approvePreviewBtn: "Meta Takvimi İçin Onaylandı",
    diagramHeading: "Tek bir marka girdisi üç paralel pazarlama hattını besler.",
    diagramSub:
      "Marka kimliğiniz ve ürün kataloğunuz sinirsel sentez motorunu besler; insan onaylı gönderileri Instagram, Facebook ve SWOT analiz döngüsüne iletir.",
    inputNodeTitle: "Marka & Katalog Girdisi",
    inputNodeSub: "Ton, hedef kitle ve ürün medyası",
    coreNodeTitle: "Sinirsel Pazarlama Motoru",
    coreNodeSub: "Çoklu varyasyon sentezi ve onay kapısı",
    lane1Title: "Instagram Profesyonel",
    lane1Sub: "Kaydırmalı gönderiler ve etiketler",
    lane2Title: "Facebook Sayfası",
    lane2Sub: "Topluluk hikayeleri ve bağlantı çağrıları",
    lane3Title: "SWOT İstihbaratı",
    lane3Sub: "Erişim/gösterim analizi ve stratejik öneriler",
    momentHeading: "Her kampanya ham ürün notlarından doğrulanmış erişime ulaşır.",
    momentSub:
      "Tek bir ürün kaydının nasıl planlanmış bir kampanyaya ve kanıta dayalı SWOT önerisine dönüştüğünü incelemek için aşamalar arasında geçiş yapın.",
    stage1Tab: "1. Ürün & Marka DNA'sı",
    stage2Tab: "2. YZ Çoklu Varyasyonları",
    stage3Tab: "3. Yayınlandı & SWOT Doğrulandı",
    ctaClosingHeading: "Tüm sosyal medya pazarlama sürecinizi tek merkezden yönetin.",
    ctaClosingSub:
      "Marka sesinizle başlayın, ilk ürününüzü ekleyin ve iki dakikadan kısa sürede kampanyaya hazır üç sosyal medya varyasyonu üretin.",
  },
  ar: {
    navProduct: "المنصة",
    navPipeline: "المسار العصبي",
    navWorkflow: "الاستوديو الحي",
    openDashboard: "فتح مساحة العمل",
    signIn: "تسجيل الدخول",
    startFree: "ابدأ مجاناً",
    heroHeadline: [
      { text: "تسويق", accent: true },
      { text: " " },
      { text: "ذكي", accent: true },
      { text: " عبر وسائل التواصل الاجتماعي للشركات المستقلة." },
    ],
    heroSubhead:
      "حوّل كتالوج منتجاتك ونبرة علامتك التجارية إلى حملات معتمدة على إنستغرام الاحترافي وصفحات فيسبوك، وجدولة نشر تلقائية، وتقارير SWOT مبنية على البيانات في مساحة عمل واحدة.",
    tryStudioBtn: "تشغيل استوديو الذكاء الاصطناعي",
    exploreDashboardBtn: "استكشاف مركز القيادة",
    liveFrameTitle: "معاينة حية للاستوديو — اختر نشاطاً تجارياً لتجربة التوليد الفوري",
    approvePreviewBtn: "معتمد لجدولة النشر",
    diagramHeading: "مدخل واحد للعلامة التجارية يغذي ثلاثة مسارات تسويقية متوازية.",
    diagramSub:
      "تغذي هوية علامتك التجارية وكتالوج منتجاتك محرك التوليد العصبي، لإرسال المنشورات المعتمدة بشرياً إلى إنستغرام وفيسبوك وحلقة تحليلات SWOT.",
    inputNodeTitle: "مدخلات الهوية والمنتجات",
    inputNodeSub: "النبرة، الجمهور، وصور المنتجات",
    coreNodeTitle: "محرك التسويق العصبي",
    coreNodeSub: "توليد نسخ متعددة وبوابة الاعتماد البشري",
    lane1Title: "إنستغرام الاحترافي",
    lane1Sub: "منشورات تفاعلية ووسوم مستهدفة",
    lane2Title: "صفحة فيسبوك",
    lane2Sub: "قصص العلامة التجارية وروابط الشراء",
    lane3Title: "تقارير SWOT الذكية",
    lane3Sub: "تحليل الوصول والظهور والتوصيات",
    momentHeading: "كل حملة تنتقل من بيانات المنتج الأولية إلى وصول رقمي موثّق.",
    momentSub:
      "بدّل بين المراحل الثلاث أدناه لمعاينة كيف يتحول منتج واحد إلى حملة مجدولة وتوصية استراتيجية مدعومة بالأرقام.",
    stage1Tab: "1. بصمة المنتج والعلامة",
    stage2Tab: "2. مسودات الذكاء الاصطناعي",
    stage3Tab: "3. النشر وتقرير SWOT",
    ctaClosingHeading: "أدِر كامل منظومة التسويق الرقمي لشركتك من مكان واحد.",
    ctaClosingSub:
      "ابدأ بضبط نبرة علامتك التجارية، أضف منتجك الأول، وولّد ثلاث نسخ تسويقية جاهزة للنشر في أقل من دقيقتين.",
  },
} as const;

const BUSINESS_PRESETS = [
  {
    id: "lumiere",
    brand: "Lumiere Artisan Roasters",
    category: "Specialty Coffee & Bakery",
    tone: "LUXURY",
    productName: "Ethiopia Yirgacheffe G1 Washed",
    price: "$24.50",
    caption:
      "Morning light meets high-altitude floral clarity. Our washed Ethiopia Yirgacheffe G1 micro-lot reveals delicate notes of jasmine blossom, bergamot citrus, and white peach — roasted in small batches every Tuesday.",
    hashtags: ["#SpecialtyCoffee", "#YirgacheffeG1", "#ArtisanRoastery", "#SlowMorning"],
    cta: "Order fresh-roasted beans via link in bio",
    reach: "18,420",
    impressions: "42,910",
    engagement: "4.82%",
    swotEvidence: "+31% engagement rate on single-origin tasting carousels",
  },
  {
    id: "vela",
    brand: "Vela Botanical Lab",
    category: "Clean Clinical Skincare",
    tone: "EDUCATIONAL",
    productName: "Bakuchiol + Rosehip Barrier Serum",
    price: "$38.00",
    caption:
      "Retinol-grade cellular renewal without moisture barrier irritation. Formulated with 1.5% cold-pressed Bakuchiol and organic Andean rosehip oil to calm redness and restore overnight skin elasticity.",
    hashtags: ["#BarrierRepair", "#CleanClinical", "#BakuchiolSerum", "#SkinScience"],
    cta: "Explore clinical test results & shop online",
    reach: "24,180",
    impressions: "56,400",
    engagement: "5.40%",
    swotEvidence: "+42% saves on ingredient-breakdown educational posts",
  },
  {
    id: "kaya",
    brand: "Kaya Ceramic Studio",
    category: "Handcrafted Tableware",
    tone: "FRIENDLY",
    productName: "Raw Stoneware Pour-Over Set",
    price: "$64.00",
    caption:
      "Thrown by hand on our studio wheel and fired at 1,240°C with speckled iron-rich clay. Each pour-over dripper and carafe pair carries subtle glaze variations that make your daily coffee ritual one of a kind.",
    hashtags: ["#StudioCeramics", "#HandmadeTableware", "#SlowLiving", "#CraftDesign"],
    cta: "Reserve your numbered studio piece today",
    reach: "14,950",
    impressions: "31,200",
    engagement: "6.15%",
    swotEvidence: "+28% link clicks when showing kiln-opening process",
  },
];

export default function LandingPage() {
  const { locale, dir } = useI18n();
  const { isAuthenticated } = useAuth();
  const copy = LANDING_COPY[locale];
  const isRtl = dir === "rtl";
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

  const [heroTyped, setHeroTyped] = useState(false);
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [activeMomentStage, setActiveMomentStage] = useState<0 | 1 | 2>(1);
  const preset = BUSINESS_PRESETS[selectedPresetIdx];

  const handleSpotlightMove = useSpotlight();

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-white relative overflow-x-hidden">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 h-20 glass-panel border-b border-white/10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo priority className="w-10 h-10 shadow-glow-violet group-hover:scale-105 transition-transform" />
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">
                SMART MARKETING
              </span>
              <span className="text-[11px] text-txt-secondary hidden sm:block">
                AI Marketing Workspace
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-txt-secondary">
            <a href="#studio-frame" className="hover:text-white transition-colors">
              {copy.navProduct}
            </a>
            <a href="#neural-pipeline" className="hover:text-white transition-colors">
              {copy.navPipeline}
            </a>
            <a href="#dealt-moment" className="hover:text-white transition-colors">
              {copy.navWorkflow}
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <LanguageSwitcher />
            <Link href={isAuthenticated ? "/dashboard" : "/login"} className="hidden sm:block">
              <Button variant="secondary" size="sm">
                {isAuthenticated ? copy.openDashboard : copy.signIn}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<DirectionalArrow className="w-3.5 h-3.5" />}
              >
                {copy.openDashboard}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* SCREEN 1: HERO WITH LIVE INTERACTIVE APP-FRAME (taste-skill Rule 3 & 5: data-enter) */}
        <section
          id="studio-frame"
          data-enter=""
          className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-20 lg:pt-16 lg:pb-24"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Copy Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <TypewriterHeadline
                segments={copy.heroHeadline}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.08]"
                onDone={() => setHeroTyped(true)}
              />

              <p
                className={`text-sm sm:text-base text-accent-mint leading-relaxed transition-all duration-700 ${
                  heroTyped
                    ? "translate-y-0 opacity-100"
                    : "translate-y-3 opacity-0"
                }`}
              >
                {copy.heroSubhead}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/dashboard">
                  <Button
                    variant="primary"
                    size="lg"
                    rightIcon={<DirectionalArrow className="w-4 h-4" />}
                  >
                    {copy.exploreDashboardBtn}
                  </Button>
                </Link>
                <Link href="/content-studio">
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<Wand2 className="w-4 h-4 text-accent-cyan" />}
                  >
                    {copy.tryStudioBtn}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Live Interactive App-Frame (7 cols — Shows real product UI working on real data) */}
            <div className="lg:col-span-7">
              <div
                onMouseMove={handleSpotlightMove}
                className="rounded-[26px] glass-panel glass-spotlight p-5 sm:p-6 border border-white/15 shadow-2xl space-y-5"
              >
                {/* App Frame Top Bar + Preset Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-semantic-error/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-semantic-warning/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-semantic-success/70" />
                    <span className="text-xs font-medium text-txt-secondary ms-2">
                      {copy.liveFrameTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {BUSINESS_PRESETS.map((b, idx) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedPresetIdx(idx)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          selectedPresetIdx === idx
                            ? "bg-accent-violet text-navy-950 shadow-glow-violet"
                            : "bg-white/5 text-txt-secondary hover:text-white border border-white/10"
                        }`}
                      >
                        {b.brand.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inside App Frame: Two-column live AI synthesis preview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
                  {/* Left: Brand & Product Spec */}
                  <div className="md:col-span-5 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-e border-white/10 pb-4 md:pb-0 md:pe-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">
                          {preset.brand}
                        </span>
                        <Badge variant="mint" size="sm">
                          {preset.tone}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-txt-muted">
                        {preset.category}
                      </p>

                      <div className="pt-2 border-t border-white/10 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-txt-secondary flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-accent-cyan" />
                            <span>{preset.productName}</span>
                          </span>
                        </div>
                        <p className="text-lg font-bold text-white tabular-nums-metric">
                          {preset.price}
                        </p>
                      </div>
                    </div>

                    {/* Live Telemetry Readout */}
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-txt-muted">30d Reach</span>
                        <span className="font-bold text-white tabular-nums-metric">
                          {preset.reach}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-txt-muted">Impressions</span>
                        <span className="font-bold text-white tabular-nums-metric">
                          {preset.impressions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-txt-muted">Engagement Rate</span>
                        <span className="font-bold text-accent-mint tabular-nums-metric">
                          {preset.engagement}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Synthesized Post & SWOT Evidence */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-accent-violet" />
                        <Facebook className="w-4 h-4 text-accent-cyan" />
                        <span className="text-xs font-semibold text-white">
                          AI Variant #1 &bull; Multi-Channel Ready
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-mint">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {copy.approvePreviewBtn}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                      {preset.caption}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {preset.hashtags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <span className="text-accent-mint font-medium flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>{preset.swotEvidence}</span>
                      </span>
                      <Link
                        href="/content-studio"
                        className="text-accent-cyan font-semibold hover:underline shrink-0"
                      >
                        Edit in Studio &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SCREEN 2: PULSING NEURAL HUB & PARALLEL LANES DIAGRAM (taste-skill Rule 7) */}
        <section
          id="neural-pipeline"
          className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/10"
        >
          <div className="max-w-3xl space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              {copy.diagramHeading}
            </h2>
            <p className="text-sm sm:text-base text-txt-secondary leading-relaxed">
              {copy.diagramSub}
            </p>
          </div>

          <div
            onMouseMove={handleSpotlightMove}
            className="rounded-[26px] glass-panel glass-spotlight p-6 sm:p-10 border border-white/15"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
              {/* 1. Input Node (3 cols) */}
              <div className="lg:col-span-3 glass-card p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-violet/15 border border-accent-violet/30 flex items-center justify-center text-accent-violet">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {copy.inputNodeTitle}
                    </h3>
                    <p className="text-[11px] text-txt-muted">
                      {copy.inputNodeSub}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-txt-secondary tabular-nums-metric">
                  <span>EN / TR / AR</span>
                  <span className="text-accent-mint font-semibold">Synchronized</span>
                </div>
              </div>

              {/* Animated SVG Connector 1 -> Core */}
              <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                <svg className="w-full h-12 overflow-visible" viewBox="0 0 80 40" fill="none">
                  <path
                    d="M0 20 L80 20"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 20 L80 20"
                    stroke="var(--accent-violet)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="diagram-pulse-line"
                  />
                </svg>
              </div>

              {/* 2. Main Processor Hub (3 cols) */}
              <div className="lg:col-span-3 glass-card p-6 border-accent-violet/40 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent-violet to-accent-cyan flex items-center justify-center text-navy-950 shadow-glow-violet">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {copy.coreNodeTitle}
                    </h3>
                    <p className="text-[11px] text-txt-secondary">
                      {copy.coreNodeSub}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs tabular-nums-metric">
                  <span className="text-txt-muted">Human Approval Gate</span>
                  <Badge variant="mint" size="sm">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Animated SVG Branching Hub -> 3 Parallel Lanes */}
              <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                <svg className="w-full h-44 overflow-visible" viewBox="0 0 80 180" fill="none">
                  <path
                    d="M0 90 C35 90, 35 24, 80 24 M0 90 L80 90 M0 90 C35 90, 35 156, 80 156"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 90 C35 90, 35 24, 80 24"
                    stroke="var(--accent-violet)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="diagram-pulse-line"
                  />
                  <path
                    d="M0 90 L80 90"
                    stroke="var(--accent-cyan)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="diagram-pulse-line"
                  />
                  <path
                    d="M0 90 C35 90, 35 156, 80 156"
                    stroke="var(--accent-mint)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="diagram-pulse-line"
                  />
                </svg>
              </div>

              {/* 3. Three Parallel Lanes (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <Link
                  href="/integrations"
                  className="glass-card-interactive p-4 flex items-center justify-between gap-3 block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-violet/15 text-accent-violet flex items-center justify-center">
                      <Instagram className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {copy.lane1Title}
                      </h4>
                      <p className="text-[11px] text-txt-secondary">
                        {copy.lane1Sub}
                      </p>
                    </div>
                  </div>
                  <DirectionalArrow className="w-4 h-4 text-txt-muted" />
                </Link>

                <Link
                  href="/integrations"
                  className="glass-card-interactive p-4 flex items-center justify-between gap-3 block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {copy.lane2Title}
                      </h4>
                      <p className="text-[11px] text-txt-secondary">
                        {copy.lane2Sub}
                      </p>
                    </div>
                  </div>
                  <DirectionalArrow className="w-4 h-4 text-txt-muted" />
                </Link>

                <Link
                  href="/reports"
                  className="glass-card-interactive p-4 flex items-center justify-between gap-3 block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent-mint/15 text-accent-mint flex items-center justify-center">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {copy.lane3Title}
                      </h4>
                      <p className="text-[11px] text-txt-secondary">
                        {copy.lane3Sub}
                      </p>
                    </div>
                  </div>
                  <DirectionalArrow className="w-4 h-4 text-txt-muted" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SCREEN 3: DEALT INTERACTIVE MOMENT — WORKFLOW TRANSFORMATION */}
        <section
          id="dealt-moment"
          className="max-w-7xl mx-auto px-4 sm:px-8 py-20 border-t border-white/10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {copy.momentHeading}
              </h2>
              <p className="text-sm sm:text-base text-txt-secondary leading-relaxed">
                {copy.momentSub}
              </p>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-navy-900/90 border border-white/10 self-start">
              {[copy.stage1Tab, copy.stage2Tab, copy.stage3Tab].map(
                (label, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveMomentStage(idx as 0 | 1 | 2)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeMomentStage === idx
                        ? "bg-accent-violet text-navy-950 shadow-glow-violet"
                        : "text-txt-secondary hover:text-white"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="rounded-[26px] glass-panel p-6 sm:p-10 border border-white/15">
            {activeMomentStage === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                <div className="space-y-2 border-b md:border-b-0 md:border-e border-white/10 pb-4 md:pb-0 md:pe-6">
                  <span className="text-xs font-mono text-accent-cyan uppercase">
                    Brand Identity (/settings/brand)
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Lumiere Artisan Roasters
                  </h3>
                  <p className="text-xs text-txt-secondary leading-relaxed">
                    Communication Tone: <strong className="text-white">LUXURY</strong>.
                    Target Audience: Urban specialty coffee enthusiasts aged 24–45.
                  </p>
                </div>
                <div className="space-y-2 border-b md:border-b-0 md:border-e border-white/10 pb-4 md:pb-0 md:pe-6">
                  <span className="text-xs font-mono text-accent-violet uppercase">
                    Product Catalog (/products)
                  </span>
                  <h3 className="text-lg font-bold text-white tabular-nums-metric">
                    Ethiopia Yirgacheffe G1 &bull; $24.50
                  </h3>
                  <p className="text-xs text-txt-secondary leading-relaxed">
                    3 high-resolution product media assets ordered for carousel publishing with 10% seasonal launch offer.
                  </p>
                </div>
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-accent-mint uppercase">
                      Campaign Strategy (/campaigns)
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Winter Solstice Micro-Lot Drop
                    </h3>
                  </div>
                  <Link href="/products">
                    <Button variant="secondary" size="sm" rightIcon={<DirectionalArrow className="w-3.5 h-3.5" />}>
                      Inspect Product Catalog
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {activeMomentStage === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                {[1, 2, 3].map((vNum) => (
                  <div
                    key={vNum}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      vNum === 1
                        ? "bg-accent-violet/10 border-accent-violet/40"
                        : "bg-white/[0.03] border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        AI Variation #{vNum}
                      </span>
                      <Badge variant={vNum === 1 ? "mint" : "outline"} size="sm">
                        {vNum === 1 ? "Selected for Review" : "Alternative"}
                      </Badge>
                    </div>
                    <p className="text-xs text-txt-secondary leading-relaxed">
                      {vNum === 1
                        ? preset.caption
                        : vNum === 2
                        ? "From 2,100 meters in southern Ethiopia to your morning pour-over. Discover jasmine, bergamot, and white peach in our newest washed micro-lot."
                        : "Small-batch roasted every Tuesday in Istanbul. Taste the floral clarity of 100% traceable Ethiopia Yirgacheffe G1 Arabica beans."}
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-accent-cyan">
                      <span>Readiness Check: 4/4 Passed</span>
                      <Link href="/posts" className="hover:underline font-semibold">
                        Approve &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeMomentStage === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                <div className="space-y-2 border-b md:border-b-0 md:border-e border-white/10 pb-4 md:pb-0 md:pe-6">
                  <span className="text-xs font-mono text-accent-cyan uppercase">
                    Publishing Calendar (/calendar)
                  </span>
                  <h3 className="text-lg font-bold text-white tabular-nums-metric">
                    Scheduled &bull; 10:00 AM TRT
                  </h3>
                  <p className="text-xs text-txt-secondary leading-relaxed">
                    Dispatched to Instagram Professional (@lumiere.roasters) and Facebook Page with automatic retry protection.
                  </p>
                </div>
                <div className="space-y-2 border-b md:border-b-0 md:border-e border-white/10 pb-4 md:pb-0 md:pe-6">
                  <span className="text-xs font-mono text-accent-mint uppercase">
                    Performance Analytics (/analytics)
                  </span>
                  <h3 className="text-lg font-bold text-white tabular-nums-metric">
                    18,420 Reach &bull; 42,910 Impressions
                  </h3>
                  <p className="text-xs text-txt-secondary leading-relaxed">
                    4.82% engagement rate (+31% above specialty coffee benchmark) and 1,284 direct shop link clicks.
                  </p>
                </div>
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono text-accent-violet uppercase">
                      SWOT Intelligence (/reports)
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      Evidence-Backed Action Plan
                    </h3>
                  </div>
                  <Link href="/reports">
                    <Button variant="primary" size="sm" rightIcon={<DirectionalArrow className="w-3.5 h-3.5" />}>
                      Open SWOT Report
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CLOSING CTA SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="rounded-[26px] glass-panel p-8 sm:p-12 border border-white/15 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {copy.ctaClosingHeading}
              </h2>
              <p className="text-sm sm:text-base text-txt-secondary leading-relaxed">
                {copy.ctaClosingSub}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/dashboard">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<DirectionalArrow className="w-4 h-4" />}
                >
                  {copy.openDashboard}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="secondary" size="lg">
                  {copy.startFree}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-8 px-4 sm:px-8 text-xs text-txt-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            SMART MARKETING PLATFORM &copy; 2026 &bull; AI Social Media Marketing Workspace
          </p>
          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Marketing Command
            </Link>
            <Link href="/content-studio" className="hover:text-white transition-colors">
              AI Studio
            </Link>
            <Link href="/analytics" className="hover:text-white transition-colors">
              Analytics
            </Link>
            <Link href="/reports" className="hover:text-white transition-colors">
              SWOT Reports
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
