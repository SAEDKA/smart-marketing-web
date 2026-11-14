"use client";

import Link from "next/link";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  User,
  Building,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { ApiErrorShape } from "@/types/domain";
import { BrandLogo } from "@/components/layout/BrandLogo";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useI18n();

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Password rule evaluations
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = t.validation.fullNameRequired;
    if (!companyName.trim()) errors.companyName = t.validation.companyNameRequired;
    if (!email.trim() || !email.includes("@")) errors.email = t.validation.emailInvalid;
    if (!password) {
      errors.password = t.validation.passwordRequired;
    } else if (!hasMinLength || !hasUppercase || !hasNumber) {
      errors.password = t.validation.passwordWeak;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName: fullName.trim(),
        companyName: companyName.trim(),
        email: email.trim(),
        password,
      });
      // Direct new user to company onboarding wizard (WEB-01-06)
      router.push("/onboarding");
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

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
      <Card className="glass-panel border-white/15 shadow-2xl p-6 sm:p-8">
        <CardHeader className="text-center pb-6">
          <BrandLogo className="w-12 h-12 mx-auto mb-3 block shadow-glow-violet" />
          <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {t.auth.registerTitle}
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm text-txt-secondary mt-1.5">
            {t.auth.registerSubtitle}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {apiError && (
            <div
              role="alert"
              className="mb-5 p-3.5 rounded-xl bg-semantic-error/15 border border-semantic-error/30 text-semantic-error flex items-start gap-2.5 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.fullNameLabel}
              placeholder={t.auth.fullNamePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={fieldErrors.fullName}
              leftElement={<User className="w-4 h-4" />}
              required
            />

            <Input
              label={t.auth.companyNameLabel}
              placeholder={t.auth.companyNamePlaceholder}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              error={fieldErrors.companyName}
              leftElement={<Building className="w-4 h-4" />}
              required
            />

            <Input
              label={t.auth.emailLabel}
              type="email"
              placeholder={t.auth.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              leftElement={<Mail className="w-4 h-4" />}
              required
            />

            <div>
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
                required
              />

              {/* Password strength visual guidelines */}
              <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5 text-[11px]">
                <p className="font-semibold text-txt-secondary">
                  {t.auth.passwordRulesTitle}
                </p>
                <div className="grid grid-cols-2 gap-1 text-txt-muted">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        hasMinLength ? "text-semantic-success" : "text-white/20"
                      }`}
                    />
                    <span className={hasMinLength ? "text-white" : ""}>
                      {t.auth.ruleMinLength}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        hasUppercase ? "text-semantic-success" : "text-white/20"
                      }`}
                    />
                    <span className={hasUppercase ? "text-white" : ""}>
                      {t.auth.ruleUppercase}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        hasNumber ? "text-semantic-success" : "text-white/20"
                      }`}
                    />
                    <span className={hasNumber ? "text-white" : ""}>
                      {t.auth.ruleNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${
                        hasSpecial ? "text-semantic-success" : "text-white/20"
                      }`}
                    />
                    <span className={hasSpecial ? "text-white" : ""}>
                      {t.auth.ruleSpecial}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              {isLoading ? t.auth.creatingAccountBtn : t.auth.createAccountBtn}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-txt-secondary">
            <span>{t.auth.haveAccountText} </span>
            <Link
              href="/login"
              className="text-accent-violet font-semibold hover:underline"
            >
              {t.auth.signInBtn}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
