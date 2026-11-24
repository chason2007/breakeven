"use client";

import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLanguage } from "@/context/LanguageContext";
import { formatAED, formatCompactAED } from "@/lib/format";
import type { YearRow } from "@/lib/types";

interface Props {
  data: YearRow[];
  breakevenYear: number | null;
}

export function CostChart({ data, breakevenYear }: Props) {
  const { lang, t } = useLanguage();

  const series = [
    { key: "buyNetCost", name: t.chartBuySeries, color: "var(--buy)" },
    { key: "rentNetCost", name: t.chartRentSeries, color: "var(--rent)" },
  ] as const;

  return (
    <figure className="m-0">
      <div className="h-60 w-full sm:h-76" dir="ltr">
        {/*
          Recharts SVG is inherently LTR coordinate-based; we render it in LTR
          so mathematical coordinates and SVG line charts remain correct and smooth.
        */}
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 24, right: 16, left: 4, bottom: 6 }}>
            <CartesianGrid stroke="var(--grid)" strokeDasharray="2 4" vertical={false} />
            <XAxis
              dataKey="year"
              tickFormatter={(y) => String(y)}
              stroke="var(--axis)"
              tick={{ fill: "var(--axis)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--grid)" }}
              interval="preserveStartEnd"
              minTickGap={14}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={(v) => formatCompactAED(v, lang)}
              stroke="var(--axis)"
              tick={{ fill: "var(--axis)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={54}
            />
            <Tooltip content={<ChartTooltip lang={lang} yearLabel={t.yearLabel} />} cursor={{ stroke: "var(--grid)" }} />
            {breakevenYear !== null ? (
              <ReferenceLine
                x={breakevenYear}
                stroke="var(--gold-dark)"
                strokeDasharray="3 3"
                strokeWidth={1.5}
              >
                <Label
                  value={`${t.breakeven}, ${t.yearLabel} ${breakevenYear}`}
                  position="top"
                  fill="var(--gold-dark)"
                  fontSize={11}
                  fontWeight={600}
                  offset={10}
                />
              </ReferenceLine>
            ) : null}
            {series.map((s) => (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4.5, strokeWidth: 1.5, stroke: "#fff" }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="px-4 pb-1 text-xs text-ink-faint sm:px-3 text-center sm:text-start">
        {t.chartCaption}
      </figcaption>
    </figure>
  );
}

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
}

function ChartTooltip({
  active,
  payload,
  label,
  lang,
  yearLabel,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  lang: "en" | "ar";
  yearLabel: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border border-rule bg-panel px-3.5 py-2.5 text-xs shadow-lg"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="mb-2 font-bold text-ink border-b border-rule-soft pb-1">
        {yearLabel} {label}
      </div>
      <dl className="space-y-1.5">
        {payload.map((item) => (
          <div key={String(item.dataKey)} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: item.color }}
            />
            <dt className="text-ink-soft">{item.name}</dt>
            <dd className="ms-auto ps-4 font-semibold tabular-nums text-ink">
              {formatAED(Number(item.value), lang)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
