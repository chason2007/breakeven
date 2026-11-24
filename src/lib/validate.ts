import type { CalculatorInputs } from "./types";

/** Above this price UAE lenders require a larger down payment. */
export const HIGH_VALUE_THRESHOLD = 5_000_000;
export const MIN_DOWN_PAYMENT_PCT = 20;
export const MIN_DOWN_PAYMENT_PCT_HIGH_VALUE = 25;
export const MAX_TENURE_YEARS = 25;

export type WarningLevel = "warn" | "info";

export interface Warning {
  /** The input this warning is attached to. */
  field: keyof CalculatorInputs;
  level: WarningLevel;
  message: string;
}

/** UAE Central Bank minimum down payment for an expat first home. */
export function minDownPaymentPct(propertyPrice: number): number {
  return propertyPrice > HIGH_VALUE_THRESHOLD
    ? MIN_DOWN_PAYMENT_PCT_HIGH_VALUE
    : MIN_DOWN_PAYMENT_PCT;
}

/**
 * Non-blocking checks. Inputs stay editable — the UI shows these inline so the
 * user can see *why* a figure is unrealistic without being stopped mid-typing.
 */
export function validate(i: CalculatorInputs, lang: "en" | "ar" = "en"): Warning[] {
  const warnings: Warning[] = [];
  const minDown = minDownPaymentPct(i.propertyPrice);
  const isAr = lang === "ar";

  if (i.downPaymentPct < minDown) {
    warnings.push({
      field: "downPaymentPct",
      level: "warn",
      message: isAr
        ? i.propertyPrice > HIGH_VALUE_THRESHOLD
          ? `المصارف في الإمارات تشترط دفعة أولى 25% على الأقل للعقارات فوق 5 ملايين درهم.`
          : `المصارف في الإمارات تشترط دفعة أولى 20% على الأقل للمنزل الأول.`
        : i.propertyPrice > HIGH_VALUE_THRESHOLD
          ? `UAE lenders require at least ${minDown}% down above AED 5M.`
          : `UAE lenders require at least ${minDown}% down for an expat first home.`,
    });
  }

  if (i.downPaymentPct > 100) {
    warnings.push({
      field: "downPaymentPct",
      level: "warn",
      message: isAr
        ? "لا يمكن أن تتجاوز الدفعة الأولى 100% من سعر العقار."
        : "A down payment over 100% of the price isn't possible.",
    });
  }

  if (i.tenureYears > MAX_TENURE_YEARS) {
    warnings.push({
      field: "tenureYears",
      level: "warn",
      message: isAr
        ? `الحد الأقصى للتمويل العقاري في الإمارات هو ${MAX_TENURE_YEARS} عاماً.`
        : `UAE mortgage tenure is capped at ${MAX_TENURE_YEARS} years.`,
    });
  }

  if (i.tenureYears < 1) {
    warnings.push({
      field: "tenureYears",
      level: "warn",
      message: isAr ? "يجب أن تكون مدة التمويل سنة واحدة على الأقل." : "Tenure must be at least 1 year.",
    });
  }

  if (i.horizonYears > i.tenureYears && i.tenureYears > 0) {
    warnings.push({
      field: "horizonYears",
      level: "info",
      message: isAr
        ? `يتم سداد القرض بالكامل في السنة ${i.tenureYears}، وبالتالي السنوات التالية تخلو من أقساط الرهن.`
        : `The mortgage is paid off in year ${i.tenureYears}, so later years carry no mortgage.`,
    });
  }

  if (i.rentIncreasePct > 20) {
    warnings.push({
      field: "rentIncreasePct",
      level: "info",
      message: isAr
        ? "مؤشر حاسبة الزيادة الإيجارية (ريرا) يحدد سقف الزيادة السنوية غالباً عند 20%."
        : "Dubai's RERA index caps most increases at 20%.",
    });
  }

  if (i.appreciationPct > 10) {
    warnings.push({
      field: "appreciationPct",
      level: "info",
      message: isAr
        ? "افتراض نمو سنوي مزدوج ومستمر لأسعار العقار يُعد توقعاً مفرط التفاؤل."
        : "Sustained double-digit appreciation is an optimistic assumption.",
    });
  }

  if (i.propertySizeSqft <= 0) {
    warnings.push({
      field: "propertySizeSqft",
      level: "warn",
      message: isAr ? "يجب أن تكون المساحة أكبر من صفر." : "Size must be greater than zero.",
    });
  }

  if (i.propertyPrice <= 0) {
    warnings.push({
      field: "propertyPrice",
      level: "warn",
      message: isAr ? "يرجى إدخال سعر عقار أكبر من صفر." : "Enter a property price above zero.",
    });
  }

  if (i.annualRent <= 0) {
    warnings.push({
      field: "annualRent",
      level: "warn",
      message: isAr ? "يرجى إدخال الإيجار السنوي لعقار مماثل." : "Enter the annual rent for a comparable home.",
    });
  }

  return warnings;
}
