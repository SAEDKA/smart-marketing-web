import localFont from "next/font/local";

import { headlineFontKind } from "./headline-font-kind";

/**
 * Self-hosted display fonts for the landing hero headline.
 *
 * AMCAP Eternal (The Fontry) is the heavy all-caps display face
 * the product owner chose. The free release cannot render
 * Turkish as shipped: its lowercase accented slots (ç, ö, ü, ı)
 * all point at a smiley-face easter-egg glyph, and ğ / ş / İ do
 * not exist at all. The bundled AmcapTR.otf is the same font
 * with those letters repaired — ç/ö/ü remapped to the font's own
 * (correct) capitals, ı to its plain bar, Ğ built from G plus a
 * breve, Ş from S plus the font's cedilla, İ from I plus its dot.
 * AMCAP Eternal is free for personal use; a commercial launch
 * needs the paid licence from The Fontry.
 *
 * The Kufi file is a static Black (900) instance of Noto Kufi
 * Arabic, subset to the Arabic script ranges.
 */
const amcapHeadlineFont = localFont({
  src: "../../assets/fonts/AmcapTR.otf",
  display: "swap",
});

const kufiHeadlineFont = localFont({
  src: "../../assets/fonts/NotoKufiArabic-Black.ttf",
  display: "swap",
});

export function headlineFontClassName(locale: string): string {
  return headlineFontKind(locale) === "kufi"
    ? kufiHeadlineFont.className
    : amcapHeadlineFont.className;
}
