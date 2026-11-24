"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CostChart } from "@/components/CostChart";
import { InputPanel } from "@/components/InputPanel";
import { Methodology } from "@/components/Methodology";
import { ResultsSummary } from "@/components/ResultsSummary";
import { ShareButton } from "@/components/ShareButton";
import { VerdictCard } from "@/components/VerdictCard";
import { YearTable } from "@/components/YearTable";
import { calculate } from "@/lib/calc";
import { DEFAULT_INPUTS } from "@/lib/defaults";
import type { CalculatorInputs } from "@/lib/types";
import { decodeInputs, encodeInputs } from "@/lib/urlState";
import { validate } from "@/lib/validate";

export function Calculator() {
  const searchParams = useSearchParams();
  // Read the query string once, on first render, so a shared link lands on the
  // right figures with no flash of defaults. Later URL writes are ours.
  const [inputs, setInputs] = useState<CalculatorInputs>(() => decodeInputs(searchParams));

  const result = useMemo(() => calculate(inputs), [inputs]);
  const warnings = useMemo(() => validate(inputs), [inputs]);
  const query = useMemo(() => encodeInputs(inputs), [inputs]);

  // Keep the URL shareable without pushing history entries for every keystroke.
  useEffect(() => {
    const next = query ? `?${query}` : window.location.pathname;
    if (window.location.search.replace(/^\?/, "") !== query) {
      window.history.replaceState(null, "", next);
    }
  }, [query]);

  const reset = () => setInputs(DEFAULT_INPUTS);
  const isDefault = query === "";

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-8">
      <aside className="rounded-2xl border border-slate-200 bg-surface p-5 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto dark:border-slate-800">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="font-semibold">Your numbers</h2>
          <button
            type="button"
            onClick={reset}
            disabled={isDefault}
            className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 disabled:opacity-40 disabled:hover:text-slate-500 dark:text-slate-400 dark:hover:text-white dark:disabled:hover:text-slate-400"
          >
            Reset
          </button>
        </div>
        <InputPanel value={inputs} warnings={warnings} onChange={setInputs} />
      </aside>

      <div className="space-y-6">
        <VerdictCard result={result} horizonYears={inputs.horizonYears} />
        <ResultsSummary result={result} horizonYears={inputs.horizonYears} />

        <section className="rounded-2xl border border-slate-200 bg-surface p-5 sm:p-6 dark:border-slate-800">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">Cumulative net cost</h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Cash spent minus what you walk away with, if you exit in that year.
              </p>
            </div>
            <ShareButton />
          </div>
          <CostChart data={result.years} breakevenYear={result.breakevenYear} />
        </section>

        <YearTable years={result.years} breakevenYear={result.breakevenYear} />
        <Methodology />
      </div>
    </div>
  );
}
