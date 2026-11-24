"use client";

import { formatNumber } from "@/lib/format";
import type { YearRow } from "@/lib/types";

interface Props {
  years: YearRow[];
  breakevenYear: number | null;
}

const COLUMNS: { key: keyof YearRow; label: string; title: string; tone?: "buy" | "rent" }[] = [
  { key: "mortgagePaid", label: "Mortgage", title: "Mortgage payments made this year" },
  { key: "serviceCharge", label: "Service", title: "Service charge for the year" },
  { key: "maintenance", label: "Upkeep", title: "Maintenance for the year" },
  { key: "loanBalance", label: "Loan left", title: "Outstanding mortgage balance" },
  { key: "homeValue", label: "Home value", title: "Property value after appreciation" },
  { key: "sellingCosts", label: "To sell", title: "Agent fee plus VAT and early settlement" },
  {
    key: "buyNetCost",
    label: "Buying",
    title: "Cumulative net cost of buying",
    tone: "buy",
  },
  { key: "rentCashOut", label: "Rent paid", title: "Rent plus housing fee and Ejari" },
  {
    key: "rentNetCost",
    label: "Renting",
    title: "Cumulative net cost of renting",
    tone: "rent",
  },
];

export function YearTable({ years, breakevenYear }: Props) {
  return (
    <details className="group border-t border-rule">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 py-4 text-sm font-semibold">
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform group-open:rotate-90"
        >
          <path
            d="M6 3.5 10.5 8 6 12.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Year by year
        <span className="font-normal text-ink-faint">
          {years.length} {years.length === 1 ? "year" : "years"}, in AED
        </span>
      </summary>

      <div className="-mx-5 overflow-x-auto pb-5 sm:mx-0">
        <table className="w-full min-w-[44rem] border-collapse text-right text-[0.8125rem]">
          <caption className="sr-only">
            Annual cash flows and cumulative net cost for buying and renting
          </caption>
          <thead>
            <tr className="border-b border-rule">
              <th
                scope="col"
                className="sticky left-0 bg-paper px-5 py-2 text-left font-medium text-ink-faint sm:px-3"
              >
                Year
              </th>
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  title={c.title}
                  className={`px-3 py-2 font-medium whitespace-nowrap ${
                    c.tone === "buy"
                      ? "text-buy"
                      : c.tone === "rent"
                        ? "text-rent"
                        : "text-ink-faint"
                  }`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {years.map((row) => {
              const marked = row.year === breakevenYear;
              return (
                <tr
                  key={row.year}
                  className={`border-b border-rule-soft last:border-0 ${
                    marked ? "bg-buy-wash" : ""
                  }`}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 px-5 py-1.5 text-left font-semibold whitespace-nowrap sm:px-3 ${
                      marked ? "bg-buy-wash" : "bg-paper"
                    }`}
                  >
                    {row.year}
                    {marked ? (
                      <span className="ml-2 font-normal text-ink-faint">breakeven</span>
                    ) : null}
                  </th>
                  {COLUMNS.map((c) => (
                    <td
                      key={c.key}
                      className={`px-3 py-1.5 tabular-nums whitespace-nowrap ${
                        c.tone === "buy"
                          ? "font-semibold text-buy"
                          : c.tone === "rent"
                            ? "font-semibold text-rent"
                            : "text-ink-soft"
                      }`}
                    >
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
