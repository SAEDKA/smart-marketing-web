"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function UnauthorizedView() {
  const { t } = useI18n();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center space-y-4 border-semantic-warning/30">
        <CardContent className="space-y-4 pt-4">
          <div className="w-14 h-14 rounded-2xl bg-semantic-warning/15 text-semantic-warning border border-semantic-warning/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {t.auth.unauthorizedTitle}
          </h2>
          <p className="text-sm text-txt-secondary leading-relaxed">
            {t.auth.unauthorizedDesc}
          </p>
          <div className="pt-2 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => (window.location.href = "/dashboard")}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              {t.auth.returnToDashboardBtn}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
