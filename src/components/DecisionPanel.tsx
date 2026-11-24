"use client";

import { CostChart } from "@/components/CostChart";
import { ShareButton } from "@/components/ShareButton";
import { useLanguage } from "@/context/LanguageContext";
import { formatAED } from "@/lib/format";
import { getLocalizedVerdict } from "@/lib/i18n";
import type { CalculatorResult } from "@/lib/types";

interface Props {
  result: CalculatorResult;
  horizonYears: number;
}

export function DecisionPanel({ result, horizonYears }: Props) {
  const { lang, isArabic, t } = useLanguage();
  const v = getLocalizedVerdict(result, horizonYears, lang);
  const last = result.years.at(-1);

  const figures = [
    {
      label: t.monthlyOwn,
      value: formatAED(result.monthlyBuyCost, lang),
      tone: "buy" as const,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      label: t.monthlyRent,
      value: formatAED(result.monthlyRentCost, lang),
      tone: "rent" as const,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: t.breakeven,
      value: result.breakevenYear
        ? `${t.yearLabel} ${result.breakevenYear}`
        : t.never,
      tone: "none" as const,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      label: t.feesToBuy,
      value: formatAED(result.upfrontCosts, lang),
      tone: "none" as const,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  const breakevenProgress =
    result.breakevenYear && horizonYears > 0
      ? Math.min(Math.round((result.breakevenYear / horizonYears) * 100), 100)
      : null;

  return (
    <section
      aria-labelledby="verdict"
      className="overflow-hidden rounded-2xl border border-rule bg-panel shadow-sm transition-all"
    >
      <div className="px-5 pt-6 pb-5 sm:px-8 sm:pt-8">
        {/* Outcome Badge */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              v.kind === "buy"
                ? "bg-buy-wash text-buy border border-buy/20"
                : v.kind === "rent"
                  ? "bg-rent-wash text-rent border border-rent/20"
                  : "bg-rule-soft text-ink-soft border border-rule"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                v.kind === "buy" ? "bg-buy" : v.kind === "rent" ? "bg-rent" : "bg-ink-faint"
              }`}
            />
            {v.badgeLabel}
          </span>

          <span className="text-xs text-ink-faint font-medium">
            {isArabic ? `أفق التحليل: ${horizonYears} سنوات` : `${horizonYears}-Year Horizon Analysis`}
          </span>
        </div>

        <h2
          id="verdict"
          className={`font-display text-[1.75rem] leading-[1.1] font-semibold text-balance sm:text-[2.35rem] ${
            v.kind === "buy" ? "text-buy" : v.kind === "rent" ? "text-rent" : "text-ink"
          }`}
        >
          {v.headline}
        </h2>
        <p className="mt-3 max-w-[50ch] text-[0.9375rem] leading-relaxed text-ink-soft">
          {v.detail}
        </p>

        {/* Breakeven Timeline bar (if applicable) */}
        {breakevenProgress !== null && (
          <div className="mt-5 rounded-lg bg-rule-soft/60 p-3 text-xs">
            <div className="flex items-center justify-between text-ink-soft">
              <span className="font-medium">
                {isArabic
                  ? `تتحقق نقطة التعادل في السنة ${result.breakevenYear} من أصل ${horizonYears} سنوات (${breakevenProgress}%)`
                  : `Breakeven reached at Year ${result.breakevenYear} of ${horizonYears}-year horizon (${breakevenProgress}%)`}
              </span>
              <span className="font-semibold tabular-nums text-buy">
                {result.breakevenYear} / {horizonYears} {t.years}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-rule">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rent via-gold to-buy transition-all duration-500"
                style={{ width: `${breakevenProgress}%` }}
              />
            </div>
          </div>
        )}

        {last ? (
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
            <Side
              tone="buy"
              label={`${t.buyingOver} ${horizonYears} ${
                horizonYears === 1 ? t.year : t.years
              }`}
              value={formatAED(last.buyNetCost, lang)}
            />
            <Side
              tone="rent"
              label={`${t.rentingOver} ${horizonYears} ${
                horizonYears === 1 ? t.year : t.years
              }`}
              value={formatAED(last.rentNetCost, lang)}
            />
          </div>
        ) : null}
      </div>

      <div className="px-2 pb-2 sm:px-5 sm:pb-4">
        <CostChart data={result.years} breakevenYear={result.breakevenYear} />
      </div>

      {/* Enhanced Metric Cards */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-rule bg-paper/60 px-5 py-4 sm:px-8">
        <dl className="grid grow grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {figures.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-rule/80 bg-panel p-3 shadow-xs transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-1.5 text-xs text-ink-faint">
                <span className={f.tone === "buy" ? "text-buy" : f.tone === "rent" ? "text-rent" : "text-ink-faint"}>
                  {f.icon}
                </span>
                <dt className="truncate">{f.label}</dt>
              </div>
              <dd
                className={`mt-1.5 text-base sm:text-lg font-bold tabular-nums ${
                  f.tone === "buy" ? "text-buy" : f.tone === "rent" ? "text-rent" : "text-ink"
                }`}
              >
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="w-full sm:w-auto flex justify-end">
          <ShareButton />
        </div>
      </div>
    </section>
  );
}

function Side({ tone, label, value }: { tone: "buy" | "rent"; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-md bg-rule-soft/50 px-2.5 py-1">
      <span
        aria-hidden="true"
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone === "buy" ? "bg-buy" : "bg-rent"}`}
      />
      <span className="text-ink-soft text-xs sm:text-sm">{label}:</span>
      <span className="font-semibold tabular-nums text-xs sm:text-sm">{value}</span>
    </div>
  );
}
