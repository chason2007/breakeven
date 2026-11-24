"use client";

import { NumberField } from "@/components/NumberField";
import { EMIRATE_PRESETS, applyPreset, detectEmirate } from "@/lib/presets";
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
    title: "Fees to buy",
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
    title: "Fees to sell",
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
  const activeNote = EMIRATE_PRESETS.find((p) => p.id === activeEmirate)?.note;

  const set = (key: keyof CalculatorInputs) => (next: number) =>
    onChange({ ...value, [key]: next });

  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend className="sr-only">Emirate</legend>
        <div
          role="group"
          aria-label="Emirate"
          className="flex gap-1 rounded-lg border border-rule p-1"
        >
          {EMIRATE_PRESETS.map((preset) => {
            const active = activeEmirate === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(applyPreset(value, preset.id))}
                aria-pressed={active}
                className={`flex-1 rounded-md px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors ${
                  active
                    ? "bg-buy text-white"
                    : "text-ink-soft hover:bg-rule-soft hover:text-ink"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[0.6875rem] leading-snug text-ink-faint">
          {activeNote ?? "Fees edited by hand. Pick an emirate to restore the statutory rates."}
        </p>
      </fieldset>

      {SECTIONS.map((section) => (
        <fieldset key={section.title}>
          <legend className="w-full border-b border-rule pb-1.5 text-[0.8125rem] font-semibold">
            {section.title}
          </legend>
          <div className="divide-y divide-rule-soft">
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
