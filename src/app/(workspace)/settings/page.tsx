"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { useI18n } from "@/lib/i18n/context";
import { accountApi } from "@/lib/api/notifications.api";
import { adminApi } from "@/lib/api/admin.api";
import { AdminComplaintTicket, ApiErrorShape } from "@/types/domain";
import {
  Settings,
  User,
  Lock,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MessageSquareWarning,
  Send,
} from "lucide-react";

export default function SettingsPage() {
  const { session } = useAuth();
  const { t, locale, setLocale } = useI18n();

  const isAdmin = session?.user.role === "SYSTEM_ADMIN";

  // Profile Form state
  const [fullName, setFullName] = useState(
    session?.user.fullName || "Sarah Jenkins"
  );
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Customer Support / Complaint Ticket Form state
  const [ticketCategory, setTicketCategory] =
    useState<AdminComplaintTicket["category"]>("TECHNICAL");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  useEffect(() => {
    if (session?.user.fullName) {
      setFullName(session.user.fullName);
    }
  }, [session?.user.fullName]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileLoading(true);
      await accountApi.updateProfile({ fullName });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      // Error handling
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError(t.validation.passwordWeak);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t.validation.passwordsMismatch);
      return;
    }

    try {
      setPasswordLoading(true);
      await accountApi.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const apiErr = err as ApiErrorShape;
      setPasswordError(apiErr?.message || t.common.errorOccurred);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSubmitSupportTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    try {
      setTicketLoading(true);
      await adminApi.submitComplaint({
        companyName: "Lumiere Artisan Roasters",
        ownerName: session?.user.fullName || "Sarah Jenkins",
        ownerEmail: session?.user.email || "sarah@lumierecoffee.com",
        category: ticketCategory,
        priority: "MEDIUM",
        subject: ticketSubject.trim(),
        message: ticketMessage.trim(),
      });
      setTicketSubject("");
      setTicketMessage("");
      setTicketSuccess(true);
      setTimeout(() => setTicketSuccess(false), 4000);
    } catch {
      // Handle gracefully
    } finally {
      setTicketLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Settings className="w-7 h-7 text-accent-cyan" />
          <span>{t.settings.title}</span>
        </h1>
        <p className="text-sm text-txt-secondary mt-1">{t.settings.subtitle}</p>
      </div>

      {/* USER PROFILE SECTION */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-accent-violet/20 border border-accent-violet/30 flex items-center justify-center">
            <User className="w-5 h-5 text-accent-cyan" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {t.settings.profileSection}
            </h2>
            <p className="text-xs text-txt-secondary">
              {locale === "ar"
                ? "البيانات الشخصية ولغة العرض المفضلة"
                : locale === "tr"
                ? "Kişisel bilgiler ve tercih edilen arayüz dili"
                : "Personal identity and language preferences"}
            </p>
          </div>
        </div>

        {profileSuccess && (
          <div className="p-3.5 rounded-xl bg-semantic-success/15 border border-semantic-success/30 text-semantic-success text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{t.settings.profileUpdated}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                {t.settings.fullName}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="glass-input w-full h-10 px-3 text-white text-xs focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                {t.settings.email}
              </label>
              <input
                type="email"
                value={session?.user.email || "owner@company.com"}
                disabled
                className="w-full h-10 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-txt-muted text-xs cursor-not-allowed font-mono"
              />
            </div>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs font-semibold text-txt-secondary mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-accent-cyan" />
              <span>{t.settings.preferredLang}</span>
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {(
                [
                  { code: "en", label: "English" },
                  { code: "tr", label: "Türkçe" },
                  { code: "ar", label: "العربية" },
                ] as const
              ).map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-center ${
                    locale === lang.code
                      ? "bg-accent-violet text-white border-accent-violet shadow-glow-violet"
                      : "bg-white/5 text-txt-secondary border-white/10 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={profileLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold glass-button-primary text-white transition flex items-center gap-2"
            >
              {profileLoading && (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>{t.settings.updateProfileBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SECURITY & PASSWORD SECTION */}
      <div className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-semantic-error/20 border border-semantic-error/30 flex items-center justify-center">
            <Lock className="w-5 h-5 text-semantic-error" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              {t.settings.securitySection}
            </h2>
            <p className="text-xs text-txt-secondary">
              {locale === "ar"
                ? "تحديث كلمة المرور وحماية حسابك"
                : locale === "tr"
                ? "Şifrenizi ve hesap güvenliğinizi güncelleyin"
                : "Update authentication credentials and account security"}
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="p-3.5 rounded-xl bg-semantic-success/15 border border-semantic-success/30 text-semantic-success text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{t.settings.passwordChanged}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
              {t.settings.currentPassword}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="glass-input w-full max-w-md h-10 px-3 text-white text-xs focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                {t.settings.newPassword}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="glass-input w-full h-10 px-3 text-white text-xs focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                {t.settings.confirmNewPassword}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="glass-input w-full h-10 px-3 text-white text-xs focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={passwordLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-semantic-error hover:opacity-90 text-white transition flex items-center gap-2"
            >
              {passwordLoading && (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              )}
              <span>{t.settings.changePasswordBtn}</span>
            </button>
          </div>
        </form>
      </div>

      {/* CUSTOMER SUPPORT & SUBMIT COMPLAINT SECTION (Only for Company Owners) */}
      {!isAdmin && (
        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center">
              <MessageSquareWarning className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {locale === "ar"
                  ? "الدعم الفني وإرسال شكوى أو استفسار للإدارة"
                  : locale === "tr"
                  ? "Teknik Destek ve Şikayet Bildirimi"
                  : "Support & Submit a Ticket to Administration"}
              </h2>
              <p className="text-xs text-txt-secondary">
                {locale === "ar"
                  ? "إذا واجهت أي مشكلة في حسابك أو ربط القنوات، أرسل رسالتك مباشرة لفريق إدارة المنصة."
                  : locale === "tr"
                  ? "Hesabınızla veya sosyal medya bağlantılarıyla ilgili sorunları doğrudan yönetime iletin."
                  : "Have an issue with social channel sync or billing? Send a ticket directly to platform admins."}
              </p>
            </div>
          </div>

          {ticketSuccess && (
            <div className="p-3.5 rounded-xl bg-semantic-success/15 border border-semantic-success/30 text-semantic-success text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {locale === "ar"
                  ? "تم إرسال الشكوى إلى إدارة النظام بنجاح، وسيتم الرد عليك قريباً."
                  : locale === "tr"
                  ? "Talebiniz sistem yönetimine başarıyla iletildi."
                  : "Your ticket has been submitted to System Administration."}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmitSupportTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  {locale === "ar"
                    ? "نوع الطلب / الشكوى"
                    : locale === "tr"
                    ? "Konu Kategorisi"
                    : "Category"}
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) =>
                    setTicketCategory(
                      e.target.value as AdminComplaintTicket["category"]
                    )
                  }
                  className="glass-input w-full h-10 px-3 text-xs text-white bg-navy-900 focus:outline-none"
                >
                  <option value="TECHNICAL">
                    {locale === "ar" ? "مشكلة تقنية" : "Technical Issue"}
                  </option>
                  <option value="SOCIAL_INTEGRATION">
                    {locale === "ar"
                      ? "ربط إنستغرام وفيسبوك"
                      : "Instagram & Facebook Sync"}
                  </option>
                  <option value="BILLING">
                    {locale === "ar" ? "الباقات والفوترة" : "Plan & Billing"}
                  </option>
                  <option value="AI_QUALITY">
                    {locale === "ar"
                      ? "توليد المحتوى بالذكاء الاصطناعي"
                      : "AI Studio Quality"}
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                  {locale === "ar"
                    ? "عنوان الشكوى أو الملاحظة"
                    : locale === "tr"
                    ? "Başlık"
                    : "Subject"}
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder={
                    locale === "ar"
                      ? "مثال: استفسار حول جدولة منشورات إنستغرام..."
                      : "e.g. Question about scheduled post publishing..."
                  }
                  className="glass-input w-full h-10 px-3 text-xs text-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-txt-secondary mb-1.5">
                {locale === "ar"
                  ? "تفاصيل الشكوى"
                  : locale === "tr"
                  ? "Mesajınız"
                  : "Message Details"}
              </label>
              <textarea
                rows={3}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder={
                  locale === "ar"
                    ? "اشرح المشكلة أو الاستفسار بوضوح ليتمكن فريق الإدارة من مساعدتك..."
                    : "Describe how we can help..."
                }
                className="glass-input w-full p-3 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={ticketLoading}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold glass-button-primary text-white flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {locale === "ar"
                    ? "إرسال إلى الإدارة"
                    : locale === "tr"
                    ? "Yönetime Gönder"
                    : "Send Ticket"}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
