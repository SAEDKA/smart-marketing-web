"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { notificationsApi } from "@/lib/api/notifications.api";
import { NotificationCategory, NotificationItem } from "@/types/domain";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  ShieldAlert,
  Info,
  Trash2,
  ExternalLink,
  Check,
  RefreshCw,
  Filter,
} from "lucide-react";

export default function NotificationsPage() {
  const { t, locale } = useI18n();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    NotificationCategory | "ALL"
  >("ALL");
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationsApi.getNotifications();
      setNotifications(res.data);
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch {
      setStatusMessage(t.common.errorOccurred);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setStatusMessage("All notifications marked as read.");
    } catch {
      setStatusMessage(t.common.errorOccurred);
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {
      setStatusMessage(t.common.errorOccurred);
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    selectedCategory === "ALL" ? true : n.category === selectedCategory
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case "PUBLISHING":
        return <Calendar className="w-4 h-4 text-cyan-400" />;
      case "AI_STUDIO":
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      case "SECURITY":
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case "SYSTEM":
        return <Info className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Bell className="w-7 h-7 text-violet-400" />
            <span>{t.notifications.title}</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 tabular-nums-metric">
                {unreadCount} Unread
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.notifications.subtitle}
          </p>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          className="self-start md:self-auto px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 disabled:opacity-40 text-slate-200 border border-white/10 transition flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5 text-cyan-400" />
          {t.notifications.markAllRead}
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

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: "ALL", label: t.notifications.filterAll },
            { id: "PUBLISHING", label: t.notifications.filterPublishing },
            { id: "AI_STUDIO", label: t.notifications.filterAi },
            { id: "SECURITY", label: t.notifications.filterSecurity },
            { id: "SYSTEM", label: t.notifications.filterSystem },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === tab.id
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                : "bg-slate-900/60 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-white/10 space-y-2">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">
              {t.notifications.noNotifications}
            </div>
            <p className="text-xs text-slate-500">{t.notifications.emptyDesc}</p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border backdrop-blur-xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !n.isRead
                  ? "bg-slate-900/80 border-violet-500/30 shadow-lg shadow-violet-950/20"
                  : "bg-slate-900/40 border-white/5 opacity-80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(n.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    {n.message}
                  </p>
                  <div className="text-[10px] text-slate-500 font-mono pt-0.5">
                    {new Date(n.createdAt).toLocaleString(locale)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {n.actionUrl && (
                  <Link
                    href={n.actionUrl}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 transition flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {t.notifications.viewAction}
                  </Link>
                )}

                {!n.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                  </button>
                )}

                <button
                  onClick={() => handleDeleteNotification(n.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition"
                  title={t.notifications.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
