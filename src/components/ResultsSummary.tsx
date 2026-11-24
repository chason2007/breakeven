import { formatAED } from "@/lib/format";
import type { CalculatorResult } from "@/lib/types";

interface Props {
  result: CalculatorResult;
  horizonYears: number;
}

export function ResultsSummary({ result, horizonYears }: Props) {
  const stats = [
    {
      label: "Monthly — buy",
      value: formatAED(result.monthlyBuyCost),
      note: "Mortgage, service charge, maintenance",
    },
    {
      label: "Monthly — rent",
      value: formatAED(result.monthlyRentCost),
      note: "Rent, housing fee, Ejari",
    },
    {
      label: "Breakeven",
      value: result.breakevenYear ? `Year ${result.breakevenYear}` : "Never",
      note: result.breakevenYear
        ? "Buying pulls ahead here"
        : `Not within ${horizonYears} years`,
    },
    {
      label: "Cash to buy",
      value: formatAED(result.upfrontCosts),
      note: "Transaction fees, on top of the down payment",
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-slate-200 bg-surface p-4 dark:border-slate-800"
        >
          <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</dt>
          <dd className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight sm:text-2xl">
            {s.value}
          </dd>
          <p className="mt-1.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            {s.note}
          </p>
        </div>
      ))}
    </dl>
  );
}
