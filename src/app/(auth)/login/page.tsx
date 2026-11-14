"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/brand/Logo";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles, UserCheck } from "lucide-react";
import { ApiErrorShape } from "@/types/domain";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useI18n();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});

    // Client-side quick checks
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = t.validation.emailRequired;
    if (!password) errors.password = t.validation.passwordRequired;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: email.trim(), password });
      if (email.trim().toLowerCase().includes("admin")) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const apiErr = err as ApiErrorShape;
      setApiError(apiErr.message || t.common.errorOccurred);
      if (apiErr.fieldErrors) {
        const mapped: Record<string, string> = {};
        apiErr.fieldErrors.forEach((f) => {
          mapped[f.field] = f.message;
        });
        setFieldErrors(mapped);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoOwner = () => {
    setEmail("sarah@lumierecoffee.com");
    setPassword("Lumiere2026!");
    setApiError(null);
    setFieldErrors({});
  };

  const fillDemoAdmin = () => {
    setEmail("admin@company.com");
    setPassword("AdminRoot2026!");
    setApiError(null);
    setFieldErrors({});
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
      <Card className="glass-panel border-white/15 shadow-2xl p-6 sm:p-8">
        <CardHeader className="text-center pb-6">
          <LogoMark size={48} className="mx-auto mb-3" />
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.auth.loginTitle}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-txt-secondary mt-1.5">
            {t.auth.loginSubtitle}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {apiError && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error flex items-start gap-2.5 text-xs animate-in fade-in"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.emailLabel}
              type="email"
              placeholder={t.auth.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              leftElement={<Mail className="w-4 h-4" />}
              autoComplete="email"
              required
            />

            <div className="space-y-1">
              <Input
                label={t.auth.passwordLabel}
                type={showPassword ? "text" : "password"}
                placeholder={t.auth.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={fieldErrors.password}
                leftElement={<Lock className="w-4 h-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword}
                    className="p-1 text-txt-muted hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                autoComplete="current-password"
                required
              />
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-[11px] text-accent-violet hover:text-accent-cyan transition-colors"
                >
                  {t.auth.forgotPasswordLink}
                </a>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              {isLoading ? t.auth.signingInBtn : t.auth.signInBtn}
            </Button>
          </form>

          {/* Quick Demo Fill Buttons for Testing & Evaluation */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-txt-muted text-center">
              {t.auth.demoCredentialsHint}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoOwner}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-txt-secondary hover:text-white transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-accent-cyan" />
                <span>{t.auth.fillOwnerDemo}</span>
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-txt-secondary hover:text-white transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-accent-violet" />
                <span>{t.auth.fillAdminDemo}</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-txt-secondary">
            <span>{t.auth.noAccountText} </span>
            <a
              href="/register"
              className="text-accent-cyan font-semibold hover:underline"
            >
              {t.auth.createAccountBtn}
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
