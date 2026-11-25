import { formatCompactPhrase } from "./format";
import type { CalculatorResult, Language } from "./types";

export type VerdictKind = "buy" | "rent" | "tooClose";

export interface Verdict {
  kind: VerdictKind;
  /** The headline, e.g. "Buying beats renting after 7 years". */
  headline: string;
  /** One sentence of supporting detail. */
  detail: string;
  /** Difference in net cost at the end of the horizon (positive = buying is cheaper). */
  advantage: number;
}

/** Within this fraction of the larger figure, the two options are a coin toss. */
const TOO_CLOSE_FRACTION = 0.02;

/** Arabic counts the first two numbers with their own forms, then switches plural. */
function years(n: number, lang: Language): string {
  if (lang === "en") return `${n} ${n === 1 ? "year" : "years"}`;
  if (n === 1) return "سنة واحدة";
  if (n === 2) return "سنتين";
  return n <= 10 ? `${n} سنوات` : `${n} سنة`;
}

/**
 * The headline copy for a result. The whole decision the page exists to deliver
 * is this one function, so both languages live together — a new phrasing has to
 * be written in both to land here.
 */
export function verdict(
  result: CalculatorResult,
  horizonYears: number,
  lang: Language = "en",
): Verdict {
  const last = result.years.at(-1);
  const ar = lang === "ar";

  if (!last) {
    return {
      kind: "tooClose",
      headline: ar ? "لا توجد بيانات كافية" : "Nothing to compare yet",
      detail: ar
        ? "يرجى تحديد أفق زمني للمقارنة لا يقل عن سنة واحدة."
        : "Set a comparison horizon of at least one year.",
      advantage: 0,
    };
  }

  const advantage = last.rentNetCost - last.buyNetCost;
  const scale = Math.max(Math.abs(last.rentNetCost), Math.abs(last.buyNetCost), 1);
  const breakeven = result.breakevenYear;
  const horizon = years(horizonYears, lang);
  const gap = (n: number) => formatCompactPhrase(n, lang);

  if (Math.abs(advantage) / scale < TOO_CLOSE_FRACTION) {
    return {
      kind: "tooClose",
      headline: ar ? "النتيجتان متقاربتان جداً" : "Too close to call",
      detail: ar
        ? `خلال ${horizon} الفرق بين الخيارين أقل من 2%، لذا يتوقف القرار الفعلي على مدة بقائك المتوقعة في العقار.`
        : `Over ${horizon} the two options land within 2% of each other, so the choice comes down to how long you'll really stay.`,
      advantage,
    };
  }

  if (advantage > 0 && breakeven !== null) {
    return {
      kind: "buy",
      headline: ar
        ? breakeven === 1
          ? "الشراء يتفوق على الإيجار من السنة الأولى"
          : `الشراء يتفوق على الإيجار بعد ${years(breakeven, lang)}`
        : breakeven === 1
          ? "Buying beats renting from year one"
          : `Buying beats renting after ${years(breakeven, lang)}`,
      detail: ar
        ? `عند البقاء لكامل فترة ${horizon}، يحقق لك الشراء وفراً مالياً يقدّر بحوالي ${gap(advantage)}.`
        : `Stay the full ${horizon} and buying leaves you better off by about ${gap(advantage)}.`,
      advantage,
    };
  }

  if (advantage > 0) {
    // Buying is ahead at the horizon but never crossed — only possible if the
    // series is non-monotonic, so report it plainly rather than quoting a year.
    return {
      kind: "buy",
      headline: ar ? `الشراء أفضل على مدى ${horizon}` : `Buying wins over ${horizon}`,
      detail: ar
        ? `ينتهي الشراء بأقل تكلفة بنحو ${gap(advantage)}، على الرغم من أن الإيجار قد يكون أقل كلفة في البداية.`
        : `Buying ends about ${gap(advantage)} cheaper, though renting is ahead for most of the period.`,
      advantage,
    };
  }

  return {
    kind: "rent",
    headline: ar ? `الإيجار يتفوق على مدى ${horizon}` : `Renting wins over ${horizon}`,
    detail: ar
      ? `الشراء لا يعوّض تكاليفه الأولية خلال ${horizon}، حيث يكلّف نحو ${gap(-advantage)} أكثر بعد احتساب الرسوم وعوائد الاستثمار البديلة.`
      : `Buying never catches up within ${horizon} — it ends about ${gap(-advantage)} more expensive once fees and opportunity cost are counted.`,
    advantage,
  };
}
