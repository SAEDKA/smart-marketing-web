"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { analyticsApi } from "@/lib/api/analytics.api";
import {
  AnalyticsDateRange,
  AnalyticsMetricSummary,
  AnalyticsTrendPoint,
  PlatformMetricBreakdown,
} from "@/types/domain";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MousePointerClick,
  Percent,
  RefreshCw,
  HelpCircle,
  Instagram,
  Facebook,
} from "lucide-react";

export default function AnalyticsPage() {
  const { t } = useI18n();

  const [dateRange, setDateRange] = useState<AnalyticsDateRange>("30d");
  const [summary, setSummary] = useState<AnalyticsMetricSummary | null>(null);
  const [trends, setTrends] = useState<AnalyticsTrendPoint[]>([]);
  const [platforms, setPlatforms] = useState<PlatformMetricBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<AnalyticsTrendPoint | null>(null);

  const fetchAnalyticsData = async (range: AnalyticsDateRange) => {
    try {
      setLoading(true);
      const [sumRes, trendRes, platRes] = await Promise.all([
        analyticsApi.getSummary(range),
        analyticsApi.getTrends(range),
        analyticsApi.getPlatformBreakdown(range),
      ]);
      setSummary(sumRes.data);
      setTrends(trendRes.data);
      setPlatforms(platRes.data);
    } catch {
      // Keep previous data or handle gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(dateRange);
  }, [dateRange]);

  // Max for trend chart scaling
  const maxImpressions = Math.max(...trends.map((t) => t.impressions), 6000);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-cyan-400" />
            {t.analytics.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.analytics.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          {/* Date Range Selector */}
          <div className="flex rounded-xl bg-slate-900/80 border border-white/10 p-1">
            {(
              [
                { id: "7d", label: t.analytics.range7d },
                { id: "14d", label: t.analytics.range14d },
                { id: "30d", label: t.analytics.range30d },
                { id: "90d", label: t.analytics.range90d },
              ] as const
            ).map((btn) => (
              <button
                key={btn.id}
                onClick={() => setDateRange(btn.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  dateRange === btn.id
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalyticsData(dateRange)}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition"
            title={t.analytics.refreshMetrics}
          >
            <RefreshCw
              className={`w-4 h-4 text-cyan-400 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Reach vs Impressions Distinction Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900/40 border border-cyan-500/20 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-sm font-semibold text-white">
                {t.analytics.reachVsImpressionsTitle}
              </h2>
              {summary && (
                <span className="text-[11px] font-mono text-cyan-300">
                  {summary.measuredPeriod}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {t.analytics.reachVsImpressionsDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Core KPI Cards Grid */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* REACH */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-cyan-500/30 transition shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                {t.analytics.reachLabel}
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white tracking-tight">
                {summary.reach.toLocaleString()}
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />+
                {summary.reachChangePercent}%
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Unique targeted accounts
            </div>
          </div>

          {/* IMPRESSIONS */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-violet-500/30 transition shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                {t.analytics.impressionsLabel}
              </span>
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Eye className="w-4 h-4 text-violet-400" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white tracking-tight">
                {summary.impressions.toLocaleString()}
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />+
                {summary.impressionsChangePercent}%
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              {(summary.impressions / (summary.reach || 1)).toFixed(2)}x view frequency
            </div>
          </div>

          {/* ENGAGEMENT RATE */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-pink-500/30 transition shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                {t.analytics.engagementRateLabel}
              </span>
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                <Percent className="w-4 h-4 text-pink-400" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white tracking-tight">
                {summary.engagementRate}%
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />+
                {summary.engagementChangePercent}%
              </span>
            </div>
            <div className="text-[11px] text-pink-400/90 font-mono">
              Top 10% in Specialty Coffee
            </div>
          </div>

          {/* LINK CLICKS & CTR */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-emerald-500/30 transition shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                {t.analytics.linkClicksLabel}
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold text-white tracking-tight">
                {summary.linkClicks.toLocaleString()}
              </div>
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" />+
                {summary.clicksChangePercent}%
              </span>
            </div>
            <div className="text-[11px] text-emerald-400/90 font-mono">
              {summary.clickThroughRate}% Click-Through Rate
            </div>
          </div>
        </div>
      )}

      {/* Engagement Breakdown Sub-Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <Heart className="w-4 h-4 text-rose-400" />
            <div>
              <div className="text-[11px] text-slate-400">
                {t.analytics.likesLabel}
              </div>
              <div className="text-base font-bold text-white">
                {summary.likes.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[11px] text-slate-400">
                {t.analytics.commentsLabel}
              </div>
              <div className="text-base font-bold text-white">
                {summary.comments.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <Share2 className="w-4 h-4 text-violet-400" />
            <div>
              <div className="text-[11px] text-slate-400">
                {t.analytics.sharesLabel}
              </div>
              <div className="text-base font-bold text-white">
                {summary.shares.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
            <Bookmark className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[11px] text-slate-400">
                {t.analytics.savesLabel}
              </div>
              <div className="text-base font-bold text-white">
                {summary.saves.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Visual Trend Chart */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">
              {t.analytics.performanceTrends}
            </h3>
            <p className="text-xs text-slate-400">
              Daily telemetry tracking reach and gross impressions volume
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-cyan-400" />
              <span className="text-slate-300">{t.analytics.reachLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-violet-500" />
              <span className="text-slate-300">
                {t.analytics.impressionsLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Hover inspector pill if any */}
        {hoveredPoint && (
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-slate-300 flex items-center justify-between max-w-sm animate-in fade-in duration-150">
            <span className="font-semibold text-white">
              {hoveredPoint.label}
            </span>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-cyan-400">
                Reach: {hoveredPoint.reach.toLocaleString()}
              </span>
              <span className="text-violet-400">
                Impr: {hoveredPoint.impressions.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* HTML/SVG Bar Chart Grid */}
        <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 border-b border-white/10 px-2">
          {trends.map((pt, idx) => {
            const imprHeightPercent = Math.min(
              100,
              Math.max(12, (pt.impressions / maxImpressions) * 100)
            );
            const reachHeightPercent = Math.min(
              100,
              Math.max(8, (pt.reach / maxImpressions) * 100)
            );

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
              >
                <div className="w-full max-w-[28px] h-full flex items-end justify-center gap-1">
                  {/* Reach Bar */}
                  <div
                    style={{ height: `${reachHeightPercent}%` }}
                    className="w-1/2 rounded-t-sm bg-cyan-400/80 group-hover:bg-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/20"
                  />
                  {/* Impressions Bar */}
                  <div
                    style={{ height: `${imprHeightPercent}%` }}
                    className="w-1/2 rounded-t-sm bg-violet-600/80 group-hover:bg-violet-500 transition-all duration-300 shadow-lg shadow-violet-600/20"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-2 truncate max-w-full font-mono">
                  {pt.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Comparison Section */}
      <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-5">
        <div>
          <h3 className="text-base font-bold text-white">
            {t.analytics.platformComparison}
          </h3>
          <p className="text-xs text-slate-400">
            Performance metrics partitioned by connected social channel
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((p) => {
            const isInstagram = p.platform === "INSTAGRAM";
            return (
              <div
                key={p.platform}
                className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {isInstagram ? (
                      <Instagram className="w-5 h-5 text-pink-400" />
                    ) : (
                      <Facebook className="w-5 h-5 text-blue-400" />
                    )}
                    <span className="text-sm font-bold text-white">
                      {isInstagram ? "Instagram Professional" : "Facebook Pages"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 font-mono">
                    {p.engagementRate}% Engagement
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/5">
                  <div className="p-2 rounded-lg bg-white/[0.02]">
                    <div className="text-[10px] text-slate-500">Reach</div>
                    <div className="text-sm font-bold text-white">
                      {p.reach.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02]">
                    <div className="text-[10px] text-slate-500">Impressions</div>
                    <div className="text-sm font-bold text-white">
                      {p.impressions.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.02]">
                    <div className="text-[10px] text-slate-500">Shares</div>
                    <div className="text-sm font-bold text-white">
                      {p.shares.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
