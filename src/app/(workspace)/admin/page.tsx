"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { useI18n } from "@/lib/i18n/context";
import { adminApi } from "@/lib/api/admin.api";
import {
  AdminAuditLog,
  AdminComplaintTicket,
  AdminSystemHealth,
  AdminTenant,
  AdminTrafficAnalytics,
  ComplaintStatus,
} from "@/types/domain";
import { UnauthorizedView } from "@/components/layout/UnauthorizedView";
import {
  ShieldCheck,
  Building,
  Sparkles,
  AlertTriangle,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  RefreshCw,
  Activity,
  Cpu,
  Search,
  Users,
  MessageSquareWarning,
  Terminal,
  Globe,
  Eye,
  Clock,
  TrendingUp,
  Send,
  Megaphone,
  Check,
} from "lucide-react";

type AdminTab = "overview" | "traffic" | "tenants" | "complaints" | "operations";

const ADMIN_COPY = {
  en: {
    pageTitle: "System Administration & Platform Analytics",
    pageSubtitle:
      "Monitor website visitors, platform usage, registered companies, customer complaints, and administrative commands.",
    tabOverview: "Platform Overview",
    tabTraffic: "Visitors & Usage",
    tabTenants: "Companies",
    tabComplaints: "Complaints & Support",
    tabOperations: "Admin Commands & Logs",
    visitors30d: "Website Visitors (30d)",
    liveNow: "Active right now",
    registeredCompanies: "Registered Companies",
    activeCompaniesSub: "Active workspaces",
    openComplaints: "Open Customer Tickets",
    needsResponseSub: "Awaiting admin reply",
    systemHealth: "Infrastructure Status",
    pageViews30d: "Total Page Views (30d)",
    avgSession: "Avg. Session Duration",
    signupConversion: "Visitor-to-Signup Rate",
    dailyTrafficTitle: "Daily Website Visitors & Signups (Last 7 Days)",
    dailyTrafficSub: "Unique visitors, page views, and new company registrations",
    featureUsageTitle: "Most Used Platform Modules",
    featureUsageSub: "Share of customer activity across platform tools",
    regionsTitle: "Visitors by Geographic Region",
    regionsSub: "Distribution of website traffic across key markets",
    recentComplaintsTitle: "Latest Customer Complaints",
    viewAllComplaints: "View All Tickets",
    recentCompaniesTitle: "Recently Active Companies",
    manageAllCompanies: "Manage All Companies",
    filterAll: "All",
    filterOpen: "Open",
    filterInProgress: "In Progress",
    filterResolved: "Resolved",
    filterActive: "Active",
    filterSuspended: "Suspended",
    replyPlaceholder: "Write an official response to the customer...",
    sendReplyResolve: "Send Reply & Mark Resolved",
    markInProgress: "Mark In Progress",
    adminReplyLabel: "Admin Response:",
    broadcastTitle: "Broadcast Announcement to All Companies",
    broadcastSub:
      "Send an instant system notification to all active company owners.",
    broadcastSubjectPlaceholder: "Announcement title (e.g. Scheduled Maintenance or New Feature)",
    broadcastMsgPlaceholder: "Enter the message to deliver to all company workspaces...",
    sendBroadcastBtn: "Send Announcement to All Companies",
    auditLogsTitle: "Administrative Audit Trail & Security Logs",
    auditLogsSub: "Chronological record of root actions and infrastructure events",
    visitorsUnit: "visitors",
    viewsUnit: "views",
    signupsUnit: "signups",
    sessionsUnit: "sessions",
  },
  tr: {
    pageTitle: "Sistem Yönetimi ve Platform Analitiği",
    pageSubtitle:
      "Web sitesi ziyaretçilerini, platform kullanımını, kayıtlı şirketleri, müşteri şikayetlerini ve yönetim komutlarını izleyin.",
    tabOverview: "Genel Bakış",
    tabTraffic: "Ziyaretçi ve Kullanım",
    tabTenants: "Şirketler",
    tabComplaints: "Müşteri Şikayetleri",
    tabOperations: "Komutlar ve Kayıtlar",
    visitors30d: "Site Ziyaretçileri (30G)",
    liveNow: "Şu an aktif",
    registeredCompanies: "Kayıtlı Şirketler",
    activeCompaniesSub: "Aktif çalışma alanı",
    openComplaints: "Açık Müşteri Talepleri",
    needsResponseSub: "Yönetici yanıtı bekliyor",
    systemHealth: "Altyapı Durumu",
    pageViews30d: "Toplam Sayfa Görüntüleme",
    avgSession: "Ort. Oturum Süresi",
    signupConversion: "Kayıt Dönüşüm Oranı",
    dailyTrafficTitle: "Günlük Ziyaretçi ve Yeni Şirket Kayıtları (Son 7 Gün)",
    dailyTrafficSub: "Tekil ziyaretçiler, sayfa görüntülemeleri ve yeni kayıtlar",
    featureUsageTitle: "En Çok Kullanılan Platform Özellikleri",
    featureUsageSub: "Müşterilerin platform araçlarındaki kullanım dağılımı",
    regionsTitle: "Bölgelere Göre Ziyaretçi Dağılımı",
    regionsSub: "Ana pazarlara göre web sitesi trafiği",
    recentComplaintsTitle: "Son Müşteri Şikayetleri",
    viewAllComplaints: "Tüm Talepleri Gör",
    recentCompaniesTitle: "Kayıtlı Şirketler Özeti",
    manageAllCompanies: "Tüm Şirketleri Yönet",
    filterAll: "Tümü",
    filterOpen: "Açık",
    filterInProgress: "İşlemde",
    filterResolved: "Çözüldü",
    filterActive: "Aktif",
    filterSuspended: "Askıda",
    replyPlaceholder: "Müşteriye resmi yanıtınızı yazın...",
    sendReplyResolve: "Yanıtı Gönder ve Çözüldü İşaretle",
    markInProgress: "İşleme Al",
    adminReplyLabel: "Yönetici Yanıtı:",
    broadcastTitle: "Tüm Şirketlere Sistem Duyurusu Gönder",
    broadcastSub:
      "Tüm aktif şirket sahiplerine anında sistem bildirimi gönderin.",
    broadcastSubjectPlaceholder: "Duyuru başlığı (örn. Yeni Özellik veya Planlı Bakım)",
    broadcastMsgPlaceholder: "Tüm şirketlere iletilecek duyuru metnini yazın...",
    sendBroadcastBtn: "Duyuruyu Tüm Şirketlere Gönder",
    auditLogsTitle: "Yönetim Denetim İzi ve Güvenlik Kayıtları",
    auditLogsSub: "Yönetici işlemlerinin ve sistem olaylarının kronolojik kaydı",
    visitorsUnit: "ziyaretçi",
    viewsUnit: "görüntüleme",
    signupsUnit: "kayıt",
    sessionsUnit: "oturum",
  },
  ar: {
    pageTitle: "لوحة إدارة النظام وتحليلات المنصة",
    pageSubtitle:
      "متابعة عدد زوار الموقع، تحليلات استخدام الميزات، إدارة الشركات والعملاء، معالجة الشكاوى، وتنفيذ الأوامر الإدارية.",
    tabOverview: "نظرة عامة",
    tabTraffic: "الزوار واستخدام الموقع",
    tabTenants: "إدارة الشركات",
    tabComplaints: "شكاوى العملاء",
    tabOperations: "الأوامر الإدارية والسجلات",
    visitors30d: "زوار الموقع (30 يوماً)",
    liveNow: "متصل الآن",
    registeredCompanies: "الشركات المسجلة",
    activeCompaniesSub: "شركة نشطة",
    openComplaints: "شكاوى بانتظار الرد",
    needsResponseSub: "تحتاج لمراجعة الإدارة",
    systemHealth: "حالة الخوادم والنظام",
    pageViews30d: "إجمالي مشاهدات الصفحات",
    avgSession: "متوسط مدة الجلسة",
    signupConversion: "معدل تسجيل الشركات",
    dailyTrafficTitle: "حركة زوار الموقع وتسجيل الشركات اليومية (آخر 7 أيام)",
    dailyTrafficSub: "عدد الزوار الفريدين ومشاهدات الصفحات والشركات الجديدة كل يوم",
    featureUsageTitle: "أكثر أقسام الموقع استخداماً من قبل العملاء",
    featureUsageSub: "نسبة استخدام أدوات المنصة بين أصحاب الشركات",
    regionsTitle: "توزيع زوار الموقع حسب الدول",
    regionsSub: "نسبة الزيارات حسب الأسواق الرئيسية",
    recentComplaintsTitle: "أحدث شكاوى واستفسارات العملاء",
    viewAllComplaints: "عرض جميع الشكاوى",
    recentCompaniesTitle: "أحدث الشركات المسجلة في المنصة",
    manageAllCompanies: "إدارة جميع الشركات",
    filterAll: "الكل",
    filterOpen: "مفتوحة",
    filterInProgress: "قيد المعالجة",
    filterResolved: "تم الحل",
    filterActive: "نشط",
    filterSuspended: "موقوف",
    replyPlaceholder: "اكتب رد الإدارة الرسمي على شكوى العميل...",
    sendReplyResolve: "إرسال الرد وإنهاء الشكوى",
    markInProgress: "تحويل لقيد المعالجة",
    adminReplyLabel: "رد الإدارة:",
    broadcastTitle: "إرسال تنبيه أو إعلان عام لجميع الشركات",
    broadcastSub:
      "إرسال إشعار إداري فوري يظهر لجميع أصحاب الشركات المسجلين في المنصة.",
    broadcastSubjectPlaceholder: "عنوان الإعلان (مثال: تحديث جديد أو صيانة مجدولة)",
    broadcastMsgPlaceholder: "اكتب نص الرسالة أو التنبيه الموجه لأصحاب الشركات...",
    sendBroadcastBtn: "إرسال الإعلان لجميع الشركات",
    auditLogsTitle: "سجل العمليات الإدارية والأمان",
    auditLogsSub: "سجل زمني موثق لجميع الأوامر الإدارية وحالة الخوادم",
    visitorsUnit: "زائر",
    viewsUnit: "مشاهدة",
    signupsUnit: "شركة جديدة",
    sessionsUnit: "جلسة",
  },
} as const;

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const copy = ADMIN_COPY[locale];

  const activeTab = (searchParams.get("tab") as AdminTab) || "overview";

  const [health, setHealth] = useState<AdminSystemHealth | null>(null);
  const [traffic, setTraffic] = useState<AdminTrafficAnalytics | null>(null);
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [complaints, setComplaints] = useState<AdminComplaintTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters & Form States
  const [tenantSearch, setTenantSearch] = useState("");
  const [tenantStatusFilter, setTenantStatusFilter] = useState<
    "ALL" | "ACTIVE" | "SUSPENDED"
  >("ALL");
  const [complaintFilter, setComplaintFilter] = useState<
    "ALL" | ComplaintStatus
  >("ALL");
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sensitive operation confirmation modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "SUSPEND" | "REACTIVATE" | "PURGE_QUEUE" | "FLUSH_CACHE";
    tenant?: AdminTenant;
  }>({ isOpen: false, type: "SUSPEND" });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [healthRes, trafficRes, tenantsRes, complaintsRes, logsRes] =
        await Promise.all([
          adminApi.getHealth(),
          adminApi.getTrafficAnalytics(),
          adminApi.getTenants(),
          adminApi.getComplaints(),
          adminApi.getAuditLogs(),
        ]);
      setHealth(healthRes.data);
      setTraffic(trafficRes.data);
      setTenants(tenantsRes.data);
      setComplaints(complaintsRes.data);
      setAuditLogs(logsRes.data);
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user.role === "SYSTEM_ADMIN") {
      fetchAdminData();
    }
  }, [session?.user.role]);

  // Role Gate: Ordinary users see UnauthorizedView
  if (session?.user.role !== "SYSTEM_ADMIN") {
    return <UnauthorizedView />;
  }

  const setTab = (tab: AdminTab) => {
    router.push(`/admin?tab=${tab}`);
  };

  const handleExecuteOperation = async () => {
    try {
      setActionLoading("execute");
      if (confirmModal.type === "SUSPEND" && confirmModal.tenant) {
        await adminApi.suspendTenant(confirmModal.tenant.id);
        setStatusMessage(
          locale === "ar"
            ? `تم إيقاف حساب شركة ${confirmModal.tenant.companyName} بنجاح.`
            : `Tenant ${confirmModal.tenant.companyName} has been suspended.`
        );
      } else if (confirmModal.type === "REACTIVATE" && confirmModal.tenant) {
        await adminApi.reactivateTenant(confirmModal.tenant.id);
        setStatusMessage(
          locale === "ar"
            ? `تمت إعادة تفعيل حساب شركة ${confirmModal.tenant.companyName} بنجاح.`
            : `Tenant ${confirmModal.tenant.companyName} reactivated successfully.`
        );
      } else if (confirmModal.type === "PURGE_QUEUE") {
        const res = await adminApi.purgePublishingQueue();
        setStatusMessage(
          locale === "ar"
            ? `تم تفريغ طابور النشر وإزالة ${res.data.purgedCount} مهام معلقة.`
            : `Publishing queue purged. ${res.data.purgedCount} stalled jobs cleared.`
        );
      } else if (confirmModal.type === "FLUSH_CACHE") {
        const res = await adminApi.flushAiCache();
        setStatusMessage(
          locale === "ar"
            ? `تم مسح الذاكرة المؤقتة للذكاء الاصطناعي (${res.data.evictedEntries} سجل).`
            : `Neural cache flushed. ${res.data.evictedEntries} cached embeddings evicted.`
        );
      }
      setConfirmModal({ isOpen: false, type: "SUSPEND" });
      await fetchAdminData();
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReplyComplaint = async (
    ticket: AdminComplaintTicket,
    nextStatus: ComplaintStatus
  ) => {
    const replyText = replyDrafts[ticket.id]?.trim();
    try {
      setActionLoading(ticket.id);
      await adminApi.replyToComplaint(ticket.id, {
        status: nextStatus,
        adminReply: replyText || ticket.adminReply,
      });
      setReplyDrafts((prev) => ({ ...prev, [ticket.id]: "" }));
      setStatusMessage(
        locale === "ar"
          ? `تم تحديث حالة الشكوى (${ticket.id}) وإرسال الرد للعميل.`
          : `Ticket ${ticket.id} updated to ${nextStatus}.`
      );
      await fetchAdminData();
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    try {
      setActionLoading("broadcast");
      const res = await adminApi.broadcastAnnouncement({
        title: broadcastTitle.trim(),
        message: broadcastMessage.trim(),
      });
      setBroadcastTitle("");
      setBroadcastMessage("");
      setStatusMessage(
        locale === "ar"
          ? `تم إرسال الإعلان العام بنجاح إلى ${res.data.deliveredTenants} شركة نشطة.`
          : `Announcement broadcasted to ${res.data.deliveredTenants} active companies.`
      );
      await fetchAdminData();
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTenants = tenants.filter((item) => {
    const matchesSearch =
      item.companyName.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      item.ownerEmail.toLowerCase().includes(tenantSearch.toLowerCase()) ||
      item.ownerName.toLowerCase().includes(tenantSearch.toLowerCase());
    const matchesStatus =
      tenantStatusFilter === "ALL" || item.status === tenantStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredComplaints = complaints.filter(
    (c) => complaintFilter === "ALL" || c.status === complaintFilter
  );

  const openComplaintsCount = complaints.filter(
    (c) => c.status !== "RESOLVED"
  ).length;

  const maxDailyVisitors = Math.max(
    ...(traffic?.dailyTraffic.map((d) => d.visitors) || [6000]),
    6000
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-accent-cyan" />
            <span>{copy.pageTitle}</span>
          </h1>
          <p className="text-sm text-txt-secondary mt-1 max-w-2xl">
            {copy.pageSubtitle}
          </p>
        </div>

        {/* Quick Administrative Actions */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setConfirmModal({ isOpen: true, type: "FLUSH_CACHE" })}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
            <span>{t.admin.flushCache}</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmModal({ isOpen: true, type: "PURGE_QUEUE" })}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-semantic-error/15 hover:bg-semantic-error/25 text-semantic-error border border-semantic-error/30 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.admin.purgeQueue}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10">
        {(
          [
            { id: "overview", label: copy.tabOverview, icon: ShieldCheck },
            { id: "traffic", label: copy.tabTraffic, icon: Activity },
            { id: "tenants", label: copy.tabTenants, icon: Users },
            {
              id: "complaints",
              label: copy.tabComplaints,
              icon: MessageSquareWarning,
              badge: openComplaintsCount,
            },
            { id: "operations", label: copy.tabOperations, icon: Terminal },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all shrink-0 ${
                isCurrent
                  ? "border-accent-violet/40 text-white bg-accent-violet/20 shadow-glow-violet"
                  : "border-transparent text-txt-secondary hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 text-accent-cyan" />
              <span>{tab.label}</span>
              {"badge" in tab && tab.badge ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-violet/30 text-white">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Feedback Banner */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-accent-violet/15 border border-accent-violet/40 text-white text-xs sm:text-sm flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />
            <span>{statusMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-accent-cyan hover:text-white text-xs font-bold"
          >
            {t.common.close}
          </button>
        </div>
      )}

      {/* TAB 1: PLATFORM OVERVIEW */}
      {activeTab === "overview" && health && traffic && (
        <div className="space-y-6">
          {/* 4 Main Overview KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setTab("traffic")}
              className="glass-card-interactive p-5 space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-txt-secondary">
                  {copy.visitors30d}
                </span>
                <Globe className="w-4 h-4 text-accent-cyan" />
              </div>
              <div className="text-2xl font-bold text-white tabular-nums-metric">
                {traffic.totalVisitors30d.toLocaleString()}{" "}
                <span className="text-xs font-semibold text-semantic-success">
                  +{traffic.visitorsGrowthPercent}%
                </span>
              </div>
              <div className="text-[11px] text-accent-cyan font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
                <span>
                  {traffic.activeLiveVisitors} {copy.liveNow}
                </span>
              </div>
            </div>

            <div
              onClick={() => setTab("tenants")}
              className="glass-card-interactive p-5 space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-txt-secondary">
                  {copy.registeredCompanies}
                </span>
                <Building className="w-4 h-4 text-accent-violet" />
              </div>
              <div className="text-2xl font-bold text-white tabular-nums-metric">
                {health.totalTenants}{" "}
                <span className="text-xs font-normal text-semantic-success">
                  ({health.activeTenants} {copy.activeCompaniesSub})
                </span>
              </div>
              <div className="text-[11px] text-txt-muted font-mono">
                {t.admin.aiTokens}: {health.aiTokensConsumed.toLocaleString()}
              </div>
            </div>

            <div
              onClick={() => setTab("complaints")}
              className="glass-card-interactive p-5 space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-txt-secondary">
                  {copy.openComplaints}
                </span>
                <MessageSquareWarning className="w-4 h-4 text-semantic-warning" />
              </div>
              <div className="text-2xl font-bold text-white tabular-nums-metric">
                {openComplaintsCount}
              </div>
              <div className="text-[11px] text-semantic-warning font-mono">
                {copy.needsResponseSub}
              </div>
            </div>

            <div
              onClick={() => setTab("operations")}
              className="glass-card-interactive p-5 space-y-3 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-txt-secondary">
                  {copy.systemHealth}
                </span>
                <CheckCircle2 className="w-4 h-4 text-semantic-success" />
              </div>
              <div className="text-sm font-bold text-semantic-success flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
                <span>Meta API: {health.metaApiStatus}</span>
              </div>
              <div className="text-[11px] text-txt-secondary font-mono">
                DB Latency: {health.dbLatencyMs}ms &bull; {health.queuedPublishJobs} Jobs
              </div>
            </div>
          </div>

          {/* Two-Column Quick Overview: Recent Complaints & Companies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Latest Customer Complaints */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <MessageSquareWarning className="w-4 h-4 text-semantic-warning" />
                  <span>{copy.recentComplaintsTitle}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setTab("complaints")}
                  className="text-xs font-semibold text-accent-cyan hover:underline"
                >
                  {copy.viewAllComplaints}
                </button>
              </div>

              <div className="space-y-3">
                {complaints.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white">
                        {item.subject}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === "OPEN"
                            ? "bg-semantic-warning/20 text-semantic-warning border border-semantic-warning/30"
                            : item.status === "IN_PROGRESS"
                            ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                            : "bg-semantic-success/20 text-semantic-success border border-semantic-success/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-txt-secondary line-clamp-2">
                      {item.message}
                    </p>
                    <div className="text-[10px] font-mono text-txt-muted">
                      {item.companyName} &bull; {item.ownerEmail}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Registered Companies */}
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-cyan" />
                  <span>{copy.recentCompaniesTitle}</span>
                </h2>
                <button
                  type="button"
                  onClick={() => setTab("tenants")}
                  className="text-xs font-semibold text-accent-cyan hover:underline"
                >
                  {copy.manageAllCompanies}
                </button>
              </div>

              <div className="space-y-3">
                {tenants.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {item.companyName}
                      </p>
                      <p className="text-[11px] text-txt-muted truncate">
                        {item.ownerName} ({item.ownerEmail})
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-txt-secondary border border-white/10">
                        {item.plan}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.status === "ACTIVE"
                            ? "bg-semantic-success/20 text-semantic-success"
                            : "bg-semantic-error/20 text-semantic-error"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBSITE TRAFFIC & PLATFORM USAGE ANALYTICS */}
      {activeTab === "traffic" && traffic && (
        <div className="space-y-6">
          {/* 4 Traffic KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-txt-secondary">
                <span>{copy.visitors30d}</span>
                <Users className="w-4 h-4 text-accent-cyan" />
              </div>
              <p className="text-2xl font-bold text-white tabular-nums-metric">
                {traffic.totalVisitors30d.toLocaleString()}
              </p>
              <span className="text-xs text-semantic-success font-semibold">
                +{traffic.visitorsGrowthPercent}% vs prev. 30d
              </span>
            </div>

            <div className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-txt-secondary">
                <span>{copy.pageViews30d}</span>
                <Eye className="w-4 h-4 text-accent-violet" />
              </div>
              <p className="text-2xl font-bold text-white tabular-nums-metric">
                {traffic.totalPageViews30d.toLocaleString()}
              </p>
              <span className="text-xs text-accent-cyan font-mono">
                {traffic.activeLiveVisitors} {copy.liveNow}
              </span>
            </div>

            <div className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-txt-secondary">
                <span>{copy.avgSession}</span>
                <Clock className="w-4 h-4 text-accent-mint" />
              </div>
              <p className="text-2xl font-bold text-white tabular-nums-metric">
                {traffic.avgSessionDuration}
              </p>
              <span className="text-xs text-txt-muted font-mono">
                High workspace retention
              </span>
            </div>

            <div className="glass-card p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-txt-secondary">
                <span>{copy.signupConversion}</span>
                <TrendingUp className="w-4 h-4 text-semantic-success" />
              </div>
              <p className="text-2xl font-bold text-white tabular-nums-metric">
                {traffic.signupConversionRate}%
              </p>
              <span className="text-xs text-semantic-success font-mono">
                +1.2% conversion lift
              </span>
            </div>
          </div>

          {/* Daily Visitors Bar & Telemetry Chart */}
          <div className="glass-card p-6 space-y-5">
            <div>
              <h2 className="text-base font-bold text-white">
                {copy.dailyTrafficTitle}
              </h2>
              <p className="text-xs text-txt-secondary mt-0.5">
                {copy.dailyTrafficSub}
              </p>
            </div>

            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-52 pt-6 px-2 border-b border-white/10 pb-4">
              {traffic.dailyTraffic.map((day) => {
                const heightPct = Math.round(
                  (day.visitors / maxDailyVisitors) * 100
                );
                return (
                  <div
                    key={day.date}
                    className="flex flex-col items-center justify-end h-full gap-2 group"
                  >
                    <span className="text-[10px] font-mono text-accent-cyan tabular-nums-metric">
                      {day.visitors.toLocaleString()}
                    </span>
                    <div className="w-full max-w-[44px] bg-white/5 rounded-t-xl overflow-hidden flex items-end h-32">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full bg-gradient-to-t from-accent-violet to-accent-cyan rounded-t-xl transition-all group-hover:opacity-90"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-semibold text-white">
                        {day.date}
                      </p>
                      <p className="text-[10px] text-semantic-success font-mono">
                        +{day.signups} {copy.signupsUnit}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feature Usage Breakdown & Geographic Regions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {copy.featureUsageTitle}
                </h3>
                <p className="text-xs text-txt-secondary">
                  {copy.featureUsageSub}
                </p>
              </div>
              <div className="space-y-4 pt-2">
                {traffic.featureUsage.map((feat) => (
                  <div key={feat.featureKey} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        {feat.featureName}
                      </span>
                      <span className="font-mono text-accent-cyan tabular-nums-metric">
                        {feat.usagePercent}% ({feat.sessionsCount.toLocaleString()}{" "}
                        {copy.sessionsUnit})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${feat.usagePercent}%` }}
                        className="h-full bg-gradient-to-r from-accent-violet to-accent-cyan rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">
                  {copy.regionsTitle}
                </h3>
                <p className="text-xs text-txt-secondary">{copy.regionsSub}</p>
              </div>
              <div className="space-y-4 pt-2">
                {traffic.topRegions.map((reg) => (
                  <div key={reg.country} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        {reg.country}
                      </span>
                      <span className="font-mono text-accent-mint tabular-nums-metric">
                        {reg.visitors.toLocaleString()} {copy.visitorsUnit} (
                        {reg.sharePercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${reg.sharePercent}%` }}
                        className="h-full bg-accent-mint rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPANIES & CUSTOMERS DIRECTORY */}
      {activeTab === "tenants" && (
        <div className="glass-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white">
                {t.admin.tenantsTableTitle}
              </h2>
              <p className="text-xs text-txt-secondary">
                {t.admin.tenantsTableSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <div className="inline-flex rounded-xl bg-navy-950/80 border border-white/10 p-1">
                {(
                  [
                    { id: "ALL", label: copy.filterAll },
                    { id: "ACTIVE", label: copy.filterActive },
                    { id: "SUSPENDED", label: copy.filterSuspended },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setTenantStatusFilter(f.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                      tenantStatusFilter === f.id
                        ? "bg-accent-violet text-white"
                        : "text-txt-secondary hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-txt-muted absolute start-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tenantSearch}
                  onChange={(e) => setTenantSearch(e.target.value)}
                  placeholder="Search companies or emails..."
                  className="glass-input w-full h-9 ps-9 pe-3 text-xs text-white placeholder:text-txt-muted focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-white/10 text-txt-secondary text-start">
                  <th className="py-3 px-3 font-semibold text-start">
                    {t.admin.tenantName}
                  </th>
                  <th className="py-3 px-3 font-semibold text-start">
                    {t.admin.owner}
                  </th>
                  <th className="py-3 px-3 font-semibold text-start">
                    {t.admin.plan}
                  </th>
                  <th className="py-3 px-3 font-semibold text-center">
                    {t.admin.productsCount}
                  </th>
                  <th className="py-3 px-3 font-semibold text-center">
                    {t.admin.campaignsCount}
                  </th>
                  <th className="py-3 px-3 font-semibold text-start">
                    {t.admin.status}
                  </th>
                  <th className="py-3 px-3 font-semibold text-end">
                    {t.admin.actions}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTenants.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white">
                        {item.companyName}
                      </div>
                      <div className="text-[10px] font-mono text-txt-muted">
                        {item.id}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="text-white">{item.ownerName}</div>
                      <div className="text-[10px] text-txt-secondary font-mono">
                        {item.ownerEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-accent-violet/15 text-accent-cyan border border-accent-violet/30">
                        {item.plan}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center text-white font-mono tabular-nums-metric">
                      {item.productCount}
                    </td>
                    <td className="py-3.5 px-3 text-center text-white font-mono tabular-nums-metric">
                      {item.campaignCount}
                    </td>
                    <td className="py-3.5 px-3">
                      {item.status === "ACTIVE" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-semantic-success/20 text-semantic-success border border-semantic-success/30 flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-semantic-success" />
                          ACTIVE
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-semantic-error/20 text-semantic-error border border-semantic-error/30 flex items-center gap-1 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-semantic-error" />
                          SUSPENDED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-end">
                      {item.status === "ACTIVE" ? (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              type: "SUSPEND",
                              tenant: item,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-semantic-error/15 hover:bg-semantic-error/25 text-semantic-error border border-semantic-error/30 transition inline-flex items-center gap-1"
                        >
                          <Lock className="w-3 h-3" />
                          <span>{t.admin.suspendTenant}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmModal({
                              isOpen: true,
                              type: "REACTIVATE",
                              tenant: item,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-semantic-success/15 hover:bg-semantic-success/25 text-semantic-success border border-semantic-success/30 transition inline-flex items-center gap-1"
                        >
                          <Unlock className="w-3 h-3" />
                          <span>{t.admin.reactivateTenant}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CUSTOMER COMPLAINTS & SUPPORT TICKETS */}
      {activeTab === "complaints" && (
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-navy-900 border border-white/10 p-1">
              {(
                [
                  { id: "ALL", label: copy.filterAll },
                  { id: "OPEN", label: copy.filterOpen },
                  { id: "IN_PROGRESS", label: copy.filterInProgress },
                  { id: "RESOLVED", label: copy.filterResolved },
                ] as const
              ).map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setComplaintFilter(btn.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    complaintFilter === btn.id
                      ? "bg-accent-violet text-white"
                      : "text-txt-secondary hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {filteredComplaints.map((ticket) => (
              <div
                key={ticket.id}
                className="glass-card p-6 space-y-4 border border-white/10"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-accent-cyan font-bold">
                        #{ticket.id}
                      </span>
                      <h3 className="text-base font-bold text-white">
                        {ticket.subject}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          ticket.priority === "HIGH"
                            ? "bg-semantic-error/20 text-semantic-error border border-semantic-error/30"
                            : ticket.priority === "MEDIUM"
                            ? "bg-semantic-warning/20 text-semantic-warning border border-semantic-warning/30"
                            : "bg-white/10 text-txt-secondary"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="text-xs text-txt-secondary mt-1">
                      <strong className="text-white">{ticket.companyName}</strong>{" "}
                      &bull; {ticket.ownerName} ({ticket.ownerEmail})
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      ticket.status === "OPEN"
                        ? "bg-semantic-warning/20 text-semantic-warning border border-semantic-warning/30"
                        : ticket.status === "IN_PROGRESS"
                        ? "bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30"
                        : "bg-semantic-success/20 text-semantic-success border border-semantic-success/30"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                {/* Customer Complaint Body */}
                <p className="text-xs sm:text-sm text-white leading-relaxed bg-white/[0.03] p-4 rounded-xl border border-white/5">
                  {ticket.message}
                </p>

                {/* Existing Admin Reply if any */}
                {ticket.adminReply && (
                  <div className="p-3.5 rounded-xl bg-accent-violet/15 border border-accent-violet/30 text-xs space-y-1">
                    <span className="font-bold text-accent-cyan block">
                      {copy.adminReplyLabel}
                    </span>
                    <p className="text-white leading-relaxed">
                      {ticket.adminReply}
                    </p>
                  </div>
                )}

                {/* Admin Reply & Resolution Controls */}
                {ticket.status !== "RESOLVED" && (
                  <div className="pt-2 space-y-3">
                    <textarea
                      rows={2}
                      value={replyDrafts[ticket.id] || ""}
                      onChange={(e) =>
                        setReplyDrafts((prev) => ({
                          ...prev,
                          [ticket.id]: e.target.value,
                        }))
                      }
                      placeholder={copy.replyPlaceholder}
                      className="glass-input w-full p-3 text-xs text-white placeholder:text-txt-muted focus:outline-none"
                    />
                    <div className="flex flex-wrap items-center justify-end gap-2.5">
                      {ticket.status === "OPEN" && (
                        <button
                          type="button"
                          disabled={actionLoading === ticket.id}
                          onClick={() =>
                            handleReplyComplaint(ticket, "IN_PROGRESS")
                          }
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition"
                        >
                          {copy.markInProgress}
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={actionLoading === ticket.id}
                        onClick={() => handleReplyComplaint(ticket, "RESOLVED")}
                        className="px-4 py-2 rounded-xl text-xs font-semibold glass-button-primary text-white flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{copy.sendReplyResolve}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ADMINISTRATIVE COMMANDS, BROADCASTS & AUDIT LOGS */}
      {activeTab === "operations" && (
        <div className="space-y-6">
          {/* Broadcast System Announcement Form */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <div className="w-10 h-10 rounded-xl bg-accent-violet/20 border border-accent-violet/30 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {copy.broadcastTitle}
                </h2>
                <p className="text-xs text-txt-secondary">{copy.broadcastSub}</p>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <input
                type="text"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                placeholder={copy.broadcastSubjectPlaceholder}
                className="glass-input w-full h-10 px-3 text-xs text-white placeholder:text-txt-muted focus:outline-none"
                required
              />
              <textarea
                rows={3}
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder={copy.broadcastMsgPlaceholder}
                className="glass-input w-full p-3 text-xs text-white placeholder:text-txt-muted focus:outline-none"
                required
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={actionLoading === "broadcast"}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold glass-button-primary text-white flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{copy.sendBroadcastBtn}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Audit Logs */}
          <div className="glass-card p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-white">
                {copy.auditLogsTitle}
              </h2>
              <p className="text-xs text-txt-secondary">{copy.auditLogsSub}</p>
            </div>

            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-white">{log.action}</p>
                    <p className="text-[11px] text-txt-secondary">
                      {log.actor} &bull;{" "}
                      <span className="text-accent-cyan">{log.target}</span>
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-txt-muted shrink-0">
                    {new Date(log.timestamp).toLocaleString(locale)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Sensitive Administrative Operations */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl glass-panel border border-semantic-error/40 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-semantic-error/20 border border-semantic-error/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-semantic-error" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {confirmModal.type === "SUSPEND"
                    ? t.admin.suspendConfirmTitle
                    : confirmModal.type === "REACTIVATE"
                    ? t.admin.reactivateTenant
                    : confirmModal.type === "PURGE_QUEUE"
                    ? t.admin.purgeConfirmTitle
                    : t.admin.flushConfirmTitle}
                </h3>
                <p className="text-xs text-semantic-error">
                  Administrative Action Confirmation
                </p>
              </div>
            </div>

            <p className="text-xs text-txt-secondary leading-relaxed">
              {confirmModal.type === "SUSPEND"
                ? t.admin.suspendConfirmDesc
                : confirmModal.type === "REACTIVATE"
                ? `${t.admin.reactivateTenant}: ${confirmModal.tenant?.companyName}`
                : confirmModal.type === "PURGE_QUEUE"
                ? t.admin.purgeConfirmDesc
                : t.admin.flushConfirmDesc}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setConfirmModal({ isOpen: false, type: "SUSPEND" })
                }
                disabled={actionLoading === "execute"}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-txt-secondary transition"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleExecuteOperation}
                disabled={actionLoading === "execute"}
                className="px-4 py-2 rounded-xl text-xs font-semibold glass-button-primary text-white transition flex items-center gap-1.5"
              >
                {actionLoading === "execute" && (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                )}
                <span>{t.common.confirmAction}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
