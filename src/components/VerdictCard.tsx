import { formatAED } from "@/lib/format";
import type { CalculatorResult } from "@/lib/types";
import { verdict } from "@/lib/verdict";

const TONE = {
  buy: {
    ring: "ring-sky-600/20 dark:ring-sky-400/25",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    accent: "text-sky-800 dark:text-sky-300",
    chip: "bg-sky-600/10 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200",
    label: "Buy",
  },
  rent: {
    ring: "ring-amber-600/20 dark:ring-amber-400/25",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    accent: "text-amber-900 dark:text-amber-200",
    chip: "bg-amber-600/10 text-amber-900 dark:bg-amber-400/15 dark:text-amber-100",
    label: "Rent",
  },
  tooClose: {
    ring: "ring-slate-400/25 dark:ring-slate-500/30",
    bg: "bg-slate-100 dark:bg-slate-800/50",
    accent: "text-slate-800 dark:text-slate-200",
    chip: "bg-slate-600/10 text-slate-700 dark:bg-slate-400/15 dark:text-slate-200",
    label: "Line call",
  },
} as const;

interface Props {
  result: CalculatorResult;
  horizonYears: number;
}

export function VerdictCard({ result, horizonYears }: Props) {
  const v = verdict(result, horizonYears);
  const tone = TONE[v.kind];
  const last = result.years.at(-1);

  return (
    <section
      aria-labelledby="verdict-headline"
      className={`rounded-2xl p-5 ring-1 sm:p-6 ${tone.bg} ${tone.ring}`}
    >
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${tone.chip}`}
      >
        {tone.label}
      </span>
      <h2
        id="verdict-headline"
        className={`mt-3 text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl ${tone.accent}`}
      >
        {v.headline}
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        {v.detail}
      </p>

      {last ? (
        <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-black/5 pt-4 text-sm sm:grid-cols-2 dark:border-white/10">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-slate-600 dark:text-slate-400">
              Net cost of buying · {horizonYears} yrs
            </dt>
            <dd className="font-semibold tabular-nums">{formatAED(last.buyNetCost)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-slate-600 dark:text-slate-400">
              Net cost of renting · {horizonYears} yrs
            </dt>
            <dd className="font-semibold tabular-nums">{formatAED(last.rentNetCost)}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
