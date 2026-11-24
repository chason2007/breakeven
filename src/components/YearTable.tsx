"use client";

import { useLanguage } from "@/context/LanguageContext";
import { formatNumber } from "@/lib/format";
import type { YearRow } from "@/lib/types";

interface Props {
  years: YearRow[];
  breakevenYear: number | null;
}

export function YearTable({ years, breakevenYear }: Props) {
  const { lang, t, isArabic } = useLanguage();

  const columns: {
    key: keyof YearRow;
    label: string;
    title: string;
    tone?: "buy" | "rent";
  }[] = [
    {
      key: "mortgagePaid",
      label: t.tableColumns.mortgagePaid.label,
      title: t.tableColumns.mortgagePaid.title,
    },
    {
      key: "serviceCharge",
      label: t.tableColumns.serviceCharge.label,
      title: t.tableColumns.serviceCharge.title,
    },
    {
      key: "maintenance",
      label: t.tableColumns.maintenance.label,
      title: t.tableColumns.maintenance.title,
    },
    {
      key: "loanBalance",
      label: t.tableColumns.loanBalance.label,
      title: t.tableColumns.loanBalance.title,
    },
    {
      key: "homeValue",
      label: t.tableColumns.homeValue.label,
      title: t.tableColumns.homeValue.title,
    },
    {
      key: "sellingCosts",
      label: t.tableColumns.sellingCosts.label,
      title: t.tableColumns.sellingCosts.title,
    },
    {
      key: "buyNetCost",
      label: t.tableColumns.buyNetCost.label,
      title: t.tableColumns.buyNetCost.title,
      tone: "buy",
    },
    {
      key: "rentCashOut",
      label: t.tableColumns.rentCashOut.label,
      title: t.tableColumns.rentCashOut.title,
    },
    {
      key: "rentNetCost",
      label: t.tableColumns.rentNetCost.label,
      title: t.tableColumns.rentNetCost.title,
      tone: "rent",
    },
  ];

  return (
    <details className="group rounded-xl border border-rule bg-panel overflow-hidden shadow-2xs transition-all">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-semibold transition-colors hover:bg-rule-soft/40">
        <div className="flex items-center gap-2.5">
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            className={`h-4 w-4 shrink-0 text-ink-faint transition-transform ${
              isArabic ? "group-open:-rotate-90" : "group-open:rotate-90"
            }`}
          >
            <path
              d={isArabic ? "M10 3.5 5.5 8 10 12.5" : "M6 3.5 10.5 8 6 12.5"}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-bold text-ink">{t.yearByYear}</span>
        </div>
        <span className="text-xs font-normal text-ink-faint">
          {years.length} {t.yearsInAed}
        </span>
      </summary>

      <div className="border-t border-rule overflow-x-auto pb-4">
        <table className="w-full min-w-[50rem] border-collapse text-end text-[0.8125rem]">
          <caption className="sr-only">
            {t.yearByYear}
          </caption>
          <thead>
            <tr className="border-b border-rule bg-rule-soft/40">
              <th
                scope="col"
                className="sticky inset-s-0 bg-panel px-4 py-2.5 text-start font-bold text-ink-faint z-10"
              >
                {t.yearLabel}
              </th>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  title={c.title}
                  className={`px-3 py-2.5 font-bold whitespace-nowrap ${
                    c.tone === "buy"
                      ? "text-buy bg-buy-wash/40"
                      : c.tone === "rent"
                        ? "text-rent bg-rent-wash/40"
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
                  className={`border-b border-rule-soft transition-colors hover:bg-rule-soft/30 ${
                    marked ? "bg-gold-wash/80 font-medium" : ""
                  }`}
                >
                  <th
                    scope="row"
                    className={`sticky inset-s-0 px-4 py-2 text-start font-bold whitespace-nowrap z-10 ${
                      marked ? "bg-gold-wash text-gold-dark" : "bg-panel text-ink"
                    }`}
                  >
                    {row.year}
                    {marked ? (
                      <span className="ms-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gold text-white uppercase tracking-wider">
                        {t.breakeven}
                      </span>
                    ) : null}
                  </th>
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-3 py-2 tabular-nums whitespace-nowrap ${
                        c.tone === "buy"
                          ? "font-semibold text-buy"
                          : c.tone === "rent"
                            ? "font-semibold text-rent"
                            : "text-ink-soft"
                      }`}
                    >
                      {formatNumber(row[c.key], lang)}
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
