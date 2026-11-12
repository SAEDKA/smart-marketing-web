"use client";

import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18n/context";
import { Locale } from "@/types/domain";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES: {
  code: Locale;
  shortCode: string;
  label: string;
  nativeName: string;
  directionBadge: string;
}[] = [
  {
    code: "en",
    shortCode: "EN",
    label: "English",
    nativeName: "English",
    directionBadge: "LTR",
  },
  {
    code: "tr",
    shortCode: "TR",
    label: "Turkish",
    nativeName: "Türkçe",
    directionBadge: "LTR",
  },
  {
    code: "ar",
    shortCode: "AR",
    label: "Arabic",
    nativeName: "العربية",
    directionBadge: "RTL",
  },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Language selector. Current: ${current.nativeName}`}
        aria-expanded={isOpen}
        className="flex items-center gap-2 h-9 px-3 rounded-full glass-button-secondary text-xs font-medium text-white transition-all focus-visible:ring-2 focus-visible:ring-accent-violet"
      >
        <Globe className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
        <span className="px-1.5 py-0.5 rounded-md bg-accent-violet/20 text-accent-violet font-mono text-[10px] font-bold tracking-wider">
          {current.shortCode}
        </span>
        <span className="hidden sm:inline font-medium text-white">
          {current.nativeName}
        </span>
        <ChevronDown className="w-3 h-3 text-txt-muted shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-52 rounded-2xl glass-panel border border-white/15 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1.5 text-[10px] font-semibold text-txt-muted uppercase tracking-wider border-b border-white/10 mb-1">
            Interface Language
          </div>
          {LANGUAGES.map((item) => {
            const isSelected = locale === item.code;
            return (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLocale(item.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors",
                  isSelected
                    ? "bg-accent-violet/20 text-white font-semibold border border-accent-violet/30"
                    : "text-txt-secondary hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "w-7 py-0.5 rounded-md font-mono text-[10px] font-bold text-center",
                      isSelected
                        ? "bg-accent-violet text-white"
                        : "bg-white/10 text-txt-secondary"
                    )}
                  >
                    {item.shortCode}
                  </span>
                  <div className="text-start">
                    <span className="block text-xs leading-tight">
                      {item.nativeName}
                    </span>
                    <span className="block text-[10px] text-txt-muted leading-tight">
                      {item.label} &bull; {item.directionBadge}
                    </span>
                  </div>
                </div>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
