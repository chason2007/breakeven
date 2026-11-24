"use client";

import { useMemo, useState } from "react";
import { InputPanel } from "@/components/InputPanel";
import { ResultsSummary } from "@/components/ResultsSummary";
import { CostChart } from "@/components/CostChart";
import { DEFAULT_INPUTS } from "@/lib/defaults";
import { calculate } from "@/lib/calc";
import type { CalculatorInputs } from "@/lib/types";

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const result = useMemo(() => calculate(inputs), [inputs]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">UAE Rent vs Buy</h1>
        <p className="mt-2 opacity-70">
          Compare the true cost of renting versus buying a home in the UAE, including DLD fees,
          service charges and opportunity cost.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <aside className="rounded-xl border border-black/10 p-5 dark:border-white/15">
          <InputPanel value={inputs} onChange={setInputs} />
        </aside>

        <section className="space-y-6">
          <ResultsSummary result={result} horizonYears={inputs.horizonYears} />
          <div className="rounded-xl border border-black/10 p-5 dark:border-white/15">
            <h2 className="mb-4 font-semibold">Cumulative net cost over time</h2>
            <CostChart data={result.years} />
          </div>
          {/* TODO: year-by-year table, assumptions/methodology section, share-via-URL state */}
        </section>
      </div>
    </main>
  );
}
