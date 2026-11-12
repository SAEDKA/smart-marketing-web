"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { authApi } from "@/lib/api/auth.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertTriangle, Mail, RefreshCw, ArrowRight } from "lucide-react";
import { ApiErrorShape } from "@/types/domain";

export default function VerifyEmailPage() {
  const { t } = useI18n();

  const [state, setState] = useState<"idle" | "success" | "expired">("idle");
  const [isLoading, setIsLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const testVerify = async (token: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setResendStatus(null);
    try {
      await authApi.verifyEmail({ token });
      setState("success");
    } catch (err: unknown) {
      const apiErr = err as ApiErrorShape;
      if (apiErr.code === "TOKEN_EXPIRED" || apiErr.status === 410) {
        setState("expired");
      } else {
        setErrorMsg(apiErr.message || t.common.errorOccurred);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authApi.resendVerification({ email: "sarah@lumierecoffee.com" });
      setResendStatus(t.auth.resendSuccessMsg);
    } catch (err: unknown) {
      const apiErr = err as ApiErrorShape;
      setErrorMsg(apiErr.message || t.common.errorOccurred);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
      <Card className="glass-panel border-white/15 shadow-2xl p-6 sm:p-8 text-center">
        {state === "idle" && (
          <>
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-violet/20 text-accent-violet border border-accent-violet/30 mx-auto mb-3 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-white">
                {t.auth.verifyEmailTitle}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-txt-secondary mt-1.5">
                {t.auth.verifyEmailSubtitle}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <p className="text-xs text-txt-muted">
                Test the token verification endpoint against the typed backend API:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  onClick={() => testVerify("valid_token_sample")}
                  isLoading={isLoading}
                >
                  {t.auth.verifyValidBtn}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => testVerify("expired_token")}
                  isLoading={isLoading}
                >
                  {t.auth.verifyExpiredBtn}
                </Button>
              </div>

              {errorMsg && (
                <p className="text-xs text-semantic-error">{errorMsg}</p>
              )}
            </CardContent>
          </>
        )}

        {state === "success" && (
          <div className="space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-semantic-success/20 text-semantic-success border border-semantic-success/30 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t.auth.verifySuccessTitle}
            </h3>
            <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed">
              {t.auth.verifySuccessDesc}
            </p>
            <div className="pt-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => (window.location.href = "/dashboard")}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {t.auth.proceedToWorkspace}
              </Button>
            </div>
          </div>
        )}

        {state === "expired" && (
          <div className="space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-semantic-warning/20 text-semantic-warning border border-semantic-warning/30 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t.auth.verifyExpiredTitle}
            </h3>
            <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed">
              {t.auth.verifyExpiredDesc}
            </p>

            {resendStatus && (
              <div className="p-3 rounded-xl bg-accent-mint/15 border border-accent-mint/30 text-accent-mint text-xs">
                {resendStatus}
              </div>
            )}

            <div className="pt-3 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={handleResend}
                isLoading={isLoading}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                {t.auth.resendVerificationBtn}
              </Button>
              <a
                href="/login"
                className="text-xs text-txt-secondary hover:text-white pt-2 inline-block"
              >
                {t.auth.backToLogin}
              </a>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
