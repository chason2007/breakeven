import type { CalculatorResult } from "./types";

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

const years = (n: number) => `${n} ${n === 1 ? "year" : "years"}`;

export function verdict(result: CalculatorResult, horizonYears: number): Verdict {
  const last = result.years.at(-1);

  if (!last) {
    return {
      kind: "tooClose",
      headline: "Nothing to compare yet",
      detail: "Set a comparison horizon of at least one year.",
      advantage: 0,
    };
  }

  const advantage = last.rentNetCost - last.buyNetCost;
  const scale = Math.max(Math.abs(last.rentNetCost), Math.abs(last.buyNetCost), 1);
  const breakeven = result.breakevenYear;

  if (Math.abs(advantage) / scale < TOO_CLOSE_FRACTION) {
    return {
      kind: "tooClose",
      headline: "Too close to call",
      detail: `Over ${years(horizonYears)} the two options land within 2% of each other, so the choice comes down to how long you'll really stay.`,
      advantage,
    };
  }

  if (advantage > 0 && breakeven !== null) {
    return {
      kind: "buy",
      headline:
        breakeven === 1
          ? "Buying beats renting from year one"
          : `Buying beats renting after ${years(breakeven)}`,
      detail: `Stay the full ${years(horizonYears)} and buying leaves you better off by about ${compact(advantage)}.`,
      advantage,
    };
  }

  if (advantage > 0) {
    // Buying is ahead at the horizon but never crossed — only possible if the
    // series is non-monotonic, so report it plainly rather than quoting a year.
    return {
      kind: "buy",
      headline: `Buying wins over ${years(horizonYears)}`,
      detail: `Buying ends about ${compact(advantage)} cheaper, though renting is ahead for most of the period.`,
      advantage,
    };
  }

  return {
    kind: "rent",
    headline: `Renting wins over ${years(horizonYears)}`,
    detail: `Buying never catches up within ${years(horizonYears)} — it ends about ${compact(-advantage)} more expensive once fees and opportunity cost are counted.`,
    advantage,
  };
}

/** AED 1.2M / AED 340k — readable inside a sentence. */
function compact(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `AED ${(n / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 1_000) return `AED ${Math.round(n / 1_000)}k`;
  return `AED ${Math.round(n)}`;
}
