"use client";

import Link from "next/link";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";
import { useSpotlight } from "@/lib/hooks/use-spotlight";
import { aiApi } from "@/lib/api/ai.api";
import { campaignsApi } from "@/lib/api/campaigns.api";
import { productsApi } from "@/lib/api/products.api";
import { postsApi } from "@/lib/api/posts.api";
import {
  Campaign,
  CommunicationTone,
  ContentLanguage,
  GeneratedAiVariant,
  Product,
  SocialPlatform,
  ApiErrorShape,
} from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import {
  Sparkles,
  Instagram,
  Facebook,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Send,
  Edit3,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  RefreshCw,
  Sliders,
  Flame,
  Smartphone,
  Layers,
  Maximize2,
  Check,
  Wifi,
  BatteryCharging,
  Package,
  ChevronDown,
} from "lucide-react";

type DevicePreviewFormat = "FEED" | "STORY" | "CAROUSEL";

export default function ContentStudioPage() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Context lists
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [, setIsLoadingContext] = useState(true);

  // Form selections
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialPlatform>("INSTAGRAM");
  const [selectedLanguage, setSelectedLanguage] = useState<ContentLanguage>("en");
  const [selectedTone, setSelectedTone] =
    useState<CommunicationTone>("LUXURY");
  const [customPrompt, setCustomPrompt] = useState("");
  const [productSectionOpen, setProductSectionOpen] = useState(false);

  // Generation status (WEB-02-05: honest job states: idle, queued, processing, completed, failed)
  const [generationState, setGenerationState] = useState<
    "IDLE" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED"
  >("IDLE");
  const [synthesisStep, setSynthesisStep] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [variants, setVariants] = useState<GeneratedAiVariant[]>([]);
  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Interactive Smartphone Preview Controls
  const [previewFormat, setPreviewFormat] =
    useState<DevicePreviewFormat>("FEED");
  const [carouselSlide, setCarouselSlide] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Spotlight cursor tracker
  const handleSpotlightMove = useSpotlight();

  // Load campaigns and products on mount
  useEffect(() => {
    async function loadData() {
      setIsLoadingContext(true);
      try {
        const [cRes, pRes] = await Promise.all([
          campaignsApi.getCampaigns(),
          productsApi.getProducts(),
        ]);
        setCampaigns(cRes.data);
        setProducts(pRes.data);

        // Pre-select campaign from URL query parameter if present
        const queryCampId = searchParams.get("campaignId");
        if (queryCampId && cRes.data.some((c) => c.id === queryCampId)) {
          setSelectedCampaignId(queryCampId);
        } else if (cRes.data.length > 0) {
          setSelectedCampaignId(cRes.data[0].id);
        }

        if (pRes.data.length > 0) {
          setSelectedProductId(pRes.data[0].id);
        }
      } catch (err) {
        console.error("Failed to load studio context", err);
      } finally {
        setIsLoadingContext(false);
      }
    }
    loadData();
  }, [searchParams]);

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId);
  const activeProduct = products.find((p) => p.id === selectedProductId);
  const currentVariant = variants[activeVariantIndex] || variants[0];

  // Start AI Generation Job with Authored Multi-Stage Telemetry
  const handleGenerate = async () => {
    setErrorMessage(null);
    setSuccessBanner(null);
    setSynthesisStep(1);
    setGenerationState("QUEUED");

    const stepTimer1 = setTimeout(() => {
      setGenerationState("PROCESSING");
      setSynthesisStep(2);
    }, 180);

    const stepTimer2 = setTimeout(() => {
      setSynthesisStep(3);
    }, 340);

    try {
      const res = await aiApi.generateVariants({
        campaignId: selectedCampaignId,
        productId: selectedProductId,
        platform: selectedPlatform,
        contentLanguage: selectedLanguage,
        tone: selectedTone,
        customPrompt: customPrompt.trim(),
        simulateFailure: false,
      });

      setVariants(res.data);
      setActiveVariantIndex(0);
      setCarouselSlide(0);
      setGenerationState("COMPLETED");
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setErrorMessage(
        apiErr.message ||
          "AI content generation failed. Please check rate limits or retry."
      );
      setGenerationState("FAILED");
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
    }
  };

  // Send Variant to Post Editor or Review
  const handleCreatePost = async (status: "DRAFT" | "PENDING_REVIEW") => {
    if (!currentVariant || !activeCampaign) return;
    setIsSubmittingPost(true);
    setSuccessBanner(null);

    try {
      await postsApi.createPost({
        campaignId: activeCampaign.id,
        productId: activeProduct?.id,
        platform: selectedPlatform,
        title: currentVariant.title,
        caption: currentVariant.caption,
        hashtags: currentVariant.hashtags,
        callToAction: currentVariant.callToAction,
        visualIdea: currentVariant.visualIdea,
        mediaUrl: activeProduct?.media[0]?.url,
        source: "AI_GENERATED",
        status,
      });

      setSuccessBanner(
        status === "PENDING_REVIEW"
          ? "Generated variant submitted to Review & Approval Desk."
          : "Saved into Posts Workspace as a draft."
      );

      setTimeout(() => {
        router.push("/posts");
      }, 1200);
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setErrorMessage(apiErr.message || "Failed to create post from variant.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.studio.title}
          </h1>
          <p className="text-sm text-txt-secondary mt-1">{t.studio.subtitle}</p>
        </div>

        <Link href="/posts">
          <Button
            variant="secondary"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Go to Posts & Approval Desk
          </Button>
        </Link>
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="p-4 rounded-2xl bg-semantic-success/15 border border-semantic-success/40 text-semantic-success text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Split Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: AI Configuration Panel (5 cols on Desktop) */}
        <Card
          onMouseMove={handleSpotlightMove}
          className="lg:col-span-5 glass-panel glass-spotlight border-white/15 shadow-2xl p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-accent-cyan" />
              <span>Studio Generator Controls</span>
            </h2>
            <Badge variant="cyan" size="sm">
              Neural Assistant
            </Badge>
          </div>

          {/* The idea comes first: describe the ad in your own words */}
          <Textarea
            label={t.studio.customPromptLabel}
            placeholder="e.g. Announce a weekend offer: what is it, who is it for, and what should people do?"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
          />

          {/* Campaign Context Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-txt-secondary">
              {t.studio.campaignContext}
            </label>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
            >
              {campaigns.map((camp) => (
                <option key={camp.id} value={camp.id}>
                  {camp.name} ({camp.objective})
                </option>
              ))}
            </select>
          </div>

          {/* Optional Product Context: collapsed by default, the ad works without it */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03]">
            <button
              type="button"
              onClick={() => setProductSectionOpen((open) => !open)}
              aria-expanded={productSectionOpen}
              className="w-full flex items-center gap-2 px-3.5 py-3 text-start"
            >
              <Package className="w-4 h-4 text-accent-cyan shrink-0" />
              <span className="text-xs font-medium text-txt-secondary">
                {t.studio.productContext}
              </span>
              <Badge variant="cyan" size="sm">
                {t.studio.productOptionalBadge}
              </Badge>
              {activeProduct && !productSectionOpen && (
                <span className="text-[11px] text-accent-mint truncate">
                  {activeProduct.name}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 text-txt-muted ms-auto shrink-0 transition-transform ${
                  productSectionOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {productSectionOpen && (
              <div className="px-3.5 pb-3.5 space-y-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
                >
                  <option value="">{t.studio.noProductOption}</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} (${prod.price.toFixed(2)})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] leading-relaxed text-txt-muted">
                  {t.studio.productOptionalHint}
                </p>
              </div>
            )}
          </div>

          {/* Platform Selector (Instagram & Facebook MVP) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-txt-secondary">
              {t.studio.platformSelect}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedPlatform("INSTAGRAM")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  selectedPlatform === "INSTAGRAM"
                    ? "bg-pink-500/20 border-pink-500 text-white shadow-glow-violet"
                    : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                }`}
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform("FACEBOOK")}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  selectedPlatform === "FACEBOOK"
                    ? "bg-blue-500/20 border-blue-500 text-white shadow-glow-cyan"
                    : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                }`}
              >
                <Facebook className="w-4 h-4 text-blue-400" />
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Tone & Language Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                {t.studio.toneSelect}
              </label>
              <select
                value={selectedTone}
                onChange={(e) =>
                  setSelectedTone(e.target.value as CommunicationTone)
                }
                className="glass-input w-full h-10 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="LUXURY">LUXURY</option>
                <option value="PROFESSIONAL">PROFESSIONAL</option>
                <option value="FRIENDLY">FRIENDLY</option>
                <option value="BOLD">BOLD</option>
                <option value="EDUCATIONAL">EDUCATIONAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                {t.studio.languageSelect}
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) =>
                  setSelectedLanguage(e.target.value as ContentLanguage)
                }
                className="glass-input w-full h-10 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="en">English (en)</option>
                <option value="tr">Türkçe (tr)</option>
                <option value="ar">العربية (ar)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="primary"
            className="w-full h-12 text-sm shadow-glow-violet"
            isLoading={
              generationState === "QUEUED" || generationState === "PROCESSING"
            }
            onClick={handleGenerate}
            leftIcon={<Sparkles className="w-4 h-4 text-accent-cyan" />}
          >
            {generationState === "QUEUED" || generationState === "PROCESSING"
              ? t.studio.generatingBtn
              : t.studio.generateBtn}
          </Button>
        </Card>

        {/* Right Column: Live Output & Interactive Device Frame (7 cols on Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Asynchronous State Feedback: Idle */}
          {generationState === "IDLE" && (
            <Card
              onMouseMove={handleSpotlightMove}
              className="glass-spotlight text-center p-10 sm:p-14 space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent-violet/15 text-accent-violet border border-accent-violet/30 flex items-center justify-center mx-auto shadow-glow-violet">
                <Sparkles className="w-8 h-8 text-accent-cyan" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {t.studio.idleStateTitle}
                </h3>
                <p className="text-xs sm:text-sm text-txt-secondary max-w-md mx-auto leading-relaxed">
                  {t.studio.idleStateDesc}
                </p>
              </div>

              {/* Neural Readiness Vector Preview */}
              <div className="max-w-md mx-auto pt-2">
                <svg
                  viewBox="0 0 400 44"
                  className="w-full h-11 overflow-visible"
                  aria-hidden="true"
                >
                  <path
                    d="M 20 22 L 380 22"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="2"
                  />
                  <path
                    d="M 20 22 L 380 22"
                    fill="none"
                    stroke="rgb(var(--accent-violet-rgb))"
                    strokeWidth="2"
                    className="diagram-pulse-line"
                  />
                  <circle
                    cx="60"
                    cy="22"
                    r="5"
                    fill="rgb(var(--accent-violet-rgb))"
                  />
                  <circle
                    cx="200"
                    cy="22"
                    r="5"
                    fill="rgb(var(--accent-cyan-rgb))"
                  />
                  <circle
                    cx="340"
                    cy="22"
                    r="5"
                    fill="rgb(var(--accent-mint-rgb))"
                  />
                </svg>
                <div className="flex items-center justify-between text-[11px] font-mono text-txt-muted px-4">
                  <span>Brand DNA ({selectedTone})</span>
                  <span>Product USP</span>
                  <span>{selectedPlatform} Ready</span>
                </div>
              </div>
            </Card>
          )}

          {/* Asynchronous State Feedback: Queued / Processing (Authored Focal Synthesis Moment) */}
          {(generationState === "QUEUED" || generationState === "PROCESSING") && (
            <Card className="p-8 space-y-6 border-accent-violet/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent-violet via-accent-indigo to-accent-cyan p-[1px] shadow-glow-violet animate-spin flex items-center justify-center">
                    <div className="w-full h-full rounded-2xl bg-navy-950 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-accent-cyan" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {generationState === "QUEUED"
                        ? t.studio.queuedState
                        : t.studio.processingState}
                    </h3>
                    <p className="text-xs text-txt-secondary">
                      Synthesizing copy aligned with brand voice ({selectedTone})
                      for {selectedPlatform}...
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-accent-cyan tabular-nums-metric">
                  {synthesisStep === 1
                    ? "32%"
                    : synthesisStep === 2
                    ? "68%"
                    : "94%"}
                </span>
              </div>

              {/* 3-Step Neural Telemetry Stages */}
              <div className="space-y-2.5 pt-2">
                {[
                  {
                    step: 1,
                    label: `Aligning Brand Voice (${selectedTone}) & Target Audience`,
                  },
                  {
                    step: 2,
                    label: `Extracting Product Highlights (${
                      activeProduct?.name || "Catalog Item"
                    })`,
                  },
                  {
                    step: 3,
                    label: `Generating 3 ${selectedPlatform} Variants (${selectedLanguage.toUpperCase()})`,
                  },
                ].map((item) => {
                  const isDone = synthesisStep > item.step;
                  const isCurrent = synthesisStep === item.step;
                  return (
                    <div
                      key={item.step}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isCurrent
                          ? "bg-accent-violet/15 border-accent-violet/40 text-white"
                          : isDone
                          ? "bg-semantic-success/10 border-semantic-success/30 text-semantic-success"
                          : "bg-white/[0.02] border-white/10 text-txt-muted"
                      }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      {isDone ? (
                        <Check className="w-4 h-4 text-semantic-success" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping" />
                      ) : null}
                    </div>
                  );
                })}
              </div>

              {/* Progress shimmer bar */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan animate-pulse w-4/5 rounded-full" />
              </div>
            </Card>
          )}

          {/* Asynchronous State Feedback: Failed (with Retry) */}
          {generationState === "FAILED" && (
            <Card className="p-8 text-center space-y-4 border-semantic-error/40 bg-semantic-error/5">
              <div className="w-12 h-12 rounded-2xl bg-semantic-error/20 text-semantic-error border border-semantic-error/30 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                {t.studio.generationFailedTitle}
              </h3>
              <p className="text-xs text-semantic-error max-w-md mx-auto">
                {errorMessage}
              </p>
              <div className="pt-2 flex justify-center">
                <Button
                  variant="primary"
                  onClick={handleGenerate}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  {t.studio.retryGenerationBtn}
                </Button>
              </div>
            </Card>
          )}

          {/* Generated Variations View (WEB-02-05) */}
          {generationState === "COMPLETED" && variants.length > 0 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Variants Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-accent-cyan" />
                  <span>{t.studio.variantsTitle} (3 Generated)</span>
                </h3>

                <div className="flex items-center gap-1.5">
                  {variants.map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveVariantIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeVariantIndex === idx
                          ? "bg-accent-violet text-white shadow-glow-violet"
                          : "bg-white/5 text-txt-secondary hover:text-white"
                      }`}
                    >
                      Variant #{idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Platform & Smartphone Device Preview Container */}
              <Card
                onMouseMove={handleSpotlightMove}
                className="glass-spotlight p-5 space-y-5"
              >
                {/* Top Toolbar: Platform Info + Format Mode Switcher (Feed / Story 9:16 / Carousel) */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    {selectedPlatform === "INSTAGRAM" ? (
                      <Instagram className="w-4 h-4 text-pink-400" />
                    ) : (
                      <Facebook className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-xs font-bold text-white">
                      {selectedPlatform === "INSTAGRAM"
                        ? t.studio.previewInstagram
                        : t.studio.previewFacebook}
                    </span>
                    <Badge variant="mint" size="sm">
                      {t.studio.variantSelectedBadge} #{activeVariantIndex + 1}
                    </Badge>
                  </div>

                  {/* Format Switcher */}
                  <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-navy-950/90 border border-white/10">
                    {(
                      [
                        { id: "FEED", label: "Feed Post", icon: Smartphone },
                        { id: "STORY", label: "Story 9:16", icon: Maximize2 },
                        { id: "CAROUSEL", label: "Carousel", icon: Layers },
                      ] as const
                    ).map((fmt) => {
                      const Icon = fmt.icon;
                      const active = previewFormat === fmt.id;
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => setPreviewFormat(fmt.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                            active
                              ? "bg-accent-violet/20 text-white border border-accent-violet/40"
                              : "text-txt-muted hover:text-white"
                          }`}
                        >
                          <Icon className="w-3 h-3 text-accent-cyan" />
                          <span>{fmt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Realistic Smartphone Mockup Bezel */}
                <div className="max-w-[380px] mx-auto rounded-[32px] p-3 bg-navy-950 border-2 border-white/15 shadow-2xl space-y-3">
                  {/* Smartphone Status Bar & Dynamic Island */}
                  <div className="flex items-center justify-between px-3 pt-1 text-[10px] font-mono text-txt-secondary">
                    <span className="font-semibold text-white">9:41</span>
                    <div className="w-20 h-3.5 rounded-full bg-black/80 border border-white/10" />
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3 h-3 text-white" />
                      <BatteryCharging className="w-3.5 h-3.5 text-semantic-success" />
                    </div>
                  </div>

                  {/* Account Header inside Phone */}
                  <div className="flex items-center justify-between px-2 pt-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-violet to-accent-cyan flex items-center justify-center text-xs font-bold text-white shadow-glow-violet">
                        L
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">
                          lumiere.roasters
                        </p>
                        <p className="text-[10px] text-txt-muted">
                          Istanbul &bull; {selectedTone} &bull; {previewFormat}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-txt-muted">&bull;&bull;&bull;</span>
                  </div>

                  {/* Media Visual Preview Stage */}
                  <div
                    className={`rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 border border-white/10 flex flex-col justify-between p-4 text-xs text-txt-secondary relative overflow-hidden transition-all duration-300 ${
                      previewFormat === "STORY" ? "h-80" : "h-60"
                    }`}
                  >
                    {/* Ambient radial light */}
                    <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-accent-violet/20 blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-accent-cyan/15 blur-2xl pointer-events-none" />

                    {/* Top Badge Row inside Artwork */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-navy-950/80 border border-white/15 text-[10px] font-semibold text-white">
                        {activeProduct?.category || "Featured Release"}
                      </span>
                      {activeProduct && (
                        <span className="px-2.5 py-1 rounded-full bg-accent-violet/25 border border-accent-violet/40 text-[10px] font-mono font-bold text-accent-cyan tabular-nums-metric">
                          ${activeProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Center Visual Art Copy */}
                    <div className="relative z-10 my-auto text-center space-y-2 px-2">
                      <p className="text-sm font-bold text-white tracking-tight">
                        {activeProduct?.name || "Product Media Showcase"}
                      </p>
                      <p className="text-[11px] text-accent-cyan/95 max-w-xs mx-auto italic leading-relaxed line-clamp-3">
                        &ldquo;{currentVariant.visualIdea}&rdquo;
                      </p>
                    </div>

                    {/* Bottom Overlay inside Artwork (Story CTA or Carousel Dots) */}
                    <div className="relative z-10 flex items-center justify-between pt-2">
                      {previewFormat === "CAROUSEL" ? (
                        <div className="flex items-center gap-1.5 mx-auto">
                          {[0, 1, 2].map((slideIdx) => (
                            <button
                              key={slideIdx}
                              type="button"
                              onClick={() => setCarouselSlide(slideIdx)}
                              aria-label={`Slide ${slideIdx + 1}`}
                              className={`h-1.5 rounded-full transition-all ${
                                carouselSlide === slideIdx
                                  ? "w-5 bg-accent-cyan"
                                  : "w-1.5 bg-white/30"
                              }`}
                            />
                          ))}
                        </div>
                      ) : previewFormat === "STORY" ? (
                        <div className="w-full py-2 px-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center text-[11px] font-semibold text-white">
                          {currentVariant.callToAction}
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-txt-muted">
                          AI Art Direction &bull; 1080&times;1350
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Interactive Social Action Bar (Heart, Comment, Share, Save) */}
                  <div className="flex items-center justify-between text-txt-secondary px-2 pt-1">
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={() => setIsLiked((prev) => !prev)}
                        className="flex items-center gap-1 text-xs hover:text-pink-400 transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isLiked ? "fill-pink-500 text-pink-500" : ""
                          }`}
                        />
                        <span className="font-mono text-[11px] tabular-nums-metric">
                          {isLiked ? "1,285" : "1,284"}
                        </span>
                      </button>
                      <MessageCircle className="w-4 h-4 hover:text-white cursor-pointer" />
                      <Share2 className="w-4 h-4 hover:text-white cursor-pointer" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSaved((prev) => !prev)}
                      aria-label="Save post preview"
                      className="hover:text-white transition-colors"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          isSaved
                            ? "fill-accent-cyan text-accent-cyan"
                            : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Caption & Hashtags & CTA */}
                  <div className="space-y-2 text-xs px-2 pb-1">
                    <p className="text-white leading-relaxed whitespace-pre-line">
                      <strong className="me-1.5">lumiere.roasters</strong>
                      {currentVariant.caption}
                    </p>

                    <p className="text-accent-cyan font-mono text-[11px]">
                      {currentVariant.hashtags.join(" ")}
                    </p>

                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-accent-mint font-medium flex items-center gap-1.5">
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      <span>{currentVariant.callToAction}</span>
                    </div>
                  </div>

                  {/* Recommended Publishing Time */}
                  <div className="px-2 pt-2 pb-1 border-t border-white/10 flex items-center justify-between text-[11px] text-txt-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent-violet shrink-0" />
                      <span>{currentVariant.recommendedPublishingTime}</span>
                    </span>
                    <span className="font-mono text-[10px] text-accent-cyan">
                      98% Brand Fit
                    </span>
                  </div>
                </div>

                {/* Workflow Actions: Send to Editor or Review */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    isLoading={isSubmittingPost}
                    onClick={() => handleCreatePost("DRAFT")}
                    leftIcon={<Edit3 className="w-4 h-4" />}
                  >
                    {t.studio.sendToEditorBtn}
                  </Button>

                  <Button
                    variant="primary"
                    className="w-full sm:w-auto"
                    isLoading={isSubmittingPost}
                    onClick={() => handleCreatePost("PENDING_REVIEW")}
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    {t.studio.sendToApprovalBtn}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
