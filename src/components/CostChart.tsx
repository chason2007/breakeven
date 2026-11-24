"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { YearRow } from "@/lib/types";
import { formatAED } from "@/lib/format";

// TODO: mark breakeven with a ReferenceLine, theme colors for dark mode, toggle cash-out vs net-cost view.
export function CostChart({ data }: { data: YearRow[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 16, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="year" tickFormatter={(y) => `Y${y}`} />
          <YAxis tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
          <Tooltip formatter={(v) => formatAED(Number(v))} labelFormatter={(y) => `Year ${y}`} />
          <Legend />
          <Line type="monotone" dataKey="buyNetCost" name="Buy (net cost)" stroke="#2563eb" dot={false} strokeWidth={2} />
          <Line type="monotone" dataKey="rentNetCost" name="Rent (net cost)" stroke="#ea580c" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
