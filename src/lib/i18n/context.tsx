"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale } from "@/types/domain";
import { dictionaries, Dictionary } from "./dictionaries";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  dir: "ltr",
  t: dictionaries.en,
  setLocale: () => {},
});

const STORAGE_KEY = "smp_locale_preference";

export function I18nProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && (saved === "en" || saved === "tr" || saved === "ar")) {
        setLocaleState(saved);
      }
    } catch {
      // Ignore storage access errors in restricted environments
    }
  }, []);

  useEffect(() => {
    const dir = dictionaries[locale].meta.direction;
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = dir;
    }
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore
    }
  };

  const t = dictionaries[locale];

  return (
    <I18nContext.Provider
      value={{
        locale,
        dir: t.meta.direction,
        t,
        setLocale,
      }}
    >
      <div dir={t.meta.direction} className="min-h-screen">
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
