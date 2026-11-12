import { describe, it, expect } from "vitest";
import { dictionaries } from "@/lib/i18n/dictionaries";

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
