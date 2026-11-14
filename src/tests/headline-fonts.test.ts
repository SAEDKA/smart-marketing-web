import { describe, expect, it } from "vitest";

import { headlineFontKind } from "@/components/landing/headline-font-kind";

describe("headlineFontKind", () => {
  it("uses the kufi display face for Arabic", () => {
    expect(headlineFontKind("ar")).toBe("kufi");
  });

  it("uses AMCAP for the Latin-script locales", () => {
    expect(headlineFontKind("tr")).toBe("amcap");
    expect(headlineFontKind("en")).toBe("amcap");
  });

  it("falls back to AMCAP for unknown locales", () => {
    expect(headlineFontKind("de")).toBe("amcap");
  });
});
