/**
 * Which display face the hero headline uses, per locale.
 *
 * Latin-script locales (en, tr) use the repaired AMCAP Eternal —
 * see headline-fonts.ts for why the font file itself had to be
 * patched before it could render Turkish. Arabic uses Noto Kufi
 * Arabic Black, the heavy geometric Arabic face that matches
 * AMCAP's blocky spirit (AMCAP has no Arabic glyphs at all).
 *
 * Kept as a pure function in its own module so it can be unit
 * tested without loading the font machinery.
 */
export type HeadlineFontKind = "amcap" | "kufi";

export function headlineFontKind(locale: string): HeadlineFontKind {
  return locale === "ar" ? "kufi" : "amcap";
}
