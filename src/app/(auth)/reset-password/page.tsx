"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { authApi } from "@/lib/api/auth.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { ApiErrorShape } from "@/types/domain";

export default function ResetPasswordPage() {
  const { t } = useI18n();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token] = useState("sample_valid_token");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (password.length < 8) {
      setApiError(t.validation.passwordWeak);
      return;
    }
    if (password !== confirmPassword) {
      setApiError(t.validation.passwordsMismatch);
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        token,
        password,
        confirmPassword,
      });
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
            <Lock className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white">
            {t.auth.resetPasswordTitle}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-txt-secondary mt-1.5">
            {t.auth.resetPasswordSubtitle}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 rounded-2xl bg-semantic-success/20 text-semantic-success border border-semantic-success/30 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {t.auth.passwordUpdatedTitle}
              </h3>
              <p className="text-xs sm:text-sm text-txt-secondary leading-relaxed">
                {t.auth.passwordUpdatedDesc}
              </p>
              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => (window.location.href = "/login")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  {t.auth.signInBtn}
                </Button>
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
                label={t.auth.passwordLabel}
                type={showPassword ? "text" : "password"}
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftElement={<Lock className="w-4 h-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                    className="p-1 text-txt-muted hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                required
              />

              <Input
                label={t.auth.confirmPasswordLabel}
                type={showPassword ? "text" : "password"}
                placeholder={t.auth.confirmPasswordLabel}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftElement={<Lock className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                isLoading={isLoading}
              >
                {t.auth.updatePasswordBtn}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
