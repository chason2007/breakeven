"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DecisionPanel } from "@/components/DecisionPanel";
import { InputPanel } from "@/components/InputPanel";
import { Methodology } from "@/components/Methodology";
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

  // Keep the URL shareable without pushing a history entry per keystroke.
  useEffect(() => {
    if (window.location.search.replace(/^\?/, "") === query) return;
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [query]);

  const isDefault = query === "";

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-14">
      {/*
        The verdict comes first in the DOM so a phone (and a screen reader) gets
        the answer before 21 inputs. On large screens grid placement moves the
        controls back to the left rail without reordering the markup.
      */}
      <div className="space-y-10 lg:col-start-2 lg:row-start-1">
        <DecisionPanel result={result} horizonYears={inputs.horizonYears} />
        <div>
          <YearTable years={result.years} breakevenYear={result.breakevenYear} />
          <Methodology />
        </div>
      </div>

      <aside className="lg:col-start-1 lg:row-start-1 lg:sticky lg:top-8 lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:pr-4">
        <div className="mb-5 flex items-baseline justify-between gap-3 border-b border-rule pb-2">
          <h2 className="text-sm font-semibold">Your numbers</h2>
          <button
            type="button"
            onClick={() => setInputs(DEFAULT_INPUTS)}
            disabled={isDefault}
            className="text-xs font-medium text-ink-faint transition-colors hover:text-ink disabled:opacity-40 disabled:hover:text-ink-faint"
          >
            Reset
          </button>
        </div>
        <InputPanel value={inputs} warnings={warnings} onChange={setInputs} />
      </aside>
    </div>
  );
}
