"use client";

import React from "react";
import { useAuth } from "@/lib/auth/context";
import { useI18n } from "@/lib/i18n/context";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Lock, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function SessionExpiredModal() {
  const { isSessionExpired, clearSessionExpiry } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  if (!isSessionExpired) return null;

  const handleReauthenticate = () => {
    clearSessionExpiry();
    router.push("/login");
  };

  return (
    <Modal
      isOpen={isSessionExpired}
      onClose={handleReauthenticate}
      title={t.auth.sessionExpiredTitle}
      maxWidth="sm"
    >
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-semantic-warning/20 text-semantic-warning flex items-center justify-center mx-auto border border-semantic-warning/30">
          <Lock className="w-6 h-6" />
        </div>
        <p className="text-sm text-txt-secondary leading-relaxed">
          {t.auth.sessionExpiredDesc}
        </p>
        <div className="pt-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={handleReauthenticate}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            {t.auth.reauthenticateBtn}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
