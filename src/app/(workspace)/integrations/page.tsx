"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { socialApi } from "@/lib/api/social.api";
import { SocialAccount, SocialPlatform } from "@/types/domain";
import {
  Share2,
  Instagram,
  Facebook,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Users,
  Lock,
} from "lucide-react";

export default function IntegrationsPage() {
  const { t, locale } = useI18n();

  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modals
  const [oauthModal, setOauthModal] = useState<{
    isOpen: boolean;
    platform?: SocialPlatform;
    isReconnect?: boolean;
    accountId?: string;
  }>({ isOpen: false });

  const [disconnectModal, setDisconnectModal] = useState<{
    isOpen: boolean;
    account?: SocialAccount;
  }>({ isOpen: false });

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await socialApi.getAccounts();
      setAccounts(res.data);
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleStartOAuth = (
    platform: SocialPlatform,
    isReconnect = false,
    accountId?: string
  ) => {
    setOauthModal({ isOpen: true, platform, isReconnect, accountId });
  };

  const handleConfirmOAuth = async () => {
    if (!oauthModal.platform) return;
    try {
      setActionLoading("oauth");
      if (oauthModal.isReconnect && oauthModal.accountId) {
        await socialApi.reconnectAccount(oauthModal.accountId);
        setStatusMessage("Access token refreshed and revalidated successfully.");
      } else {
        await socialApi.connectAccount(oauthModal.platform);
        setStatusMessage(
          `${oauthModal.platform === "INSTAGRAM" ? "Instagram" : "Facebook"} connected successfully.`
        );
      }
      setOauthModal({ isOpen: false });
      await fetchAccounts();
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmDisconnect = async () => {
    if (!disconnectModal.account) return;
    try {
      setActionLoading("disconnect");
      await socialApi.disconnectAccount(disconnectModal.account.id);
      setStatusMessage(
        `${disconnectModal.account.accountName} disconnected successfully.`
      );
      setDisconnectModal({ isOpen: false });
      await fetchAccounts();
    } catch {
      setStatusMessage(t.common.errorOccurred);
    } finally {
      setActionLoading(null);
    }
  };

  const instagramAccount = accounts.find((a) => a.platform === "INSTAGRAM");
  const facebookAccount = accounts.find((a) => a.platform === "FACEBOOK");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Share2 className="w-7 h-7 text-violet-400" />
            {t.integrations.title}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.integrations.subtitle}
          </p>
        </div>

        <button
          onClick={fetchAccounts}
          disabled={loading}
          className="self-start md:self-auto px-4 py-2 rounded-xl text-sm font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 flex items-center gap-2 transition"
        >
          <RefreshCw
            className={`w-4 h-4 text-violet-400 ${loading ? "animate-spin" : ""}`}
          />
          {t.common.retry}
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

      {/* Scope Notice Banner (MVP Boundaries) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-violet-950/30 to-purple-950/40 border border-blue-500/20 backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-semibold text-white">
                {t.integrations.mvpLimitationTitle}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Active Channels
              </span>
            </div>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
              {t.integrations.mvpLimitationDesc}
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-xs text-slate-400 font-medium me-1">
                Supported:
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-pink-500/20 border border-pink-500/30 text-pink-300 font-medium flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5" /> Instagram Professional
              </span>
              <span className="text-xs px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 font-medium flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5" /> Facebook Business Pages
              </span>
              <span className="text-xs text-slate-500 ms-2 font-mono">
                {t.integrations.unsupportedNetworks}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INSTAGRAM PROFESSIONAL CARD */}
        <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-pink-500/30 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px] shadow-lg shadow-pink-500/10">
                  <div className="w-full h-full bg-slate-900 rounded-[10.5px] flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Instagram Professional
                  </h3>
                  <p className="text-xs text-slate-400">
                    Meta Business API • Publishing & Insights
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              {instagramAccount?.status === "CONNECTED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t.integrations.statusConnected}
                </span>
              ) : instagramAccount?.status === "TOKEN_EXPIRED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {t.integrations.statusTokenExpired}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/40 text-slate-400 border border-slate-600/30 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  {t.integrations.statusDisconnected}
                </span>
              )}
            </div>

            {/* Account Details if connected */}
            {instagramAccount && instagramAccount.status !== "DISCONNECTED" ? (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {instagramAccount.accountName}
                    </div>
                    <div className="text-xs text-pink-400 font-mono">
                      {instagramAccount.accountHandle}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {t.integrations.followers}
                    </div>
                    <div className="text-sm font-bold text-slate-200">
                      {instagramAccount.followerCount?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>{t.integrations.externalId}:</span>
                    <span className="font-mono text-slate-300">
                      {instagramAccount.externalId}
                    </span>
                  </div>
                  {instagramAccount.tokenExpiresAt && (
                    <div className="flex justify-between">
                      <span>{t.integrations.tokenExpiryNotice}:</span>
                      <span className="text-emerald-400 font-medium">
                        {new Date(
                          instagramAccount.tokenExpiresAt
                        ).toLocaleDateString(locale)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your Instagram Professional or Creator account linked to
                your Meta Business Manager to enable automated feed publishing
                and performance telemetry.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-white/5 flex items-center gap-3">
            {instagramAccount && instagramAccount.status === "CONNECTED" ? (
              <>
                <button
                  onClick={() =>
                    handleStartOAuth("INSTAGRAM", true, instagramAccount.id)
                  }
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
                  {t.integrations.reconnect}
                </button>
                <button
                  onClick={() =>
                    setDisconnectModal({
                      isOpen: true,
                      account: instagramAccount,
                    })
                  }
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition flex items-center justify-center gap-1"
                >
                  {t.integrations.disconnect}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleStartOAuth("INSTAGRAM")}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white shadow-lg shadow-pink-500/25 transition flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                {t.integrations.connectInstagram}
              </button>
            )}
          </div>
        </div>

        {/* FACEBOOK BUSINESS PAGES CARD */}
        <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/10 backdrop-blur-xl hover:border-blue-500/30 transition-all flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 p-[1.5px] shadow-lg shadow-blue-500/10">
                  <div className="w-full h-full bg-slate-900 rounded-[10.5px] flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Facebook Business Pages
                  </h3>
                  <p className="text-xs text-slate-400">
                    Meta Graph API • Page Management & Publishing
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              {facebookAccount?.status === "CONNECTED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {t.integrations.statusConnected}
                </span>
              ) : facebookAccount?.status === "TOKEN_EXPIRED" ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {t.integrations.statusTokenExpired}
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/40 text-slate-400 border border-slate-600/30 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  {t.integrations.statusDisconnected}
                </span>
              )}
            </div>

            {/* Expired Token Alert if applicable */}
            {facebookAccount?.status === "TOKEN_EXPIRED" && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{t.integrations.tokenExpiredAlert}</span>
              </div>
            )}

            {/* Account Details if connected/expired */}
            {facebookAccount && facebookAccount.status !== "DISCONNECTED" ? (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {facebookAccount.accountName}
                    </div>
                    <div className="text-xs text-blue-400 font-mono">
                      {facebookAccount.accountHandle}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-xs text-slate-400 flex items-center gap-1 justify-end">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {t.integrations.followers}
                    </div>
                    <div className="text-sm font-bold text-slate-200">
                      {facebookAccount.followerCount?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>{t.integrations.externalId}:</span>
                    <span className="font-mono text-slate-300">
                      {facebookAccount.externalId}
                    </span>
                  </div>
                  {facebookAccount.tokenExpiresAt && (
                    <div className="flex justify-between">
                      <span>{t.integrations.tokenExpiryNotice}:</span>
                      <span
                        className={
                          facebookAccount.status === "TOKEN_EXPIRED"
                            ? "text-rose-400 font-medium"
                            : "text-emerald-400 font-medium"
                        }
                      >
                        {new Date(
                          facebookAccount.tokenExpiresAt
                        ).toLocaleDateString(locale)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect your official Facebook Business Page to distribute
                approved marketing campaigns, link previews, and customer
                updates directly to your brand followers.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t border-white/5 flex items-center gap-3">
            {facebookAccount && facebookAccount.status === "TOKEN_EXPIRED" ? (
              <button
                onClick={() =>
                  handleStartOAuth("FACEBOOK", true, facebookAccount.id)
                }
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {t.integrations.reconnect}
              </button>
            ) : facebookAccount && facebookAccount.status === "CONNECTED" ? (
              <>
                <button
                  onClick={() =>
                    handleStartOAuth("FACEBOOK", true, facebookAccount.id)
                  }
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                  {t.integrations.reconnect}
                </button>
                <button
                  onClick={() =>
                    setDisconnectModal({
                      isOpen: true,
                      account: facebookAccount,
                    })
                  }
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition flex items-center justify-center gap-1"
                >
                  {t.integrations.disconnect}
                </button>
              </>
            ) : (
              <button
                onClick={() => handleStartOAuth("FACEBOOK")}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2"
              >
                <Facebook className="w-4 h-4" />
                {t.integrations.connectFacebook}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Architecture Glass Note */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Enterprise OAuth 2.0 PKCE Security
            </h4>
            <p className="text-xs text-slate-400">
              Access tokens are stored server-side with AES-256 encryption. The
              frontend web application never persists or handles unencrypted Meta
              API secrets.
            </p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
          Strict Token Boundary • Client Isolation
        </span>
      </div>

      {/* OAuth Redirection Simulation Modal */}
      {oauthModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Lock className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {t.integrations.oauthModalTitle}
                </h3>
                <p className="text-xs text-slate-400">
                  {oauthModal.platform === "INSTAGRAM"
                    ? "Instagram Professional API"
                    : "Facebook Pages API"}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.integrations.oauthModalDesc}
            </p>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 space-y-1">
              <div>
                <span className="text-slate-500">Target Origin:</span>{" "}
                <span className="font-mono text-slate-300">
                  https://www.facebook.com/v19.0/dialog/oauth
                </span>
              </div>
              <div>
                <span className="text-slate-500">Requested Scopes:</span>{" "}
                <span className="font-mono text-violet-300">
                  instagram_basic, pages_show_list, instagram_content_publish
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOauthModal({ isOpen: false })}
                disabled={actionLoading === "oauth"}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmOAuth}
                disabled={actionLoading === "oauth"}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-2 shadow-lg shadow-violet-600/25 transition"
              >
                {actionLoading === "oauth" ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    {t.integrations.connecting}
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-3.5 h-3.5" />
                    Authorize Meta Access
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Confirmation Modal */}
      {disconnectModal.isOpen && disconnectModal.account && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/15 p-6 shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {t.integrations.disconnect}
                </h3>
                <p className="text-xs text-rose-300">
                  {disconnectModal.account.accountName}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {t.integrations.disconnectConfirm}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDisconnectModal({ isOpen: false })}
                disabled={actionLoading === "disconnect"}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition"
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmDisconnect}
                disabled={actionLoading === "disconnect"}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1.5"
              >
                {actionLoading === "disconnect" && (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                )}
                {t.integrations.disconnect}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
