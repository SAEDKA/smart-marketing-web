"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { reportsApi } from "@/lib/api/reports.api";
import { SwotReport, SwotCategory } from "@/types/domain";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Flame,
} from "lucide-react";

export default function ReportsPage() {
  const { t } = useI18n();

  const [report, setReport] = useState<SwotReport | null>(null);
  const [, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchSwotReport = async () => {
    try {
      setLoading(true);
      const res = await reportsApi.getSwotReport(false);
      setReport(res.data);
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwotReport();
  }, []);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const res = await reportsApi.regenerateSwotReport();
      setReport(res.data);
      setStatusMessage("AI strategy refreshed from the latest performance data.");
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setRegenerating(false);
    }
  };

  const getCategoryItems = (cat: SwotCategory) => {
    return report?.items.filter((item) => item.category === cat) || [];
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-violet-400" />
            {t.reports.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.reports.subtitle}
          </p>
          <p className="text-xs text-emerald-300/80 mt-2 max-w-2xl flex items-start gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 mt-px shrink-0" />
            <span>{t.reports.swotHint}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white shadow-lg shadow-violet-600/25 transition flex items-center gap-2"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`}
            />
            {regenerating
              ? t.reports.regenerating
              : t.reports.regenerateReport}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-200 text-sm flex items-center justify-between">
          <span>{statusMessage}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-violet-400 hover:text-violet-200 text-xs uppercase font-bold"
          >
            {t.common.close}
          </button>
        </div>
      )}

      {/* COLD START / INSUFFICIENT DATA STATE (WEB-03-05 Requirement) */}
      {report && !report.hasSufficientData ? (
        <div className="rounded-2xl p-8 bg-slate-900/60 border border-white/10 backdrop-blur-xl text-center space-y-6 max-w-2xl mx-auto my-12 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              {t.reports.insufficientDataTitle}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto">
              {t.reports.insufficientDataDesc}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 max-w-md mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Published Posts</span>
              <span className="text-amber-400 font-mono">
                {report.publishedPostsCount} / 3 Posts
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                style={{
                  width: `${(report.publishedPostsCount / 3) * 100}%`,
                }}
                className="h-full bg-gradient-to-r from-amber-500 to-violet-500 rounded-full"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4">
            <Link
              href="/calendar"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white transition flex items-center gap-2"
            >
              Open Publishing Calendar
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* 4-QUADRANT EVIDENCE-BASED SWOT MATRIX */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                {t.reports.swotTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.reports.swotSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* STRENGTHS (S) */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-emerald-500/30 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h3 className="text-base font-bold text-emerald-300">
                      {t.reports.strengths}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold">
                    {getCategoryItems("STRENGTH").length} Validated
                  </span>
                </div>

                <div className="space-y-3">
                  {getCategoryItems("STRENGTH").map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-emerald-500/20 transition"
                    >
                      <div className="text-sm font-semibold text-white">
                        {item.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.numericalEvidence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WEAKNESSES (W) */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-amber-500/30 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <h3 className="text-base font-bold text-amber-300">
                      {t.reports.weaknesses}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-semibold">
                    {getCategoryItems("WEAKNESS").length} Identified
                  </span>
                </div>

                <div className="space-y-3">
                  {getCategoryItems("WEAKNESS").map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-amber-500/20 transition"
                    >
                      <div className="text-sm font-semibold text-white">
                        {item.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.numericalEvidence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* OPPORTUNITIES (O) */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-cyan-500/30 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h3 className="text-base font-bold text-cyan-300">
                      {t.reports.opportunities}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-semibold">
                    {getCategoryItems("OPPORTUNITY").length} High Potential
                  </span>
                </div>

                <div className="space-y-3">
                  {getCategoryItems("OPPORTUNITY").map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-cyan-500/20 transition"
                    >
                      <div className="text-sm font-semibold text-white">
                        {item.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.numericalEvidence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* THREATS (T) */}
              <div className="rounded-2xl p-6 bg-slate-900/60 border border-violet-500/30 backdrop-blur-xl shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-violet-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4 text-violet-400" />
                    </div>
                    <h3 className="text-base font-bold text-violet-300">
                      {t.reports.threats}
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 font-semibold">
                    {getCategoryItems("THREAT").length} Tracked
                  </span>
                </div>

                <div className="space-y-3">
                  {getCategoryItems("THREAT").map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 hover:border-violet-500/20 transition"
                    >
                      <div className="text-sm font-semibold text-white">
                        {item.title}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-1.5 flex items-center gap-1.5 text-[11px] font-mono text-violet-400">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>{item.numericalEvidence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PRIORITIZED AI MARKETING DIRECTIVES */}
          <div className="space-y-5 pt-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400" />
                {t.reports.recommendationsTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.reports.recommendationsSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report?.recommendations?.map((rec) => (
                <div
                  key={rec.id}
                  className="rounded-2xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-4 hover:border-violet-500/30 transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {rec.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                          rec.priority === "HIGH"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                            : rec.priority === "MEDIUM"
                            ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                            : "bg-slate-700/40 text-slate-400 border-slate-600/30"
                        }`}
                      >
                        {rec.priority === "HIGH"
                          ? t.reports.highPriority
                          : rec.priority === "MEDIUM"
                          ? t.reports.mediumPriority
                          : t.reports.lowPriority}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                      <div>
                        <span className="text-[11px] text-slate-400 font-semibold block mb-0.5">
                          {t.reports.actionItemLabel}:
                        </span>
                        <p className="text-slate-200 leading-relaxed font-medium">
                          {rec.actionItem}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[11px] text-slate-500 block mb-0.5">
                          Data Rationale:
                        </span>
                        <p className="text-slate-400 text-[11px] leading-relaxed">
                          {rec.rationale}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-semibold text-emerald-400">
                      {rec.expectedImpact}
                    </span>
                    <Link
                      href="/campaigns"
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition flex items-center gap-1.5"
                    >
                      {t.reports.applyToCampaign}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
