"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DecisionPanel } from "@/components/DecisionPanel";
import { InputPanel } from "@/components/InputPanel";
import { Methodology } from "@/components/Methodology";
import { YearTable } from "@/components/YearTable";
import { useLanguage } from "@/context/LanguageContext";
import { calculate } from "@/lib/calc";
import { DEFAULT_INPUTS } from "@/lib/defaults";
import type { CalculatorInputs } from "@/lib/types";
import { decodeInputs, encodeInputs } from "@/lib/urlState";
import { validate } from "@/lib/validate";

export function Calculator() {
  const searchParams = useSearchParams();
  const { lang, t } = useLanguage();

  // Read the query string once, on first render, so a shared link lands on the
  // right figures with no flash of defaults. Later URL writes are ours.
  const [inputs, setInputs] = useState<CalculatorInputs>(() => decodeInputs(searchParams));

  const result = useMemo(() => calculate(inputs), [inputs]);
  const warnings = useMemo(() => validate(inputs, lang), [inputs, lang]);
  const query = useMemo(() => encodeInputs(inputs), [inputs]);

  // Keep the URL shareable without pushing a history entry per keystroke.
  useEffect(() => {
    if (window.location.search.replace(/^\?/, "") === query) return;
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [query]);

  const isDefault = query === "";

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[20.5rem_minmax(0,1fr)] lg:gap-12">
      {/*
        The verdict comes first in the DOM so mobile and screen readers get
        the bottom-line answer before 21 inputs. On large screens grid placement moves
        the controls back to the first rail without reordering the markup.
      */}
      <div className="space-y-8 lg:col-start-2 lg:row-start-1">
        <DecisionPanel result={result} horizonYears={inputs.horizonYears} />
        <div className="space-y-6">
          <YearTable years={result.years} breakevenYear={result.breakevenYear} />
          <Methodology />
        </div>
      </div>

      <aside className="lg:col-start-1 lg:row-start-1 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:pe-2">
        <div className="mb-4 flex items-center justify-between border-b border-rule pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-buy" />
            <h2 className="text-sm font-bold text-ink">{t.yourNumbers}</h2>
          </div>
          <button
            type="button"
            onClick={() => setInputs(DEFAULT_INPUTS)}
            disabled={isDefault}
            className="rounded-md px-2 py-1 text-xs font-semibold text-ink-faint transition-all hover:bg-rule-soft hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-faint cursor-pointer disabled:cursor-not-allowed"
          >
            {t.reset}
          </button>
        </div>
        <InputPanel value={inputs} warnings={warnings} onChange={setInputs} />
      </aside>
    </div>
  );
}
