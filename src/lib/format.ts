const aedEn = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

const aedAr = new Intl.NumberFormat("ar-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

const plainEn = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });
const plainAr = new Intl.NumberFormat("ar-AE", { maximumFractionDigits: 0 });

export const formatAED = (n: number, lang: "en" | "ar" = "en") =>
  lang === "ar" ? aedAr.format(n) : aedEn.format(n);

/** Bare number with thousands separators — for table cells where the unit is in the header. */
export const formatNumber = (n: number, lang: "en" | "ar" = "en") =>
  lang === "ar" ? plainAr.format(n) : plainEn.format(n);

/** Axis-friendly: 1.2M / 340k / 0. */
export function formatCompactAED(n: number, lang: "en" | "ar" = "en"): string {
  const abs = Math.abs(n);
  if (lang === "ar") {
    if (abs >= 1_000_000) return `${trim(n / 1_000_000)}M د.إ`;
    if (abs >= 1_000) return `${trim(n / 1_000)}k د.إ`;
    return plainAr.format(n);
  }

  if (abs >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (abs >= 1_000) return `${trim(n / 1_000)}k`;
  return plainEn.format(n);
}

const trim = (n: number) => {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
};
