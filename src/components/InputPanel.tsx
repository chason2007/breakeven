"use client";

import type { CalculatorInputs } from "@/lib/types";

type Field = { key: keyof CalculatorInputs; label: string; suffix?: string; step?: number };

const SECTIONS: { title: string; fields: Field[] }[] = [
  {
    title: "Buying",
    fields: [
      { key: "propertyPrice", label: "Property price", suffix: "AED", step: 50_000 },
      { key: "downPaymentPct", label: "Down payment", suffix: "%", step: 1 },
      { key: "mortgageRatePct", label: "Mortgage rate", suffix: "%", step: 0.1 },
      { key: "tenureYears", label: "Tenure", suffix: "yrs", step: 1 },
      { key: "propertySizeSqft", label: "Size", suffix: "sqft", step: 50 },
      { key: "serviceChargePerSqft", label: "Service charge", suffix: "AED/sqft", step: 1 },
      { key: "maintenancePct", label: "Maintenance", suffix: "%/yr", step: 0.1 },
      { key: "appreciationPct", label: "Appreciation", suffix: "%/yr", step: 0.5 },
    ],
  },
  {
    title: "Upfront fees",
    fields: [
      { key: "dldFeePct", label: "DLD transfer fee", suffix: "%", step: 0.25 },
      { key: "mortgageRegistrationPct", label: "Mortgage registration", suffix: "% of loan", step: 0.05 },
      { key: "agentFeePct", label: "Agent fee", suffix: "% + VAT", step: 0.5 },
      { key: "otherUpfront", label: "Other (valuation, trustee…)", suffix: "AED", step: 1_000 },
    ],
  },
  {
    title: "Renting",
    fields: [
      { key: "annualRent", label: "Annual rent", suffix: "AED", step: 5_000 },
      { key: "rentIncreasePct", label: "Rent increase", suffix: "%/yr", step: 0.5 },
      { key: "investmentReturnPct", label: "Investment return", suffix: "%/yr", step: 0.5 },
    ],
  },
  {
    title: "Horizon",
    fields: [{ key: "horizonYears", label: "Compare over", suffix: "yrs", step: 1 }],
  },
];

interface Props {
  value: CalculatorInputs;
  onChange: (next: CalculatorInputs) => void;
}

// TODO: sliders, validation (e.g. min 20% down, max 25-yr tenure), emirate presets (Dubai/Abu Dhabi).
export function InputPanel({ value, onChange }: Props) {
  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {SECTIONS.map((section) => (
        <fieldset key={section.title} className="space-y-3">
          <legend className="text-sm font-semibold uppercase tracking-wide opacity-70">
            {section.title}
          </legend>
          {section.fields.map((f) => (
            <label key={f.key} className="flex items-center justify-between gap-3 text-sm">
              <span>{f.label}</span>
              <span className="flex items-center gap-2">
                <input
                  type="number"
                  step={f.step}
                  min={0}
                  value={value[f.key]}
                  onChange={(e) => onChange({ ...value, [f.key]: Number(e.target.value) })}
                  className="w-32 rounded-md border border-black/15 bg-transparent px-2 py-1 text-right dark:border-white/20"
                />
                <span className="w-20 text-xs opacity-60">{f.suffix}</span>
              </span>
            </label>
          ))}
        </fieldset>
      ))}
    </form>
  );
}
