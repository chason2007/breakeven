import type { CalculatorResult } from "@/lib/types";
import { formatAED } from "@/lib/format";

interface Props {
  result: CalculatorResult;
  horizonYears: number;
}

// TODO: polish cards, add verdict copy ("Buying wins after X years"), tooltips explaining each figure.
export function ResultsSummary({ result, horizonYears }: Props) {
  const last = result.years.at(-1);
  const stats = [
    { label: "Monthly cost — buy", value: formatAED(result.monthlyBuyCost) },
    { label: "Monthly cost — rent", value: formatAED(result.monthlyRentCost) },
    {
      label: "Breakeven",
      value: result.breakevenYear ? `Year ${result.breakevenYear}` : `Not within ${horizonYears} yrs`,
    },
    { label: "Upfront fees", value: formatAED(result.upfrontCosts) },
    { label: `Net cost of buying (${horizonYears} yrs)`, value: last ? formatAED(last.buyNetCost) : "—" },
    { label: `Net cost of renting (${horizonYears} yrs)`, value: last ? formatAED(last.rentNetCost) : "—" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <div className="text-xs opacity-60">{s.label}</div>
          <div className="mt-1 text-lg font-semibold">{s.value}</div>
        </div>
      ))}
    </div>
  );
}
