import type { Language } from "./types";

const aed: Record<Language, Intl.NumberFormat> = {
  en: new Intl.NumberFormat("en-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }),
  ar: new Intl.NumberFormat("ar-AE", { style: "currency", currency: "AED", maximumFractionDigits: 0 }),
};

const plain: Record<Language, Intl.NumberFormat> = {
  en: new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }),
  ar: new Intl.NumberFormat("ar-AE", { maximumFractionDigits: 0 }),
};

export const formatAED = (n: number, lang: Language = "en") => aed[lang].format(n);

/** Bare number with thousands separators — for table cells where the unit is in the header. */
export const formatNumber = (n: number, lang: Language = "en") => plain[lang].format(n);

/**
 * Grouped digits for a text input: 2000000 -> "2,000,000". Always Latin digits,
 * because the field is parsed back with `parseGrouped` on every keystroke.
 */
export function formatGrouped(n: number): string {
  if (!Number.isFinite(n)) return "";
  const [whole, fraction] = String(n).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${grouped}.${fraction}` : grouped;
}

/** Inverse of `formatGrouped`. Returns NaN for anything that isn't a number. */
export function parseGrouped(raw: string): number {
  const cleaned = raw.replace(/,/g, "").trim();
  return cleaned === "" ? NaN : Number(cleaned);
}

/** Axis-friendly, unit implied by the axis title: 1.2M / 340k / 0. */
export function formatCompactAED(n: number, lang: Language = "en"): string {
  const abs = Math.abs(n);
  const suffix = lang === "ar" ? " د.إ" : "";
  if (abs >= 1_000_000) return `${trim(n / 1_000_000)}M${suffix}`;
  if (abs >= 1_000) return `${trim(n / 1_000)}k${suffix}`;
  return plain[lang].format(n);
}

/** Readable inside a sentence: "AED 1.2M" / "1.2 مليون د.إ". */
export function formatCompactPhrase(n: number, lang: Language = "en"): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const millions = (abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1);

  if (lang === "ar") {
    if (abs >= 1_000_000) return `${sign}${millions} مليون د.إ`;
    if (abs >= 1_000) return `${sign}${Math.round(abs / 1_000)} ألف د.إ`;
    return `${sign}${Math.round(abs)} د.إ`;
  }

  if (abs >= 1_000_000) return `${sign}AED ${millions}M`;
  if (abs >= 1_000) return `${sign}AED ${Math.round(abs / 1_000)}k`;
  return `${sign}AED ${Math.round(abs)}`;
}

const trim = (n: number) => {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
};
