"use client";

import { formatNumber } from "@/lib/format";
import type { YearRow } from "@/lib/types";

interface Props {
  years: YearRow[];
  breakevenYear: number | null;
}

const COLUMNS: { key: keyof YearRow; label: string; title: string }[] = [
  { key: "mortgagePaid", label: "Mortgage", title: "Mortgage payments made this year" },
  { key: "serviceCharge", label: "Service", title: "Service charge for the year" },
  { key: "maintenance", label: "Upkeep", title: "Maintenance for the year" },
  { key: "loanBalance", label: "Loan left", title: "Outstanding mortgage balance" },
  { key: "homeValue", label: "Home value", title: "Property value after appreciation" },
  { key: "sellingCosts", label: "Exit cost", title: "Agent fee + VAT and early settlement" },
  { key: "buyNetCost", label: "Buy net", title: "Cumulative net cost of buying" },
  { key: "rentCashOut", label: "Rent paid", title: "Rent + housing fee + Ejari" },
  { key: "rentNetCost", label: "Rent net", title: "Cumulative net cost of renting" },
];

export function YearTable({ years, breakevenYear }: Props) {
  return (
    <details className="group rounded-2xl border border-slate-200 bg-surface dark:border-slate-800">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50">
        <span>
          <span className="font-semibold">Year by year</span>
          <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
            {years.length} {years.length === 1 ? "year" : "years"}, all figures in AED
          </span>
        </span>
        <svg
          aria-hidden
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400"
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>

      <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800">
        <table className="w-full min-w-[46rem] border-collapse text-right text-sm">
          <caption className="sr-only">
            Annual cash flows and cumulative net cost for buying and renting
          </caption>
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th scope="col" className="sticky left-0 bg-surface px-4 py-2.5 text-left font-medium text-slate-500 dark:text-slate-400">
                Year
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  title={c.title}
                  className="whitespace-nowrap px-3 py-2.5 font-medium text-slate-500 dark:text-slate-400"
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((row) => {
              const isBreakeven = row.year === breakevenYear;
              return (
                <tr
                  key={row.year}
                  className={`border-b border-slate-100 last:border-0 dark:border-slate-800/60 ${
                    isBreakeven ? "bg-sky-50/80 dark:bg-sky-950/30" : ""
                  }`}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 px-4 py-2 text-left font-medium ${
                      isBreakeven
                        ? "bg-sky-50/80 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200"
                        : "bg-surface"
                    }`}
                  >
                    {row.year}
                    {isBreakeven ? (
                      <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wide">
                        breakeven
                      </span>
                    ) : null}
                  </th>
                  {COLUMNS.map((c) => (
                    <td key={c.key} className="whitespace-nowrap px-3 py-2 tabular-nums">
                      {formatNumber(row[c.key])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}
