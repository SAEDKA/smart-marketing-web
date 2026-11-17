"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { companyApi } from "@/lib/api/company.api";
import { CommunicationTone, ContentLanguage, ApiErrorShape } from "@/types/domain";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  Building2,
  Users,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";

export default function OnboardingPage() {
  const { t } = useI18n();
  const { completeOnboarding } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form State
  const [companyName, setCompanyName] = useState("Lumiere Artisan Roasters");
  const [industry, setIndustry] = useState("Specialty Coffee & Artisanal Bakery");
  const [description, setDescription] = useState(
    "Single-origin specialty coffee roastery and artisanal sourdough bakery serving urban coffee enthusiasts."
  );
  const [targetAudience, setTargetAudience] = useState(
    "Urban professionals, creatives, and specialty coffee lovers aged 24–45 who appreciate ethically sourced beans and craft baking."
  );
  const [countryRegion, setCountryRegion] = useState("Turkey — Istanbul & MENA");
  const [preferredLanguage, setPreferredLanguage] = useState<ContentLanguage>("en");
  const [communicationTone, setCommunicationTone] = useState<CommunicationTone>("LUXURY");
  const [brandInformation, setBrandInformation] = useState(
    "Highlight small-batch roasting, direct-trade farms, warm hospitality, and sensory tasting notes. Avoid aggressive discount slang."
  );

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchInitial() {
      try {
        const res = await companyApi.getProfile();
        if (res.data) {
          setCompanyName(res.data.companyName || "");
          setIndustry(res.data.industry || "");
          setDescription(res.data.description || "");
          setTargetAudience(res.data.targetAudience || "");
          setCountryRegion(res.data.countryRegion || "");
          setPreferredLanguage(res.data.preferredLanguage || "en");
          setCommunicationTone(res.data.communicationTone || "LUXURY");
          setBrandInformation(res.data.brandInformation || "");
        }
      } catch (err) {
        console.error("Failed to load onboarding initial data", err);
      }
    }
    fetchInitial();
  }, []);

  const steps = [
    { number: 1, title: t.onboarding.step1Title, desc: t.onboarding.step1Desc, icon: Building2 },
    { number: 2, title: t.onboarding.step2Title, desc: t.onboarding.step2Desc, icon: Users },
    { number: 3, title: t.onboarding.step3Title, desc: t.onboarding.step3Desc, icon: MessageSquare },
    { number: 4, title: t.onboarding.step4Title, desc: t.onboarding.step4Desc, icon: Sparkles },
  ];

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!companyName.trim()) errs.companyName = t.validation.companyNameRequired;
      if (!industry.trim()) errs.industry = t.validation.industryRequired;
      if (!description.trim()) errs.description = t.validation.descriptionMin;
    } else if (step === 2) {
      if (!targetAudience.trim()) errs.targetAudience = t.validation.targetAudienceRequired;
      if (!countryRegion.trim()) errs.countryRegion = t.validation.countryRequired;
    } else if (step === 4) {
      if (!brandInformation.trim()) errs.brandInformation = t.validation.brandInfoRequired;
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setApiError(null);
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setApiError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = async () => {
    if (!validateStep(4)) return;

    setIsLoading(true);
    setApiError(null);
    setIsSaved(false);

    try {
      const res = await companyApi.saveOnboarding({
        companyName,
        industry,
        description,
        targetAudience,
        countryRegion,
        preferredLanguage,
        communicationTone,
        brandInformation,
        simulateFailure: false,
      });
      // The company now exists: unlock the full workspace for this
      // session, bind it to the saved company's id, and let the
      // dashboard greet him with the saved banner.
      completeOnboarding(res.data?.id);
      try {
        window.sessionStorage.setItem("smp_company_saved", "1");
      } catch {
        // Storage is best-effort; the unlock above is what matters.
      }
      setIsSaved(true);
    } catch (err: unknown) {
      const apiErr = err as ApiErrorShape;
      setApiError(
        apiErr.message ||
          "Save failed. Your form inputs remain safely preserved for immediate retry."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toneOptions: CommunicationTone[] = [
    "PROFESSIONAL",
    "FRIENDLY",
    "LUXURY",
    "BOLD",
    "EDUCATIONAL",
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Wizard Header */}
      <div className="space-y-1 text-start">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {t.onboarding.title}
        </h1>
        <p className="text-sm text-txt-secondary">
          {t.onboarding.subtitle}
        </p>
      </div>

      {/* Progress Stepper Bar */}
      <div className="glass-card p-4 sm:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((st) => {
            const isCompleted = currentStep > st.number || isSaved;
            const isCurrent = currentStep === st.number;

            return (
              <button
                key={st.number}
                type="button"
                onClick={() => {
                  if (st.number < currentStep) setCurrentStep(st.number);
                }}
                disabled={st.number > currentStep && !isSaved}
                className={`text-start flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                  isCurrent
                    ? "bg-accent-violet/20 border border-accent-violet/40 text-white"
                    : isCompleted
                    ? "bg-white/5 text-txt-secondary hover:text-white"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    isCompleted
                      ? "bg-accent-mint/20 text-accent-mint border border-accent-mint/30"
                      : isCurrent
                      ? "bg-accent-violet text-white shadow-glow-violet"
                      : "bg-white/10 text-txt-muted"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : st.number}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate text-white">
                    {st.title}
                  </p>
                  <p className="text-[10px] text-txt-muted truncate">
                    {st.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Card Content */}
      <Card className="glass-panel border-white/15 shadow-2xl p-6 sm:p-8">
        {/* Error notification with safe input preservation feedback */}
        {apiError && (
          <div
            role="alert"
            className="mb-6 p-4 rounded-2xl bg-semantic-error/15 border border-semantic-error/40 text-semantic-error text-xs sm:text-sm flex items-start gap-3 animate-in fade-in"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t.common.errorOccurred}</p>
              <p className="mt-1 text-white/90">{apiError}</p>
              <p className="mt-2 text-[11px] text-accent-cyan">
                {t.onboarding.draftProtectedNotice}
              </p>
            </div>
          </div>
        )}

        {/* Success confirmation */}
        {isSaved && (
          <div className="mb-6 p-4 rounded-2xl bg-semantic-success/15 border border-semantic-success/40 text-semantic-success text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t.onboarding.onboardingSuccessMsg}</p>
            </div>
          </div>
        )}

        {/* STEP 1: Company Profile */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-semibold text-white">
                {t.onboarding.step1Title}: {t.onboarding.step1Desc}
              </h2>
            </div>

            <Input
              label={t.onboarding.companyName}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={fieldErrors.companyName}
              required
            />

            <Input
              label={t.onboarding.industry}
              placeholder={t.onboarding.industryPlaceholder}
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              error={fieldErrors.industry}
              required
            />

            <Textarea
              label={t.onboarding.description}
              placeholder={t.onboarding.descriptionPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={fieldErrors.description}
              rows={4}
              required
            />
          </div>
        )}

        {/* STEP 2: Audience & Region */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-semibold text-white">
                {t.onboarding.step2Title}: {t.onboarding.step2Desc}
              </h2>
            </div>

            <Textarea
              label={t.onboarding.targetAudience}
              placeholder={t.onboarding.targetAudiencePlaceholder}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              error={fieldErrors.targetAudience}
              rows={3}
              required
            />

            <Input
              label={t.onboarding.countryRegion}
              placeholder={t.onboarding.countryRegionPlaceholder}
              value={countryRegion}
              onChange={(e) => setCountryRegion(e.target.value)}
              error={fieldErrors.countryRegion}
              required
            />
          </div>
        )}

        {/* STEP 3: Brand Voice & Language */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-semibold text-white">
                {t.onboarding.step3Title}: {t.onboarding.step3Desc}
              </h2>
            </div>

            {/* Content Language Choice */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-txt-secondary">
                {t.onboarding.preferredLanguage}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { code: "en", label: t.onboarding.languages.en, flag: "🇬🇧" },
                  { code: "tr", label: t.onboarding.languages.tr, flag: "🇹🇷" },
                  { code: "ar", label: t.onboarding.languages.ar, flag: "🇸🇦" },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => setPreferredLanguage(item.code as ContentLanguage)}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      preferredLanguage === item.code
                        ? "bg-accent-violet/20 border-accent-violet shadow-glow-violet text-white"
                        : "bg-white/5 border-white/10 text-txt-secondary hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-xl block mb-1">{item.flag}</span>
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Communication Tone Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-txt-secondary">
                {t.onboarding.communicationTone}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {toneOptions.map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setCommunicationTone(tone)}
                    className={`p-3 rounded-xl border text-start transition-all ${
                      communicationTone === tone
                        ? "bg-accent-cyan/15 border-accent-cyan text-white shadow-glow-cyan"
                        : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                    }`}
                  >
                    <span className="text-xs font-bold block">{tone}</span>
                    <span className="text-[10px] text-txt-muted block mt-0.5">
                      {t.onboarding.tones[tone]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Finalize */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-semibold text-white">
                {t.onboarding.step4Title}: {t.onboarding.step4Desc}
              </h2>
            </div>

            <Textarea
              label={t.onboarding.brandInformation}
              placeholder={t.onboarding.brandInformationPlaceholder}
              value={brandInformation}
              onChange={(e) => setBrandInformation(e.target.value)}
              error={fieldErrors.brandInformation}
              rows={3}
              required
            />

            {/* Overview summary */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
              <h4 className="font-semibold text-accent-cyan">
                Workspace Configuration Summary
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-txt-secondary">
                <p>
                  <strong className="text-white">Company:</strong> {companyName}
                </p>
                <p>
                  <strong className="text-white">Industry:</strong> {industry}
                </p>
                <p>
                  <strong className="text-white">Region:</strong> {countryRegion}
                </p>
                <p>
                  <strong className="text-white">Language / Tone:</strong>{" "}
                  {t.onboarding.languages[preferredLanguage]} &bull;{" "}
                  {t.onboarding.tones[communicationTone]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Navigation Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-white/10 mt-6">
          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto"
            onClick={handleBack}
            disabled={currentStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {t.common.back}
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              className="w-full sm:w-auto"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {t.common.next}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              className="w-full sm:w-auto"
              onClick={handleComplete}
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              {isLoading ? t.common.saving : t.onboarding.completeOnboardingBtn}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
