"use client";

import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatAED, formatCompactAED } from "@/lib/format";
import type { YearRow } from "@/lib/types";

interface Props {
  data: YearRow[];
  breakevenYear: number | null;
}

const SERIES = [
  { key: "buyNetCost", name: "Buy", color: "var(--chart-buy)" },
  { key: "rentNetCost", name: "Rent", color: "var(--chart-rent)" },
] as const;

export function CostChart({ data, breakevenYear }: Props) {
  return (
    <div className="h-64 w-full sm:h-80">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="year"
            tickFormatter={(y) => `Y${y}`}
            stroke="var(--chart-axis)"
            tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--chart-grid)" }}
            minTickGap={8}
          />
          <YAxis
            tickFormatter={formatCompactAED}
            stroke="var(--chart-axis)"
            tick={{ fill: "var(--chart-axis)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            verticalAlign="top"
            align="right"
            height={28}
            iconType="plainline"
            iconSize={16}
            formatter={(name) => (
              <span className="text-xs text-slate-600 dark:text-slate-300">{name}</span>
            )}
          />
          {breakevenYear !== null ? (
            <ReferenceLine
              x={breakevenYear}
              stroke="var(--chart-breakeven)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
            >
              <Label
                value={`Breakeven · Y${breakevenYear}`}
                position="insideTopRight"
                fill="var(--chart-axis)"
                fontSize={11}
                offset={8}
              />
            </ReferenceLine>
          ) : null}
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
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
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mb-1.5 font-semibold text-slate-900 dark:text-slate-100">Year {label}</div>
      <dl className="space-y-1">
        {payload.map((item) => (
          <div key={String(item.dataKey)} className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: item.color }}
            />
            <dt className="text-slate-600 dark:text-slate-400">{item.name}</dt>
            <dd className="ml-auto pl-3 font-medium tabular-nums text-slate-900 dark:text-slate-100">
              {formatAED(Number(item.value))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
