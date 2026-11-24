"use client";

import { useState } from "react";
import { NumberField } from "@/components/NumberField";
import { useLanguage } from "@/context/LanguageContext";
import { EMIRATE_PRESETS, applyPreset, detectEmirate } from "@/lib/presets";
import { PRESET_LABELS } from "@/lib/i18n";
import type { CalculatorInputs } from "@/lib/types";
import type { Warning } from "@/lib/validate";

interface Props {
  value: CalculatorInputs;
  warnings: Warning[];
  onChange: (next: CalculatorInputs) => void;
}

interface FieldDef {
  key: keyof CalculatorInputs;
  label: string;
  suffix?: string;
  min: number;
  max: number;
  step: number;
  hint?: string;
}

interface SectionDef {
  id: string;
  title: string;
  icon: React.ReactNode;
  quickChips?: { label: string; value: number; field: keyof CalculatorInputs }[];
  fields: FieldDef[];
}

export function InputPanel({ value, warnings, onChange }: Props) {
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const { lang, t } = useLanguage();
  const activeEmirate = detectEmirate(value);

  const activeNote = activeEmirate
    ? PRESET_LABELS[lang][activeEmirate]?.note
    : null;

  const set = (key: keyof CalculatorInputs) => (next: number) =>
    onChange({ ...value, [key]: next });

  // Core essential fields for Simple mode
  const simpleFields: FieldDef[] = [
    {
      key: "propertyPrice",
      label: t.fields.propertyPrice.label,
      suffix: t.fields.propertyPrice.suffix,
      min: 300_000,
      max: 15_000_000,
      step: 50_000,
    },
    {
      key: "downPaymentPct",
      label: t.fields.downPaymentPct.label,
      suffix: t.fields.downPaymentPct.suffix,
      min: 10,
      max: 100,
      step: 1,
    },
    {
      key: "mortgageRatePct",
      label: t.fields.mortgageRatePct.label,
      suffix: t.fields.mortgageRatePct.suffix,
      min: 0,
      max: 10,
      step: 0.05,
    },
    {
      key: "annualRent",
      label: t.fields.annualRent.label,
      suffix: t.fields.annualRent.suffix,
      min: 20_000,
      max: 1_000_000,
      step: 5_000,
    },
    {
      key: "horizonYears",
      label: t.fields.horizonYears.label,
      suffix: t.fields.horizonYears.suffix,
      min: 1,
      max: 30,
      step: 1,
    },
  ];

  const sections: SectionDef[] = [
    {
      id: "theProperty",
      title: t.sections.theProperty,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-buy">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      fields: [
        {
          key: "propertyPrice",
          label: t.fields.propertyPrice.label,
          suffix: t.fields.propertyPrice.suffix,
          min: 300_000,
          max: 15_000_000,
          step: 50_000,
        },
        {
          key: "propertySizeSqft",
          label: t.fields.propertySizeSqft.label,
          suffix: t.fields.propertySizeSqft.suffix,
          min: 300,
          max: 8_000,
          step: 50,
        },
        {
          key: "appreciationPct",
          label: t.fields.appreciationPct.label,
          suffix: t.fields.appreciationPct.suffix,
          min: -5,
          max: 15,
          step: 0.5,
        },
      ],
    },
    {
      id: "theMortgage",
      title: t.sections.theMortgage,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gold">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      quickChips: [
        { label: "20%", value: 20, field: "downPaymentPct" },
        { label: "25%", value: 25, field: "downPaymentPct" },
        { label: "30%", value: 30, field: "downPaymentPct" },
      ],
      fields: [
        {
          key: "downPaymentPct",
          label: t.fields.downPaymentPct.label,
          suffix: t.fields.downPaymentPct.suffix,
          min: 10,
          max: 100,
          step: 1,
        },
        {
          key: "mortgageRatePct",
          label: t.fields.mortgageRatePct.label,
          suffix: t.fields.mortgageRatePct.suffix,
          min: 0,
          max: 10,
          step: 0.05,
        },
        {
          key: "tenureYears",
          label: t.fields.tenureYears.label,
          suffix: t.fields.tenureYears.suffix,
          min: 1,
          max: 30,
          step: 1,
        },
      ],
    },
    {
      id: "runningCosts",
      title: t.sections.runningCosts,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-ink-faint">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      fields: [
        {
          key: "serviceChargePerSqft",
          label: t.fields.serviceChargePerSqft.label,
          suffix: t.fields.serviceChargePerSqft.suffix,
          min: 0,
          max: 60,
          step: 0.5,
        },
        {
          key: "serviceChargeIncreasePct",
          label: t.fields.serviceChargeIncreasePct.label,
          suffix: t.fields.serviceChargeIncreasePct.suffix,
          min: 0,
          max: 10,
          step: 0.5,
        },
        {
          key: "maintenancePct",
          label: t.fields.maintenancePct.label,
          suffix: t.fields.maintenancePct.suffix,
          min: 0,
          max: 3,
          step: 0.1,
          hint: t.fields.maintenancePct.hint,
        },
      ],
    },
    {
      id: "feesToBuy",
      title: t.sections.feesToBuy,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-buy">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
      fields: [
        {
          key: "dldFeePct",
          label: t.fields.dldFeePct.label,
          suffix: t.fields.dldFeePct.suffix,
          min: 0,
          max: 6,
          step: 0.25,
          hint: t.fields.dldFeePct.hint,
        },
        {
          key: "mortgageRegistrationPct",
          label: t.fields.mortgageRegistrationPct.label,
          suffix: t.fields.mortgageRegistrationPct.suffix,
          min: 0,
          max: 1,
          step: 0.05,
          hint: t.fields.mortgageRegistrationPct.hint,
        },
        {
          key: "agentFeePct",
          label: t.fields.agentFeePct.label,
          suffix: t.fields.agentFeePct.suffix,
          min: 0,
          max: 5,
          step: 0.5,
        },
        {
          key: "otherUpfront",
          label: t.fields.otherUpfront.label,
          suffix: t.fields.otherUpfront.suffix,
          min: 0,
          max: 100_000,
          step: 1_000,
          hint: t.fields.otherUpfront.hint,
        },
      ],
    },
    {
      id: "feesToSell",
      title: t.sections.feesToSell,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-rent">
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 4a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      fields: [
        {
          key: "sellingAgentFeePct",
          label: t.fields.sellingAgentFeePct.label,
          suffix: t.fields.sellingAgentFeePct.suffix,
          min: 0,
          max: 5,
          step: 0.5,
          hint: t.fields.sellingAgentFeePct.hint,
        },
      ],
    },
    {
      id: "renting",
      title: t.sections.renting,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-rent">
          <path
            fillRule="evenodd"
            d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      fields: [
        {
          key: "annualRent",
          label: t.fields.annualRent.label,
          suffix: t.fields.annualRent.suffix,
          min: 20_000,
          max: 1_000_000,
          step: 5_000,
        },
        {
          key: "rentIncreasePct",
          label: t.fields.rentIncreasePct.label,
          suffix: t.fields.rentIncreasePct.suffix,
          min: 0,
          max: 20,
          step: 0.5,
        },
        {
          key: "dewaHousingFeePct",
          label: t.fields.dewaHousingFeePct.label,
          suffix: t.fields.dewaHousingFeePct.suffix,
          min: 0,
          max: 10,
          step: 0.5,
          hint: t.fields.dewaHousingFeePct.hint,
        },
        {
          key: "ejariFeeAnnual",
          label: t.fields.ejariFeeAnnual.label,
          suffix: t.fields.ejariFeeAnnual.suffix,
          min: 0,
          max: 1_000,
          step: 10,
          hint: t.fields.ejariFeeAnnual.hint,
        },
        {
          key: "securityDepositPct",
          label: t.fields.securityDepositPct.label,
          suffix: t.fields.securityDepositPct.suffix,
          min: 0,
          max: 20,
          step: 1,
          hint: t.fields.securityDepositPct.hint,
        },
      ],
    },
    {
      id: "yourAssumptions",
      title: t.sections.yourAssumptions,
      icon: (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-gold">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      fields: [
        {
          key: "investmentReturnPct",
          label: t.fields.investmentReturnPct.label,
          suffix: t.fields.investmentReturnPct.suffix,
          min: 0,
          max: 15,
          step: 0.5,
          hint: t.fields.investmentReturnPct.hint,
        },
        {
          key: "horizonYears",
          label: t.fields.horizonYears.label,
          suffix: t.fields.horizonYears.suffix,
          min: 1,
          max: 30,
          step: 1,
        },
      ],
    },
  ];

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      {/* Mode Switcher: Simple (Essential) vs Advanced (All 21 Parameters) */}
      <div className="flex items-center rounded-xl border border-rule bg-panel p-1 shadow-2xs">
        <button
          type="button"
          onClick={() => setMode("simple")}
          aria-pressed={mode === "simple"}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-bold transition-all ${
            mode === "simple"
              ? "bg-buy text-white shadow-xs"
              : "text-ink-soft hover:bg-rule-soft hover:text-ink"
          }`}
        >
          <span>{t.modeSimple}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              mode === "simple" ? "bg-white/20 text-white" : "bg-rule text-ink-faint"
            }`}
          >
            5
          </span>
        </button>

        <button
          type="button"
          onClick={() => setMode("advanced")}
          aria-pressed={mode === "advanced"}
          className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-bold transition-all ${
            mode === "advanced"
              ? "bg-buy text-white shadow-xs"
              : "text-ink-soft hover:bg-rule-soft hover:text-ink"
          }`}
        >
          <span>{t.modeAdvanced}</span>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
              mode === "advanced" ? "bg-white/20 text-white" : "bg-rule text-ink-faint"
            }`}
          >
            21
          </span>
        </button>
      </div>

      {/* UAE Emirate Preset Selector */}
      <fieldset className="rounded-xl border border-rule bg-panel p-3.5 shadow-2xs">
        <legend className="text-xs font-semibold text-ink-soft mb-2 flex items-center gap-1.5">
          <span>{t.emirate}</span>
          <span className="text-[10px] text-ink-faint font-normal">
            ({t.statutoryBadge})
          </span>
        </legend>
        <div
          role="group"
          aria-label={t.emirate}
          className="flex gap-1.5 rounded-lg border border-rule bg-paper p-1"
        >
          {EMIRATE_PRESETS.map((preset) => {
            const active = activeEmirate === preset.id;
            const localizedPreset = PRESET_LABELS[lang][preset.id];
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onChange(applyPreset(value, preset.id))}
                aria-pressed={active}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "bg-buy text-white shadow-xs"
                    : "text-ink-soft hover:bg-panel hover:text-ink"
                }`}
              >
                {localizedPreset ? localizedPreset.label : preset.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[0.6875rem] leading-relaxed text-ink-faint">
          {activeNote ?? t.emirateManual}
        </p>
      </fieldset>

      {/* SIMPLE MODE: 5 Core Inputs */}
      {mode === "simple" && (
        <div className="space-y-4">
          <fieldset className="rounded-xl border border-rule bg-panel p-4 shadow-2xs">
            <legend className="flex items-center gap-2 text-[0.8125rem] font-bold text-ink">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-buy">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span>{t.coreInputsSection}</span>
            </legend>

            <div className="mt-1 divide-y divide-rule-soft">
              {simpleFields.map((f) => (
                <div key={f.key}>
                  <NumberField
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
                  {/* Quick Preset Chips for Down Payment */}
                  {f.key === "downPaymentPct" && (
                    <div className="flex items-center gap-1.5 pb-2 -mt-1 text-xs">
                      <span className="text-[10px] text-ink-faint">{t.quickPresets}:</span>
                      {[20, 25, 30].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => set("downPaymentPct")(pct)}
                          className={`rounded px-2 py-0.5 text-[11px] font-semibold border transition-all cursor-pointer ${
                            value.downPaymentPct === pct
                              ? "border-buy bg-buy/10 text-buy font-bold"
                              : "border-rule bg-paper text-ink-soft hover:border-ink-faint"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          {/* Simple Mode Explanation Banner & Switcher Link */}
          <div className="rounded-xl border border-rule/70 bg-rule-soft/40 p-3.5 text-xs transition-all">
            <div className="flex items-start gap-2.5">
              <span className="text-sm select-none">⚙️</span>
              <div className="space-y-2">
                <p className="text-ink-soft leading-relaxed text-[0.75rem]">
                  {t.simpleModeNotice}
                </p>
                <button
                  type="button"
                  onClick={() => setMode("advanced")}
                  className="font-bold text-buy hover:underline inline-flex items-center gap-1 text-[0.75rem] cursor-pointer"
                >
                  <span>{t.customizeAll}</span>
                  <span aria-hidden="true">{lang === "ar" ? "←" : "→"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCED MODE: All 21 Inputs in 7 Sections */}
      {mode === "advanced" && (
        <div className="space-y-5">
          {sections.map((section) => (
            <fieldset
              key={section.id}
              className="rounded-xl border border-rule bg-panel p-4 shadow-2xs transition-shadow hover:shadow-xs"
            >
              <legend className="flex items-center gap-2 text-[0.8125rem] font-bold text-ink">
                {section.icon}
                <span>{section.title}</span>
              </legend>

              <div className="mt-1 divide-y divide-rule-soft">
                {section.fields.map((f) => (
                  <div key={f.key}>
                    <NumberField
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
                    {f.key === "downPaymentPct" && (
                      <div className="flex items-center gap-1.5 pb-2 -mt-1 text-xs">
                        <span className="text-[10px] text-ink-faint">{t.quickPresets}:</span>
                        {[20, 25, 30].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => set("downPaymentPct")(pct)}
                            className={`rounded px-2 py-0.5 text-[11px] font-semibold border transition-all cursor-pointer ${
                              value.downPaymentPct === pct
                                ? "border-buy bg-buy/10 text-buy font-bold"
                                : "border-rule bg-paper text-ink-soft hover:border-ink-faint"
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      )}
    </form>
  );
}
