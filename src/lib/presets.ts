import type { CalculatorInputs } from "./types";

export type EmirateId = "dubai" | "abuDhabi";

export interface EmiratePreset {
  id: EmirateId;
  label: string;
  /** Fields the preset overrides; everything else is left as the user set it. */
  overrides: Partial<CalculatorInputs>;
}

export const EMIRATE_PRESETS: EmiratePreset[] = [
  {
    id: "dubai",
    label: "Dubai",
    overrides: {
      dldFeePct: 4,
      ejariFeeAnnual: 220,
      dewaHousingFeePct: 5,
    },
  },
  {
    id: "abuDhabi",
    label: "Abu Dhabi",
    overrides: {
      dldFeePct: 2,
      ejariFeeAnnual: 0,
      dewaHousingFeePct: 3,
    },
  },
];

export const getPreset = (id: EmirateId): EmiratePreset =>
  EMIRATE_PRESETS.find((p) => p.id === id) ?? EMIRATE_PRESETS[0];

export const applyPreset = (inputs: CalculatorInputs, id: EmirateId): CalculatorInputs => ({
  ...inputs,
  ...getPreset(id).overrides,
});

/** Which preset (if any) the current inputs already match. */
export function detectEmirate(inputs: CalculatorInputs): EmirateId | null {
  const match = EMIRATE_PRESETS.find((preset) =>
    Object.entries(preset.overrides).every(
      ([key, value]) => inputs[key as keyof CalculatorInputs] === value,
    ),
  );
  return match?.id ?? null;
}
