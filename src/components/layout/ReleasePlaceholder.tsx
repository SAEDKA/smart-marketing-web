"use client";

import Link from "next/link";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { JiraStoryStatus } from "@/types/domain";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  ArrowRight,
  ShieldAlert,
  Layers,
  Sparkles,
  GitBranch,
} from "lucide-react";

interface ReleasePlaceholderProps {
  release: "R2" | "R3" | "R4" | "R5" | "R6" | "R7";
  title: string;
  description: string;
  stories: JiraStoryStatus[];
  children?: React.ReactNode;
}

export function ReleasePlaceholder({
  release,
  title,
  description,
  stories,
  children,
}: ReleasePlaceholderProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Release Notice Banner */}
      <div className="p-5 rounded-[22px] glass-panel border border-accent-violet/30 bg-accent-violet/5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="violet" size="md">
              Release {release} &bull; Next Staged Phase
            </Badge>
            <span className="text-xs text-txt-muted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Phase R1 Under Review</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-txt-secondary max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              &larr; {t.dashboard.openScreen}
            </Button>
          </Link>
        </div>
      </div>

      {/* Jira Stories for this Release */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-accent-cyan" />
              <span>Jira Frontend Stories in Release {release}</span>
            </CardTitle>
            <Badge variant="outline" size="sm">
              {stories.length} Stories
            </Badge>
          </div>
          <CardDescription>
            These stories will be implemented in staged phase {release} following R1 review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stories.map((story) => (
              <div
                key={story.id}
                className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent-cyan">
                    {story.id}
                  </span>
                  <Badge variant="violet" size="sm">
                    {story.epic}
                  </Badge>
                </div>
                <h4 className="text-xs font-semibold text-white">
                  {story.titleKey}
                </h4>
                {story.externalDependencies.length > 0 && (
                  <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-txt-muted font-medium">
                      Prerequisites:
                    </span>
                    {story.externalDependencies.map((dep) => (
                      <span
                        key={dep}
                        className="px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-accent-violet border border-accent-violet/20"
                      >
                        {dep}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview Wireframe / Workspace Preview */}
      {children && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-txt-muted">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span>Interactive UX Preview & Workspace Design</span>
          </div>
          <div className="opacity-95">{children}</div>
        </div>
      )}
    </div>
  );
}
