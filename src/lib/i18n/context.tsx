"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Locale } from "@/types/domain";
import type { Dictionary } from "./dictionary";
import { en } from "./locales/en";
import { loadDictionary } from "./load-dictionary";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  t: Dictionary;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "en",
  dir: "ltr",
  t: en,
  setLocale: () => {},
});

const STORAGE_KEY = "smp_locale_preference";

function getStoredLocale(): Locale | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "en" || saved === "tr" || saved === "ar" ? saved : null;
  } catch {
    return null;
  }
}

export function I18nProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [dictionary, setDictionary] = useState<Dictionary>(en);
  // Boot gate: children render only once the saved locale's dictionary
  // is in hand. Without it, every refresh painted the bundled English
  // first and visibly flipped to the saved language (and LTR -> RTL)
  // when its chunk arrived — the user saw "the language changes on F5".
  const [booted, setBooted] = useState(false);
  // Guards against out-of-order chunk loads when a user switches
  // language twice quickly: only the latest request may apply.
  const loadSeqRef = useRef(0);

  const applyLocale = useCallback(async (next: Locale) => {
    const seq = ++loadSeqRef.current;
    try {
      const loaded = await loadDictionary(next);
      if (seq !== loadSeqRef.current) return; // a newer switch won
      setDictionary(loaded);
      setLocaleState(next);
    } catch {
      // Chunk failed to load (e.g. offline): stay on the current,
      // working language instead of switching to missing strings.
    }
  }, []);

  // On mount: resolve the saved preference and open the boot gate.
  // A saved non-English locale loads its chunk first, so the very
  // first painted frame is already in the user's language; on a chunk
  // failure applyLocale keeps English and the gate still opens.
  // English users never download the TR/AR dictionaries at all.
  useEffect(() => {
    const target = getStoredLocale() ?? initialLocale;
    if (target === "en") {
      setBooted(true);
      return;
    }
    void applyLocale(target).finally(() => setBooted(true));
    // Runs once on mount by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = dictionary.meta.direction;
    }
  }, [locale, dictionary]);

  const setLocale = useCallback(
    (next: Locale) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore
      }
      void applyLocale(next);
    },
    [applyLocale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ locale, dir: dictionary.meta.direction, t: dictionary, setLocale }),
    [locale, dictionary, setLocale]
  );

  return (
    <I18nContext.Provider value={value}>
      {booted ? (
        <div dir={dictionary.meta.direction} className="min-h-screen">
          {children}
        </div>
      ) : (
        // Neutral brand backdrop for the brief boot window — identical
        // on the server and on the client's first render, so hydration
        // matches and no wrong-language frame is ever painted.
        <div className="min-h-screen bg-navy-950" aria-hidden="true" />
      )}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
