"use client";

import Link from "next/link";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { authApi } from "@/lib/api/auth.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { ApiErrorShape } from "@/types/domain";

export default function ForgotPasswordPage() {
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setApiError(t.validation.emailInvalid);
      return;
    }

    setIsLoading(true);
    setApiError(null);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      setIsSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as ApiErrorShape;
      setApiError(apiErr.message || t.common.errorOccurred);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
      <Card className="glass-panel border-white/15 shadow-2xl p-6 sm:p-8">
        <CardHeader className="text-center pb-6">
          <div className="w-12 h-12 rounded-2xl bg-accent-violet/20 text-accent-violet border border-accent-violet/30 mx-auto mb-3 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white">
            {t.auth.forgotPasswordTitle}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-txt-secondary mt-1.5">
            {t.auth.forgotPasswordSubtitle}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-2xl bg-semantic-success/20 text-semantic-success border border-semantic-success/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {t.auth.resetLinkSentTitle}
              </h3>
              <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed">
                {t.auth.resetLinkSentDesc}
              </p>
              <div className="pt-2">
                <Link
                  href="/reset-password"
                  className="text-xs text-accent-cyan hover:underline block"
                >
                  Test Reset Password Screen &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error flex items-start gap-2.5 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{apiError}</span>
                </div>
              )}

              <Input
                label={t.auth.emailLabel}
                type="email"
                placeholder={t.auth.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftElement={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                {t.auth.sendResetLinkBtn}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-txt-secondary hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.auth.backToLogin}</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
