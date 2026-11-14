import { describe, it, expect } from "vitest";
import { en } from "@/lib/i18n/locales/en";
import { tr } from "@/lib/i18n/locales/tr";
import { ar } from "@/lib/i18n/locales/ar";
import { loadDictionary } from "@/lib/i18n/load-dictionary";

const dictionaries = { en, tr, ar };

describe("Multi-Language Support (EN, TR, AR)", () => {
  it("provides complete translations for English, Turkish, and Arabic", () => {
    expect(dictionaries.en).toBeDefined();
    expect(dictionaries.tr).toBeDefined();
    expect(dictionaries.ar).toBeDefined();

    expect(dictionaries.en.meta.direction).toBe("ltr");
    expect(dictionaries.tr.meta.direction).toBe("ltr");
    expect(dictionaries.ar.meta.direction).toBe("rtl");
  });

  it("has matching navigation keys across all three languages", () => {
    const enKeys = Object.keys(dictionaries.en.nav);
    const trKeys = Object.keys(dictionaries.tr.nav);
    const arKeys = Object.keys(dictionaries.ar.nav);

    expect(trKeys).toEqual(enKeys);
    expect(arKeys).toEqual(enKeys);
  });

  it("contains Arabic onboarding tone translations", () => {
    expect(dictionaries.ar.onboarding.tones.LUXURY).toBeDefined();
    expect(dictionaries.ar.onboarding.step1Title).toBeDefined();
  });
});

describe("Per-locale dictionary loading (bundle split)", () => {
  it("loads each locale on demand and caches it", async () => {
    const arLoaded = await loadDictionary("ar");
    expect(arLoaded.meta.direction).toBe("rtl");
    const arAgain = await loadDictionary("ar");
    expect(arAgain).toBe(arLoaded); // same cached object, no re-import

    const enLoaded = await loadDictionary("en");
    expect(enLoaded).toBe(en); // default locale is the bundled one
  });
});
