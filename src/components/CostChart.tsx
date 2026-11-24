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
import { formatAED, formatCompactAED } from "@/lib/format";
import type { YearRow } from "@/lib/types";

interface Props {
  data: YearRow[];
  breakevenYear: number | null;
}

const SERIES = [
  { key: "buyNetCost", name: "Buying", color: "var(--buy)" },
  { key: "rentNetCost", name: "Renting", color: "var(--rent)" },
] as const;

export function CostChart({ data, breakevenYear }: Props) {
  return (
    <figure className="m-0">
      <div className="h-56 w-full sm:h-72">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 20, right: 14, left: 0, bottom: 4 }}>
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
              tickFormatter={formatCompactAED}
              stroke="var(--axis)"
              tick={{ fill: "var(--axis)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={46}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--grid)" }} />
            {breakevenYear !== null ? (
              <ReferenceLine
                x={breakevenYear}
                stroke="var(--mark)"
                strokeDasharray="3 3"
                strokeWidth={1}
              >
                <Label
                  value={`Breakeven, year ${breakevenYear}`}
                  position="top"
                  fill="var(--mark)"
                  fontSize={11}
                  offset={10}
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
                strokeWidth={2.25}
                dot={false}
                activeDot={{ r: 3.5, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <figcaption className="px-4 pb-1 text-xs text-ink-faint sm:px-3">
        Cumulative net cost in AED if you exit in that year. Lower is better.
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
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-rule bg-panel px-3 py-2 text-xs shadow-lg">
      <div className="mb-1.5 font-semibold">Year {label}</div>
      <dl className="space-y-1">
        {payload.map((item) => (
          <div key={String(item.dataKey)} className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: item.color }}
            />
            <dt className="text-ink-soft">{item.name}</dt>
            <dd className="ml-auto pl-4 font-semibold tabular-nums">
              {formatAED(Number(item.value))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
