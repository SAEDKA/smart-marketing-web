"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { campaignsApi } from "@/lib/api/campaigns.api";
import { productsApi } from "@/lib/api/products.api";
import {
  Campaign,
  CampaignObjective,
  CampaignStatus,
  CommunicationTone,
  ContentLanguage,
  CreateCampaignRequest,
  Product,
  SocialPlatform,
  ApiErrorShape,
} from "@/types/domain";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Megaphone,
  Plus,
  Search,
  Target,
  Calendar,
  Share2,
  Instagram,
  Facebook,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Check,
  PauseCircle,
  PlayCircle,
  ShoppingBag,
  ExternalLink,
  Layers,
  X,
  RefreshCw,
  Lock,
} from "lucide-react";

export default function CampaignsPage() {
  const { t, dir } = useI18n();

  // Data & loading
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");
  const [objectiveFilter, setObjectiveFilter] = useState<CampaignObjective | "ALL">("ALL");
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | "ALL">("ALL");

  // Modal Dialog states
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Wizard Multi-step State (WEB-02-03)
  const [wizardStep, setWizardStep] = useState(1);
  const [isSubmittingWizard, setIsSubmittingWizard] = useState(false);
  const [wizardErrors, setWizardErrors] = useState<Record<string, string>>({});

  // Wizard Form Fields
  const [name, setName] = useState("");
  const [objective, setObjective] = useState<CampaignObjective>("INCREASE_SALES");
  const [targetAudience, setTargetAudience] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    "INSTAGRAM",
    "FACEBOOK",
  ]);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0]
  );
  const [contentLanguage, setContentLanguage] = useState<ContentLanguage>("en");
  const [communicationTone, setCommunicationTone] = useState<CommunicationTone>("LUXURY");
  const [publishingFrequency, setPublishingFrequency] = useState("3 posts/week");
  const [budgetNotes, setBudgetNotes] = useState("");

  // Load Campaigns and Products
  const loadData = async () => {
    setIsLoading(true);
    setStatusMessage(null);
    try {
      const [campRes, prodRes] = await Promise.all([
        campaignsApi.getCampaigns({
          search: searchQuery,
          status: statusFilter,
          objective: objectiveFilter,
          platform: platformFilter,
        }),
        productsApi.getProducts(),
      ]);
      setCampaigns(campRes.data);
      setAvailableProducts(prodRes.data);
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMessage({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, statusFilter, objectiveFilter, platformFilter]);

  // Open Create Wizard
  const handleOpenCreateWizard = () => {
    setSelectedCampaign(null);
    setWizardStep(1);
    setName("");
    setObjective("INCREASE_ENGAGEMENT");
    setTargetAudience(
      "Specialty coffee connoisseurs and mindful urban consumers aged 24–45."
    );
    setSelectedProductIds(
      availableProducts.length > 0 ? [availableProducts[0].id] : []
    );
    setSelectedPlatforms(["INSTAGRAM", "FACEBOOK"]);
    setStartDate(new Date().toISOString().split("T")[0]);
    setEndDate(new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0]);
    setContentLanguage("en");
    setCommunicationTone("LUXURY");
    setPublishingFrequency("3 posts/week");
    setBudgetNotes("");
    setWizardErrors({});
    setIsWizardOpen(true);
  };

  // Open Edit Wizard
  const handleOpenEditWizard = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setWizardStep(1);
    setName(campaign.name);
    setObjective(campaign.objective);
    setTargetAudience(campaign.targetAudience);
    setSelectedProductIds(campaign.productIds);
    setSelectedPlatforms(campaign.platforms);
    setStartDate(campaign.startDate);
    setEndDate(campaign.endDate);
    setContentLanguage(campaign.contentLanguage);
    setCommunicationTone(campaign.communicationTone);
    setPublishingFrequency(campaign.publishingFrequency);
    setBudgetNotes(campaign.budgetNotes || "");
    setWizardErrors({});
    setIsWizardOpen(true);
  };

  // Open Campaign Details Inspector
  const handleOpenDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsOpen(true);
  };

  // Wizard Step Validation
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!name.trim()) errs.name = t.validation.fullNameRequired;
      if (!targetAudience.trim()) errs.targetAudience = t.validation.targetAudienceRequired;
    } else if (step === 2) {
      if (selectedProductIds.length === 0)
        errs.productIds = t.campaigns.productRequiredErr;
      if (selectedPlatforms.length === 0)
        errs.platforms = t.campaigns.platformRequiredErr;
    } else if (step === 3) {
      if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
        errs.endDate = t.campaigns.dateValidationErr;
      }
    }

    setWizardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(wizardStep)) {
      setWizardStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setWizardErrors({});
    setWizardStep((prev) => Math.max(prev - 1, 1));
  };

  // Submit Wizard (Draft or Active)
  const handleSaveCampaign = async (finalStatus: CampaignStatus = "ACTIVE") => {
    if (!validateStep(3)) return;

    setIsSubmittingWizard(true);
    try {
      const payload: CreateCampaignRequest = {
        name: name.trim(),
        objective,
        productIds: selectedProductIds,
        targetAudience: targetAudience.trim(),
        platforms: selectedPlatforms,
        startDate,
        endDate,
        contentLanguage,
        communicationTone,
        publishingFrequency,
        budgetNotes,
        status: finalStatus,
      };

      if (selectedCampaign) {
        const res = await campaignsApi.updateCampaign(selectedCampaign.id, payload);
        setCampaigns((prev) =>
          prev.map((c) => (c.id === selectedCampaign.id ? res.data : c))
        );
      } else {
        const res = await campaignsApi.createCampaign(payload);
        setCampaigns((prev) => [res.data, ...prev]);
      }

      setIsWizardOpen(false);
      setStatusMessage({
        type: "success",
        text: t.campaigns.campaignSaved,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setWizardErrors({ api: apiErr.message || t.common.errorOccurred });
    } finally {
      setIsSubmittingWizard(false);
    }
  };

  // Quick Status Toggle (Pause / Resume)
  const handleToggleStatus = async (campaign: Campaign) => {
    const nextStatus: CampaignStatus =
      campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      const res = await campaignsApi.updateStatus(campaign.id, nextStatus);
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaign.id ? res.data : c))
      );
      if (selectedCampaign?.id === campaign.id) setSelectedCampaign(res.data);
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMessage({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    }
  };

  // Delete Campaign
  const handleConfirmDelete = async () => {
    if (!selectedCampaign) return;
    try {
      await campaignsApi.deleteCampaign(selectedCampaign.id);
      setCampaigns((prev) => prev.filter((c) => c.id !== selectedCampaign.id));
      setIsDeleteModalOpen(false);
      setIsDetailsOpen(false);
      setStatusMessage({
        type: "success",
        text: t.campaigns.campaignDeleted,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMessage({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    }
  };

  // Helper to toggle platform
  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  // Helper to toggle product
  const toggleProduct = (prodId: string) => {
    if (selectedProductIds.includes(prodId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== prodId));
    } else {
      setSelectedProductIds([...selectedProductIds, prodId]);
    }
  };

  const getObjectiveLabel = (obj: CampaignObjective) => {
    if (obj === "INCREASE_SALES") return t.campaigns.filterSales;
    if (obj === "INCREASE_ENGAGEMENT") return t.campaigns.filterEngagement;
    return t.campaigns.filterAwareness;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.campaigns.title}
          </h1>
          <p className="text-sm text-txt-secondary mt-1">{t.campaigns.subtitle}</p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            title="Refresh from API"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>

          <Button
            variant="primary"
            onClick={handleOpenCreateWizard}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {t.campaigns.createCampaign}
          </Button>
        </div>
      </div>

      {/* Global Status Banner */}
      {statusMessage && (
        <div
          role="alert"
          className={`p-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-3 animate-in fade-in ${
            statusMessage.type === "success"
              ? "bg-semantic-success/15 border border-semantic-success/40 text-semantic-success"
              : "bg-semantic-error/15 border border-semantic-error/40 text-semantic-error"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="ms-auto p-1 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters Card */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="w-full lg:w-80">
            <Input
              placeholder={t.campaigns.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftElement={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Status Filter */}
            <div className="w-36">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as CampaignStatus | "ALL")
                }
                className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="ALL">{t.campaigns.filterAllStatus}</option>
                <option value="ACTIVE">{t.campaigns.filterActive}</option>
                <option value="DRAFT">{t.campaigns.filterDraft}</option>
                <option value="PAUSED">{t.campaigns.filterPaused}</option>
                <option value="COMPLETED">{t.campaigns.filterCompleted}</option>
              </select>
            </div>

            {/* Objective Filter */}
            <div className="w-44">
              <select
                value={objectiveFilter}
                onChange={(e) =>
                  setObjectiveFilter(e.target.value as CampaignObjective | "ALL")
                }
                className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="ALL">{t.campaigns.filterAllObjectives}</option>
                <option value="INCREASE_SALES">{t.campaigns.filterSales}</option>
                <option value="INCREASE_ENGAGEMENT">
                  {t.campaigns.filterEngagement}
                </option>
                <option value="INCREASE_AWARENESS">
                  {t.campaigns.filterAwareness}
                </option>
              </select>
            </div>

            {/* Platform Filter */}
            <div className="w-36">
              <select
                value={platformFilter}
                onChange={(e) =>
                  setPlatformFilter(e.target.value as SocialPlatform | "ALL")
                }
                className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
              >
                <option value="ALL">All Platforms</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="FACEBOOK">Facebook</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-14 w-full" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-24" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && campaigns.length === 0 && (
        <Card className="text-center p-10 sm:p-14 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 text-txt-muted flex items-center justify-center mx-auto">
            <Megaphone className="w-8 h-8 opacity-40" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            {t.campaigns.noCampaignsFound}
          </h3>
          <p className="text-xs sm:text-sm text-txt-secondary max-w-md mx-auto leading-relaxed">
            {t.campaigns.emptyStateDesc}
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreateWizard}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              {t.campaigns.createCampaign}
            </Button>
          </div>
        </Card>
      )}

      {/* Campaigns Grid (WEB-02-03) */}
      {!isLoading && campaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.map((camp) => {
            const isCompleted = camp.status === "COMPLETED";
            const linkedProducts = availableProducts.filter((p) =>
              camp.productIds.includes(p.id)
            );

            return (
              <Card
                key={camp.id}
                interactive
                className="flex flex-col justify-between p-6 space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Status & Objectives Header */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={
                        camp.status === "ACTIVE"
                          ? "mint"
                          : camp.status === "PAUSED"
                          ? "warning"
                          : camp.status === "DRAFT"
                          ? "cyan"
                          : "outline"
                      }
                      size="sm"
                    >
                      {camp.status}
                    </Badge>

                    {/* Target Platforms */}
                    <div className="flex items-center gap-2">
                      {camp.platforms.includes("INSTAGRAM") && (
                        <span
                          className="p-1 rounded-lg bg-pink-500/15 text-pink-400 border border-pink-500/20"
                          title="Instagram Professional"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {camp.platforms.includes("FACEBOOK") && (
                        <span
                          className="p-1 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20"
                          title="Facebook Page"
                        >
                          <Facebook className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Objective */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-accent-violet transition-colors">
                      {camp.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-accent-cyan font-medium mt-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>{getObjectiveLabel(camp.objective)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-txt-secondary line-clamp-2 leading-relaxed">
                    {camp.targetAudience}
                  </p>

                  {/* Linked Products pill overview */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-txt-muted flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3 text-accent-mint" />
                      <span>{t.campaigns.associatedProductsCount}:</span>
                    </span>
                    <p className="text-white truncate font-medium">
                      {linkedProducts.map((p) => p.name).join(", ") ||
                        `${camp.productIds.length} Products`}
                    </p>
                  </div>
                </div>

                {/* Footer Controls & Dates */}
                <div className="pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-txt-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-accent-violet" />
                      <span>
                        {camp.startDate} &rarr; {camp.endDate}
                      </span>
                    </span>
                    <span className="text-[11px] font-mono text-txt-secondary">
                      {camp.publishingFrequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {/* Open in Studio Deep Link (WEB-02-05 preparation) */}
                    <a
                      href={`/content-studio?campaignId=${camp.id}`}
                      className="inline-flex items-center gap-1.5 text-xs text-accent-cyan hover:underline font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t.campaigns.launchInStudioBtn}</span>
                    </a>

                    <div className="flex items-center gap-1.5">
                      {/* Status toggle action */}
                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(camp)}
                          className="p-1.5 rounded-lg text-txt-muted hover:text-white hover:bg-white/10"
                          title={
                            camp.status === "ACTIVE"
                              ? t.campaigns.pauseCampaign
                              : t.campaigns.resumeCampaign
                          }
                        >
                          {camp.status === "ACTIVE" ? (
                            <PauseCircle className="w-4 h-4 text-semantic-warning" />
                          ) : (
                            <PlayCircle className="w-4 h-4 text-accent-mint" />
                          )}
                        </button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenDetails(camp)}
                      >
                        Details
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditWizard(camp)}
                        leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                        disabled={isCompleted}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT GUIDED WIZARD MODAL (WEB-02-03) */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        title={
          selectedCampaign
            ? t.campaigns.editCampaign
            : t.campaigns.createWizardTitle
        }
        description={t.campaigns.createWizardSubtitle}
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Stepper Header */}
          <div className="grid grid-cols-4 gap-2 border-b border-white/10 pb-4">
            {[
              { num: 1, label: t.campaigns.step1BasicInfo },
              { num: 2, label: t.campaigns.step2ProductsPlatforms },
              { num: 3, label: t.campaigns.step3ScheduleVoice },
              { num: 4, label: t.campaigns.step4ReviewLaunch },
            ].map((st) => (
              <div
                key={st.num}
                className={`text-center space-y-1 ${
                  wizardStep === st.num
                    ? "text-accent-cyan"
                    : wizardStep > st.num
                    ? "text-accent-mint"
                    : "text-txt-muted opacity-50"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-bold ${
                    wizardStep === st.num
                      ? "bg-accent-violet text-white shadow-glow-violet"
                      : wizardStep > st.num
                      ? "bg-accent-mint/20 text-accent-mint border border-accent-mint/30"
                      : "bg-white/10 text-txt-muted"
                  }`}
                >
                  {wizardStep > st.num ? <Check className="w-3.5 h-3.5" /> : st.num}
                </div>
                <p className="text-[10px] font-semibold truncate hidden sm:block">
                  {st.label}
                </p>
              </div>
            ))}
          </div>

          {/* API Error Feedback */}
          {wizardErrors.api && (
            <div className="p-3 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{wizardErrors.api}</span>
            </div>
          )}

          {/* STEP 1: Basic Info & Objective */}
          {wizardStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <Input
                label={t.campaigns.nameLabel}
                placeholder="e.g. Winter Solstice Micro-Lot Drop"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={wizardErrors.name}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-txt-secondary">
                  {t.campaigns.objectiveLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      key: "INCREASE_SALES",
                      label: t.campaigns.filterSales,
                      desc: "Drive direct online & retail purchases",
                    },
                    {
                      key: "INCREASE_ENGAGEMENT",
                      label: t.campaigns.filterEngagement,
                      desc: "Maximize likes, shares, comments & saves",
                    },
                    {
                      key: "INCREASE_AWARENESS",
                      label: t.campaigns.filterAwareness,
                      desc: "Expand brand reach to new audiences",
                    },
                  ].map((obj) => (
                    <button
                      key={obj.key}
                      type="button"
                      onClick={() => setObjective(obj.key as CampaignObjective)}
                      className={`p-3 rounded-xl border text-start transition-all ${
                        objective === obj.key
                          ? "bg-accent-violet/20 border-accent-violet text-white shadow-glow-violet"
                          : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                      }`}
                    >
                      <span className="text-xs font-bold block">{obj.label}</span>
                      <span className="text-[10px] text-txt-muted block mt-1">
                        {obj.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                label={t.campaigns.targetAudienceLabel}
                placeholder="Describe your ideal audience demographics, interests, and lifestyle..."
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                error={wizardErrors.targetAudience}
                rows={3}
                required
              />
            </div>
          )}

          {/* STEP 2: Products & Platforms */}
          {wizardStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Product multi-select */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-txt-secondary">
                    {t.campaigns.targetProductsLabel}
                  </label>
                  <span className="text-[11px] text-accent-cyan font-mono">
                    {selectedProductIds.length} selected
                  </span>
                </div>
                <p className="text-[11px] text-txt-muted">
                  {t.campaigns.selectProductsDesc}
                </p>

                {wizardErrors.productIds && (
                  <p className="text-xs text-semantic-error">
                    {wizardErrors.productIds}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto p-1">
                  {availableProducts.map((prod) => {
                    const isSelected = selectedProductIds.includes(prod.id);
                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => toggleProduct(prod.id)}
                        className={`p-3 rounded-xl border text-start transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-accent-mint/15 border-accent-mint text-white"
                            : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate text-white">
                            {prod.name}
                          </p>
                          <p className="text-[10px] text-txt-muted">
                            {prod.category} &bull; ${prod.price.toFixed(2)}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ms-2 ${
                            isSelected
                              ? "bg-accent-mint text-navy-950 font-bold"
                              : "border border-white/20"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform selector (Instagram & Facebook) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-medium text-txt-secondary">
                  {t.campaigns.platformsLabel}
                </label>
                {wizardErrors.platforms && (
                  <p className="text-xs text-semantic-error">
                    {wizardErrors.platforms}
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => togglePlatform("INSTAGRAM")}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      selectedPlatforms.includes("INSTAGRAM")
                        ? "bg-pink-500/15 border-pink-500 text-white shadow-glow-violet"
                        : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                    }`}
                  >
                    <Instagram className="w-5 h-5 text-pink-400" />
                    <div className="text-start">
                      <p className="text-xs font-bold text-white">Instagram</p>
                      <p className="text-[10px] text-txt-muted">
                        Business & Creator Accounts
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => togglePlatform("FACEBOOK")}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      selectedPlatforms.includes("FACEBOOK")
                        ? "bg-blue-500/15 border-blue-500 text-white shadow-glow-cyan"
                        : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                    }`}
                  >
                    <Facebook className="w-5 h-5 text-blue-400" />
                    <div className="text-start">
                      <p className="text-xs font-bold text-white">Facebook</p>
                      <p className="text-[10px] text-txt-muted">
                        Official Brand Pages
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Schedule & Voice */}
          {wizardStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label={t.campaigns.startDateLabel}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />

                <Input
                  label={t.campaigns.endDateLabel}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  error={wizardErrors.endDate}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                    {t.campaigns.languageLabel}
                  </label>
                  <select
                    value={contentLanguage}
                    onChange={(e) =>
                      setContentLanguage(e.target.value as ContentLanguage)
                    }
                    className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
                  >
                    <option value="en">English (en)</option>
                    <option value="tr">Türkçe (tr)</option>
                    <option value="ar">العربية (ar)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                    {t.campaigns.toneLabel}
                  </label>
                  <select
                    value={communicationTone}
                    onChange={(e) =>
                      setCommunicationTone(e.target.value as CommunicationTone)
                    }
                    className="glass-input w-full h-11 px-3 text-xs text-white bg-navy-900 focus:outline-none"
                  >
                    <option value="PROFESSIONAL">PROFESSIONAL</option>
                    <option value="FRIENDLY">FRIENDLY</option>
                    <option value="LUXURY">LUXURY</option>
                    <option value="BOLD">BOLD</option>
                    <option value="EDUCATIONAL">EDUCATIONAL</option>
                  </select>
                </div>
              </div>

              <Input
                label={t.campaigns.frequencyLabel}
                placeholder="e.g. 3 carousels + 2 stories per week"
                value={publishingFrequency}
                onChange={(e) => setPublishingFrequency(e.target.value)}
              />
            </div>
          )}

          {/* STEP 4: Review & Launch */}
          {wizardStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl glass-card space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="font-bold text-white text-sm">{name}</span>
                  <Badge variant="cyan">{getObjectiveLabel(objective)}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-txt-secondary">
                  <div>
                    <span className="text-txt-muted block">Duration:</span>
                    <strong className="text-white">
                      {startDate} &bull; {endDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-txt-muted block">Platforms:</span>
                    <strong className="text-white">
                      {selectedPlatforms.join(", ")}
                    </strong>
                  </div>
                  <div>
                    <span className="text-txt-muted block">Tone & Language:</span>
                    <strong className="text-white">
                      {communicationTone} &bull; {contentLanguage.toUpperCase()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-txt-muted block">Frequency:</span>
                    <strong className="text-white">{publishingFrequency}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <span className="text-txt-muted block mb-1">
                    Selected Products ({selectedProductIds.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableProducts
                      .filter((p) => selectedProductIds.includes(p.id))
                      .map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-white"
                        >
                          {p.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              <Textarea
                label={t.campaigns.budgetNotesLabel}
                placeholder="Optional promotional budget notes or target KPI benchmarks..."
                value={budgetNotes}
                onChange={(e) => setBudgetNotes(e.target.value)}
                rows={2}
              />
            </div>
          )}

          {/* Wizard Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrevStep}
              disabled={wizardStep === 1}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              {t.common.back}
            </Button>

            {wizardStep < 4 ? (
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t.common.next}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSaveCampaign("DRAFT")}
                  isLoading={isSubmittingWizard}
                >
                  {t.campaigns.saveAsDraft}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => handleSaveCampaign("ACTIVE")}
                  isLoading={isSubmittingWizard}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  {t.campaigns.launchCampaign}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* CAMPAIGN DETAILS INSPECTOR MODAL (WEB-02-04) */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={selectedCampaign?.name || t.campaigns.campaignDetails}
        description={t.campaigns.campaignDetails}
        maxWidth="lg"
      >
        {selectedCampaign && (
          <div className="space-y-5 text-xs text-txt-secondary">
            {/* Header pill summary */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedCampaign.status === "ACTIVE"
                      ? "mint"
                      : selectedCampaign.status === "PAUSED"
                      ? "warning"
                      : selectedCampaign.status === "DRAFT"
                      ? "cyan"
                      : "outline"
                  }
                >
                  {selectedCampaign.status}
                </Badge>
                <span className="font-bold text-white text-sm">
                  {getObjectiveLabel(selectedCampaign.objective)}
                </span>
              </div>
              <span className="text-[11px] font-mono text-txt-muted">
                {selectedCampaign.id}
              </span>
            </div>

            {/* Completed Campaign Parameter Lock Warning (BE-04-06) */}
            {selectedCampaign.status === "COMPLETED" && (
              <div className="p-3 rounded-xl bg-accent-violet/10 border border-accent-violet/20 text-accent-violet flex items-center gap-2 text-xs">
                <Lock className="w-4 h-4 shrink-0" />
                <span>{t.campaigns.editRestrictedNotice}</span>
              </div>
            )}

            {/* Target Audience */}
            <div className="space-y-1">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                {t.campaigns.targetAudienceLabel}:
              </span>
              <p className="text-txt-secondary leading-relaxed p-3 rounded-xl bg-black/30 border border-white/5">
                {selectedCampaign.targetAudience}
              </p>
            </div>

            {/* Flight Dates & Platforms */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-txt-muted block">
                  {t.campaigns.dateRangeLabel}:
                </span>
                <span className="text-white font-medium">
                  {selectedCampaign.startDate} &bull; {selectedCampaign.endDate}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="text-[10px] text-txt-muted block">
                  Platforms:
                </span>
                <span className="text-white font-medium">
                  {selectedCampaign.platforms.join(" & ")}
                </span>
              </div>
            </div>

            {/* Associated Products */}
            <div className="space-y-1.5">
              <span className="font-bold text-white uppercase text-[10px] tracking-wider">
                {t.campaigns.associatedProductsCount}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableProducts
                  .filter((p) => selectedCampaign.productIds.includes(p.id))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                    >
                      <span className="text-white font-semibold truncate">
                        {p.name}
                      </span>
                      <span className="text-accent-cyan font-mono text-[11px]">
                        ${p.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Studio Launch Deep Link */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <a
                href={`/content-studio?campaignId=${selectedCampaign.id}`}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="primary"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                >
                  {t.campaigns.launchInStudioBtn}
                </Button>
              </a>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsDetailsOpen(false);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-semantic-error hover:bg-semantic-error/10"
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsDetailsOpen(false)}
                >
                  {t.common.close}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* DELETE CAMPAIGN CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={t.campaigns.deleteCampaign}
        description={t.campaigns.confirmDelete}
        maxWidth="sm"
      >
        <div className="space-y-4 pt-2">
          <p className="text-xs text-txt-secondary leading-relaxed">
            Deleting <strong className="text-white">{selectedCampaign?.name}</strong> will remove it from active marketing workflows.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              {t.common.confirmAction}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
