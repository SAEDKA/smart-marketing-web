"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { companyApi } from "@/lib/api/company.api";
import { BrandSettings, CommunicationTone, ContentLanguage, ApiErrorShape } from "@/types/domain";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function BrandSettingsPage() {
  const { t, locale } = useI18n();

  const [initialData, setInitialData] = useState<BrandSettings | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandDescription, setBrandDescription] = useState("");
  const [communicationTone, setCommunicationTone] = useState<CommunicationTone>("LUXURY");
  const [preferredLanguage, setPreferredLanguage] = useState<ContentLanguage>("en");
  const [targetAudienceSummary, setTargetAudienceSummary] = useState("");
  const [keyValueProposition, setKeyValueProposition] = useState("");
  const [brandGuidelines, setBrandGuidelines] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const fetchBrandSettings = async () => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const res = await companyApi.getBrandSettings();
      if (res.data) {
        setInitialData(res.data);
        setBrandName(res.data.brandName || "");
        setBrandDescription(res.data.brandDescription || "");
        setCommunicationTone(res.data.communicationTone || "LUXURY");
        setPreferredLanguage(res.data.preferredLanguage || "en");
        setTargetAudienceSummary(res.data.targetAudienceSummary || "");
        setKeyValueProposition(res.data.keyValueProposition || "");
        setBrandGuidelines(res.data.brandGuidelines || "");
      }
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMsg({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandSettings();
  }, []);

  const hasUnsavedChanges =
    initialData &&
    (brandName !== initialData.brandName ||
      brandDescription !== initialData.brandDescription ||
      communicationTone !== initialData.communicationTone ||
      preferredLanguage !== initialData.preferredLanguage ||
      targetAudienceSummary !== initialData.targetAudienceSummary ||
      keyValueProposition !== initialData.keyValueProposition ||
      brandGuidelines !== initialData.brandGuidelines);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    try {
      const res = await companyApi.updateBrandSettings({
        brandName,
        brandDescription,
        communicationTone,
        preferredLanguage,
        targetAudienceSummary,
        keyValueProposition,
        brandGuidelines,
      });
      setInitialData(res.data);
      setStatusMsg({
        type: "success",
        text: t.common.savedSuccessfully,
      });
    } catch (err) {
      const apiErr = err as ApiErrorShape;
      setStatusMsg({
        type: "error",
        text: apiErr.message || t.common.errorOccurred,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (!initialData) return;
    if (confirm(t.brand.discardConfirm)) {
      setBrandName(initialData.brandName);
      setBrandDescription(initialData.brandDescription);
      setCommunicationTone(initialData.communicationTone);
      setPreferredLanguage(initialData.preferredLanguage);
      setTargetAudienceSummary(initialData.targetAudienceSummary);
      setKeyValueProposition(initialData.keyValueProposition);
      setBrandGuidelines(initialData.brandGuidelines);
      setStatusMsg(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.brand.title}
          </h1>
          <p className="text-sm text-txt-secondary mt-1">{t.brand.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {initialData?.updatedAt && (
            <div className="flex items-center gap-1.5 text-[11px] text-txt-muted bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Clock className="w-3.5 h-3.5 text-accent-cyan" />
              <span>
                {t.brand.lastSynchronized}:{" "}
                {formatDate(initialData.updatedAt, locale)}
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchBrandSettings}
            title={t.brand.reloadFromServer}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Sync
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {statusMsg && (
        <div
          role="alert"
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-3 animate-in fade-in ${
            statusMsg.type === "success"
              ? "bg-semantic-success/15 border border-semantic-success/40 text-semantic-success"
              : "bg-semantic-error/15 border border-semantic-error/40 text-semantic-error"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <Card className="glass-panel border-white/15 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-violet" />
              <h2 className="text-base font-semibold text-white">
                Core Identity & Voice
              </h2>
            </div>
            {hasUnsavedChanges && (
              <Badge variant="warning" size="sm">
                {t.common.unsavedChanges}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t.brand.brandName}
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-medium text-txt-secondary mb-1.5">
                {t.brand.communicationTone}
              </label>
              <select
                value={communicationTone}
                onChange={(e) =>
                  setCommunicationTone(e.target.value as CommunicationTone)
                }
                className="glass-input w-full h-11 px-4 text-sm text-white bg-navy-900 focus:outline-none"
              >
                <option value="PROFESSIONAL">PROFESSIONAL</option>
                <option value="FRIENDLY">FRIENDLY</option>
                <option value="LUXURY">LUXURY</option>
                <option value="BOLD">BOLD</option>
                <option value="EDUCATIONAL">EDUCATIONAL</option>
              </select>
            </div>
          </div>

          <Textarea
            label={t.brand.brandDescription}
            value={brandDescription}
            onChange={(e) => setBrandDescription(e.target.value)}
            rows={3}
            required
          />

          <div className="space-y-2">
            <label className="block text-xs font-medium text-txt-secondary">
              {t.brand.preferredLanguage}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: "en", label: "English", flag: "🇬🇧" },
                { code: "tr", label: "Türkçe", flag: "🇹🇷" },
                { code: "ar", label: "العربية", flag: "🇸🇦" },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setPreferredLanguage(item.code as ContentLanguage)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    preferredLanguage === item.code
                      ? "bg-accent-violet/20 border-accent-violet text-white font-semibold"
                      : "bg-white/5 border-white/10 text-txt-secondary hover:text-white"
                  }`}
                >
                  <span className="text-base me-2">{item.flag}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 space-y-4">
            <h3 className="text-sm font-semibold text-accent-cyan">
              Target Audience & Positioning
            </h3>

            <Textarea
              label={t.brand.targetAudienceSummary}
              value={targetAudienceSummary}
              onChange={(e) => setTargetAudienceSummary(e.target.value)}
              rows={2}
            />

            <Input
              label={t.brand.keyValueProposition}
              value={keyValueProposition}
              onChange={(e) => setKeyValueProposition(e.target.value)}
            />

            <Textarea
              label={t.brand.brandGuidelines}
              value={brandGuidelines}
              onChange={(e) => setBrandGuidelines(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleDiscard}
              disabled={!hasUnsavedChanges}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              {t.common.reset}
            </Button>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              {isSaving ? t.common.saving : t.common.save}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
