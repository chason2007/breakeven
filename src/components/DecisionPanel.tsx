import { CostChart } from "@/components/CostChart";
import { ShareButton } from "@/components/ShareButton";
import { formatAED } from "@/lib/format";
import type { CalculatorResult } from "@/lib/types";
import { verdict } from "@/lib/verdict";

interface Props {
  result: CalculatorResult;
  horizonYears: number;
}

const ACCENT = {
  buy: "text-buy",
  rent: "text-rent",
  tooClose: "text-ink",
} as const;

/**
 * The verdict and the chart that proves it are one object, not two cards — the
 * sentence and the picture make the same claim, so they share a frame.
 */
export function DecisionPanel({ result, horizonYears }: Props) {
  const v = verdict(result, horizonYears);
  const last = result.years.at(-1);

  const figures = [
    { label: "Monthly to own", value: formatAED(result.monthlyBuyCost), tone: "buy" as const },
    { label: "Monthly to rent", value: formatAED(result.monthlyRentCost), tone: "rent" as const },
    {
      label: "Breakeven",
      value: result.breakevenYear ? `Year ${result.breakevenYear}` : "Never",
      tone: "none" as const,
    },
    { label: "Fees to buy", value: formatAED(result.upfrontCosts), tone: "none" as const },
  ];

  return (
    <section
      aria-labelledby="verdict"
      className="overflow-hidden rounded-2xl border border-rule bg-panel"
    >
      <div className="px-5 pt-6 pb-5 sm:px-8 sm:pt-8">
        <h2
          id="verdict"
          className={`font-display text-[1.75rem] leading-[1.1] font-semibold text-balance sm:text-[2.5rem] ${ACCENT[v.kind]}`}
        >
          {v.headline}
        </h2>
        <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-soft">
          {v.detail}
        </p>

        {last ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <Side
              tone="buy"
              label={`Buying over ${horizonYears} ${horizonYears === 1 ? "year" : "years"}`}
              value={formatAED(last.buyNetCost)}
            />
            <Side
              tone="rent"
              label={`Renting over ${horizonYears} ${horizonYears === 1 ? "year" : "years"}`}
              value={formatAED(last.rentNetCost)}
            />
          </div>
        ) : null}
      </div>

      <div className="px-2 pb-2 sm:px-5 sm:pb-4">
        <CostChart data={result.years} breakevenYear={result.breakevenYear} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule px-5 py-4 sm:px-8">
        <dl className="grid grow grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:gap-x-10">
          {figures.map((f) => (
            <div key={f.label}>
              <dt className="text-xs text-ink-faint">{f.label}</dt>
              <dd
                className={`mt-0.5 text-base font-semibold tabular-nums ${
                  f.tone === "buy" ? "text-buy" : f.tone === "rent" ? "text-rent" : "text-ink"
                }`}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
        <ShareButton />
      </div>
    </section>
  );
}

function Side({ tone, label, value }: { tone: "buy" | "rent"; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone === "buy" ? "bg-buy" : "bg-rent"}`}
      />
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
