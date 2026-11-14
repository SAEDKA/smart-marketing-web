import type { Locale } from "@/types/domain";
import type { Dictionary } from "./dictionary";
import { en } from "./locales/en";

/**
 * Per-locale dictionary loading.
 *
 * Before: one 115 KB module held all three languages and shipped to
 * every user on every page. Now English (the app default) is the only
 * dictionary in the initial bundle; Turkish and Arabic are separate
 * webpack chunks fetched on demand the first time they are selected,
 * then cached for the rest of the session.
 */
const cache = new Map<Locale, Dictionary>([["en", en]]);

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
  tr: async () => (await import("./locales/tr")).tr,
  ar: async () => (await import("./locales/ar")).ar,
};

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  const cached = cache.get(locale);
  if (cached) return cached;
  const dictionary = await loaders[locale]();
  cache.set(locale, dictionary);
  return dictionary;
}
