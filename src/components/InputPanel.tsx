"use client";

import { NumberField } from "@/components/NumberField";
import { EMIRATE_PRESETS, type EmirateId, applyPreset, detectEmirate } from "@/lib/presets";
import type { CalculatorInputs } from "@/lib/types";
import type { Warning } from "@/lib/validate";

type Field = {
  key: keyof CalculatorInputs;
  label: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  hint?: string;
};

const SECTIONS: { title: string; fields: Field[] }[] = [
  {
    title: "The property",
    fields: [
      {
        key: "propertyPrice",
        label: "Property price",
        suffix: "AED",
        min: 300_000,
        max: 15_000_000,
        step: 50_000,
      },
      {
        key: "propertySizeSqft",
        label: "Size",
        suffix: "sqft",
        min: 300,
        max: 8_000,
        step: 50,
      },
      {
        key: "appreciationPct",
        label: "Appreciation",
        suffix: "%/yr",
        min: -5,
        max: 15,
        step: 0.5,
      },
    ],
  },
  {
    title: "The mortgage",
    fields: [
      {
        key: "downPaymentPct",
        label: "Down payment",
        suffix: "%",
        min: 10,
        max: 100,
        step: 1,
      },
      {
        key: "mortgageRatePct",
        label: "Interest rate",
        suffix: "%",
        min: 0,
        max: 10,
        step: 0.05,
      },
      { key: "tenureYears", label: "Tenure", suffix: "yrs", min: 1, max: 30, step: 1 },
    ],
  },
  {
    title: "Running costs",
    fields: [
      {
        key: "serviceChargePerSqft",
        label: "Service charge",
        suffix: "AED/sqft",
        min: 0,
        max: 60,
        step: 0.5,
      },
      {
        key: "serviceChargeIncreasePct",
        label: "Service charge rise",
        suffix: "%/yr",
        min: 0,
        max: 10,
        step: 0.5,
      },
      {
        key: "maintenancePct",
        label: "Maintenance",
        suffix: "%/yr",
        min: 0,
        max: 3,
        step: 0.1,
        hint: "Share of property value spent on upkeep each year.",
      },
    ],
  },
  {
    title: "Buying fees",
    fields: [
      {
        key: "dldFeePct",
        label: "Transfer fee",
        suffix: "%",
        min: 0,
        max: 6,
        step: 0.25,
        hint: "Dubai Land Department 4%; Abu Dhabi 2%.",
      },
      {
        key: "mortgageRegistrationPct",
        label: "Mortgage registration",
        suffix: "% of loan",
        min: 0,
        max: 1,
        step: 0.05,
      },
      { key: "agentFeePct", label: "Agent fee", suffix: "% + VAT", min: 0, max: 5, step: 0.5 },
      {
        key: "otherUpfront",
        label: "Other fees",
        suffix: "AED",
        min: 0,
        max: 100_000,
        step: 1_000,
        hint: "Valuation, trustee office, bank processing.",
      },
    ],
  },
  {
    title: "Selling fees",
    fields: [
      {
        key: "sellingAgentFeePct",
        label: "Agent fee on sale",
        suffix: "% + VAT",
        min: 0,
        max: 5,
        step: 0.5,
        hint: "Early mortgage settlement (1%, capped at AED 10,000) is added automatically.",
      },
    ],
  },
  {
    title: "Renting",
    fields: [
      {
        key: "annualRent",
        label: "Annual rent",
        suffix: "AED",
        min: 20_000,
        max: 1_000_000,
        step: 5_000,
      },
      {
        key: "rentIncreasePct",
        label: "Rent increase",
        suffix: "%/yr",
        min: 0,
        max: 20,
        step: 0.5,
      },
      {
        key: "dewaHousingFeePct",
        label: "Housing fee",
        suffix: "% of rent",
        min: 0,
        max: 10,
        step: 0.5,
        hint: "DEWA / municipality charge on the tenancy.",
      },
      {
        key: "ejariFeeAnnual",
        label: "Ejari registration",
        suffix: "AED/yr",
        min: 0,
        max: 1_000,
        step: 10,
      },
      {
        key: "securityDepositPct",
        label: "Security deposit",
        suffix: "% of rent",
        min: 0,
        max: 20,
        step: 1,
        hint: "Refundable, so it costs only the forgone investment return.",
      },
    ],
  },
  {
    title: "Your assumptions",
    fields: [
      {
        key: "investmentReturnPct",
        label: "Investment return",
        suffix: "%/yr",
        min: 0,
        max: 15,
        step: 0.5,
        hint: "What the renter earns on the cash a buyer would tie up.",
      },
      { key: "horizonYears", label: "Compare over", suffix: "yrs", min: 1, max: 30, step: 1 },
    ],
  },
];

interface Props {
  value: CalculatorInputs;
  warnings: Warning[];
  onChange: (next: CalculatorInputs) => void;
}

export function InputPanel({ value, warnings, onChange }: Props) {
  const activeEmirate = detectEmirate(value);

  const set = (key: keyof CalculatorInputs) => (next: number) =>
    onChange({ ...value, [key]: next });

  const choosePreset = (id: EmirateId) => onChange(applyPreset(value, id));

  return (
    <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Emirate
        </legend>
        <div
          role="group"
          aria-label="Emirate preset"
          className="flex rounded-xl border border-slate-300 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800/60"
        >
          {EMIRATE_PRESETS.map((preset) => {
            const active = activeEmirate === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => choosePreset(preset.id)}
                aria-pressed={active}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 ${
                  active
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs leading-snug text-slate-500 dark:text-slate-400">
          {activeEmirate
            ? EMIRATE_PRESETS.find((p) => p.id === activeEmirate)!.note
            : "Custom fees — pick an emirate to reset the statutory rates."}
        </p>
      </fieldset>

      {SECTIONS.map((section) => (
        <fieldset key={section.title}>
          <legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {section.title}
          </legend>
          <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
            {section.fields.map((f) => (
              <NumberField
                key={f.key}
                label={f.label}
                suffix={f.suffix}
                hint={f.hint}
                min={f.min}
                max={f.max}
                step={f.step}
                value={value[f.key]}
                warnings={warnings.filter((w) => w.field === f.key)}
                onChange={set(f.key)}
              />
            ))}
          </div>
        </fieldset>
      ))}
    </form>
  );
}
