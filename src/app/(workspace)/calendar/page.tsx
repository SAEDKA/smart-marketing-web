"use client";

import { useEffect, useState, useMemo } from "react";
import { useI18n } from "@/lib/i18n/context";
import { publishingApi } from "@/lib/api/publishing.api";
import { postsApi } from "@/lib/api/posts.api";
import { Post, SocialPlatform } from "@/types/domain";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Instagram,
  Facebook,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Info,
  CalendarCheck,
  Send,
} from "lucide-react";

export default function CalendarPage() {
  const { t, locale } = useI18n();

  const [posts, setPosts] = useState<Post[]>([]);
  const [approvedPosts, setApprovedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Calendar date state: starts in November 2026
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 11)); // Nov 11, 2026
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  // Modals
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Schedule form state
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<string>("2026-11-13");
  const [scheduleTime, setScheduleTime] = useState<string>("10:00");
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const [calRes, approvedRes] = await Promise.all([
        publishingApi.getCalendarSchedule(),
        postsApi.getPosts({ status: "APPROVED" }),
      ]);
      setPosts(calRes.data);
      setApprovedPosts(approvedRes.data);
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, []);

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleString(locale, {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const days: { date: Date; isCurrentMonth: boolean; dateKey: string }[] = [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      days.push({ date: d, isCurrentMonth: false, dateKey: key });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ date: d, isCurrentMonth: true, dateKey: key });
    }

    // Next month padding to fill grid (35 or 42 cells)
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      days.push({ date: d, isCurrentMonth: false, dateKey: key });
    }

    return days;
  }, [year, month, firstDayIndex, daysInMonth]);

  // Posts mapped by dateKey
  const postsByDate = useMemo(() => {
    const map = new Map<string, Post[]>();
    posts.forEach((p) => {
      const targetDate = p.scheduledAt || p.publishedAt;
      if (targetDate) {
        const d = new Date(targetDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const existing = map.get(key) || [];
        map.set(key, [...existing, p]);
      }
    });
    return map;
  }, [posts]);

  // Status counts
  const scheduledCount = posts.filter((p) => p.status === "SCHEDULED").length;
  const publishedCount = posts.filter((p) => p.status === "PUBLISHED").length;
  const failedCount = posts.filter((p) => p.status === "FAILED").length;

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 10, 11)); // Anchored to platform mock current date
  };

  const handleOpenScheduleModal = (presetDateKey?: string) => {
    if (presetDateKey) {
      setScheduleDate(presetDateKey);
    }
    setScheduleError(null);
    if (approvedPosts.length > 0 && !selectedPostId) {
      setSelectedPostId(approvedPosts[0].id);
    }
    setIsScheduleModalOpen(true);
  };

  const handleConfirmSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId) {
      setScheduleError(t.calendar.noApprovedPostsToSchedule);
      return;
    }

    const scheduledIso = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();

    try {
      setActionLoading("schedule");
      await publishingApi.schedulePost({
        postId: selectedPostId,
        scheduledAt: scheduledIso,
      });
      setStatusMessage("Post scheduled successfully on publication calendar.");
      setIsScheduleModalOpen(false);
      await fetchCalendarData();
    } catch (err: any) {
      setScheduleError(err?.message || t.common.errorOccurred);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSchedule = async (postId: string) => {
    try {
      setActionLoading("cancel");
      await publishingApi.cancelSchedule(postId);
      setStatusMessage("Publication schedule cancelled. Post returned to Approved draft.");
      setSelectedPost(null);
      await fetchCalendarData();
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetryPublishing = async (postId: string) => {
    try {
      setActionLoading("retry");
      const res = await publishingApi.retryPublish(postId);
      setStatusMessage("Publication retried and published successfully!");
      setSelectedPost(res.data);
      await fetchCalendarData();
    } catch (err: any) {
      setStatusMessage(err?.message || "Publishing retry failed.");
    } finally {
      setActionLoading(null);
    }
  };

  const handlePublishNow = async (postId: string) => {
    try {
      setActionLoading("publishNow");
      const res = await publishingApi.publishNow(postId);
      setStatusMessage("Post published immediately to connected channel!");
      setSelectedPost(res.data);
      await fetchCalendarData();
    } catch (err: any) {
      setStatusMessage(err?.message || "Immediate publishing failed.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-cyan-400" />
            {t.calendar.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.calendar.subtitle}
          </p>
        </div>

        <button
          onClick={() => handleOpenScheduleModal()}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/25 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.calendar.schedulePostBtn}
        </button>
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

      {/* KPI & Timezone Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {t.calendar.scheduledPostsCount}
            </div>
            <div className="text-xl font-bold text-white">
              {scheduledCount}{" "}
              <span className="text-xs font-normal text-slate-400">queued</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {t.calendar.publishedPostsCount}
            </div>
            <div className="text-xl font-bold text-white">
              {publishedCount}{" "}
              <span className="text-xs font-normal text-slate-400">live</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">
              {t.calendar.failedPostsCount}
            </div>
            <div className="text-xl font-bold text-white">
              {failedCount}{" "}
              <span className="text-xs font-normal text-slate-400">issues</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-violet-400" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-400 font-medium truncate">
              Server Timezone
            </div>
            <div className="text-xs font-mono font-semibold text-slate-200 truncate">
              Europe/Istanbul (UTC+03)
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Controls & Month Switcher */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition"
              title={t.calendar.prev}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 transition"
            >
              {t.calendar.today}
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 transition"
              title={t.calendar.next}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg font-bold text-white capitalize">
            {monthName}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "month"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.calendar.monthView}
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "week"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.calendar.weekView}
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Day of Week Header */}
        <div className="grid grid-cols-7 border-b border-white/10 text-center text-xs font-semibold text-slate-400 bg-white/[0.02]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/5">
          {calendarDays.map((dayObj, index) => {
            const dayPosts = postsByDate.get(dayObj.dateKey) || [];
            const isToday =
              dayObj.date.getFullYear() === 2026 &&
              dayObj.date.getMonth() === 10 &&
              dayObj.date.getDate() === 11;

            return (
              <div
                key={index}
                onClick={() => handleOpenScheduleModal(dayObj.dateKey)}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition group cursor-pointer ${
                  dayObj.isCurrentMonth
                    ? "bg-slate-900/20 hover:bg-white/[0.03]"
                    : "bg-slate-950/40 text-slate-600 opacity-60"
                } ${isToday ? "ring-1 ring-inset ring-violet-500/50 bg-violet-950/10" : ""}`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isToday
                        ? "bg-violet-600 text-white font-bold"
                        : dayObj.isCurrentMonth
                        ? "text-slate-300"
                        : "text-slate-600"
                    }`}
                  >
                    {dayObj.date.getDate()}
                  </span>

                  {dayPosts.length > 0 && (
                    <span className="text-[10px] font-mono text-slate-500">
                      {dayPosts.length}
                    </span>
                  )}
                </div>

                {/* Day Posts List */}
                <div className="space-y-1.5 flex-1">
                  {dayPosts.map((post) => {
                    const isInstagram = post.platform === "INSTAGRAM";
                    return (
                      <div
                        key={post.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                        }}
                        className={`p-1.5 rounded-lg border text-[11px] leading-tight font-medium transition cursor-pointer flex items-center gap-1.5 truncate shadow-sm ${
                          post.status === "SCHEDULED"
                            ? "bg-blue-500/15 border-blue-500/30 text-blue-200 hover:border-blue-400"
                            : post.status === "PUBLISHED"
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-200 hover:border-emerald-400"
                            : post.status === "FAILED"
                            ? "bg-rose-500/20 border-rose-500/40 text-rose-200 hover:border-rose-400"
                            : "bg-slate-800/60 border-slate-700 text-slate-300"
                        }`}
                      >
                        {isInstagram ? (
                          <Instagram className="w-3 h-3 shrink-0 text-pink-400" />
                        ) : (
                          <Facebook className="w-3 h-3 shrink-0 text-blue-400" />
                        )}
                        <span className="truncate">
                          {post.currentVersion?.title || "Untitled Post"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Hover Add hint */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 text-end pt-1">
                  + Schedule
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Schedule Post Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {t.calendar.scheduleModalTitle}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Server Authoritative • Europe/Istanbul Timezone
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {scheduleError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{scheduleError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              {/* Select Approved Post */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.calendar.selectApprovedPost}
                </label>
                {approvedPosts.length === 0 ? (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                    {t.calendar.noApprovedPostsToSchedule}
                  </div>
                ) : (
                  <select
                    value={selectedPostId}
                    onChange={(e) => setSelectedPostId(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                  >
                    {approvedPosts.map((post) => (
                      <option
                        key={post.id}
                        value={post.id}
                        className="bg-slate-900 text-white"
                      >
                        [{post.platform}] {post.currentVersion.title} (
                        {post.campaignName})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Time (UTC+03:00)
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Info className="w-3.5 h-3.5 text-violet-400" />
                  <span>{t.calendar.minScheduleNotice}</span>
                </div>
                <p>{t.calendar.timezoneNotice}</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  disabled={actionLoading === "schedule"}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={
                    actionLoading === "schedule" || approvedPosts.length === 0
                  }
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white shadow-lg shadow-violet-600/25 transition flex items-center gap-2"
                >
                  {actionLoading === "schedule" && (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  )}
                  {t.calendar.confirmSchedule}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Inspector Modal (WEB-03-03) */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl p-2 flex items-center justify-center ${
                    selectedPost.platform === "INSTAGRAM"
                      ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {selectedPost.platform === "INSTAGRAM" ? (
                    <Instagram className="w-6 h-6" />
                  ) : (
                    <Facebook className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedPost.currentVersion?.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedPost.campaignName} •{" "}
                    {selectedPost.platform === "INSTAGRAM"
                      ? "Instagram Professional"
                      : "Facebook Business Page"}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              {selectedPost.status === "SCHEDULED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedPost.status}
                </span>
              ) : selectedPost.status === "PUBLISHED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedPost.status}
                </span>
              ) : selectedPost.status === "FAILED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {selectedPost.status}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/40 text-slate-300 border border-slate-600/30">
                  {selectedPost.status}
                </span>
              )}
            </div>

            {/* FAILED PUBLISHING DIAGNOSTIC BOX */}
            {selectedPost.status === "FAILED" && selectedPost.publishingError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  {t.calendar.failureReasonLabel}
                </div>
                <p className="text-xs text-rose-200 leading-relaxed font-mono">
                  {selectedPost.publishingError}
                </p>
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[11px] text-rose-400">
                    Fix required in Integrations before retry.
                  </span>
                  <button
                    onClick={() => handleRetryPublishing(selectedPost.id)}
                    disabled={actionLoading === "retry"}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500 hover:bg-rose-400 text-white flex items-center gap-1.5 transition"
                  >
                    <RotateCcw
                      className={`w-3.5 h-3.5 ${actionLoading === "retry" ? "animate-spin" : ""}`}
                    />
                    {t.calendar.retryPublishing}
                  </button>
                </div>
              </div>
            )}

            {/* PUBLISHED SUCCESS BOX */}
            {selectedPost.status === "PUBLISHED" && (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Published Live to Social Network
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {selectedPost.publishedAt
                      ? new Date(selectedPost.publishedAt).toLocaleString(locale)
                      : "Timestamp confirmed"}
                  </div>
                </div>

                {selectedPost.externalPostUrl && (
                  <a
                    href={selectedPost.externalPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t.calendar.viewOnSocial}
                  </a>
                )}
              </div>
            )}

            {/* Post Content Details */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Caption
                </span>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.currentVersion?.caption}
                </p>
              </div>

              {selectedPost.currentVersion?.hashtags?.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Hashtags
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedPost.currentVersion.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPost.currentVersion?.callToAction && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                    Call to Action
                  </span>
                  <p className="text-xs font-semibold text-cyan-300">
                    {selectedPost.currentVersion.callToAction}
                  </p>
                </div>
              )}

              {selectedPost.scheduledAt && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span>Scheduled Publication:</span>
                  <span className="font-mono text-slate-200 font-semibold">
                    {new Date(selectedPost.scheduledAt).toLocaleString(locale)}
                  </span>
                </div>
              )}
            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
              {selectedPost.status === "SCHEDULED" ? (
                <>
                  <button
                    onClick={() => handleCancelSchedule(selectedPost.id)}
                    disabled={actionLoading === "cancel"}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition flex items-center gap-1.5"
                  >
                    {actionLoading === "cancel" && (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    )}
                    {t.calendar.cancelSchedule}
                  </button>
                  <button
                    onClick={() => handlePublishNow(selectedPost.id)}
                    disabled={actionLoading === "publishNow"}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/25 transition flex items-center gap-1.5"
                  >
                    {actionLoading === "publishNow" ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    {t.calendar.publishNow}
                  </button>
                </>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
