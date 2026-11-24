const aed = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

const plain = new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 });

export const formatAED = (n: number) => aed.format(n);

/** Bare number with thousands separators — for table cells where the unit is in the header. */
export const formatNumber = (n: number) => plain.format(n);

/** Axis-friendly: 1.2M / 340k / 0. */
export function formatCompactAED(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${trim(n / 1_000_000)}M`;
  if (abs >= 1_000) return `${trim(n / 1_000)}k`;
  return plain.format(n);
}

const trim = (n: number) => {
  const s = n.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
};
