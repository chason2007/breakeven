import { DEFAULT_INPUTS } from "./defaults";
import type { CalculatorInputs } from "./types";

/**
 * Short query-string keys, so a shared link stays readable. Only inputs that
 * differ from the defaults are written, which keeps the common case tidy.
 */
const KEYS: Record<keyof CalculatorInputs, string> = {
  propertyPrice: "pp",
  downPaymentPct: "dp",
  mortgageRatePct: "mr",
  tenureYears: "ty",
  serviceChargePerSqft: "sc",
  propertySizeSqft: "sz",
  serviceChargeIncreasePct: "si",
  maintenancePct: "mt",
  appreciationPct: "ap",
  dldFeePct: "tf",
  mortgageRegistrationPct: "mg",
  agentFeePct: "af",
  otherUpfront: "ou",
  sellingAgentFeePct: "sf",
  annualRent: "ar",
  rentIncreasePct: "ri",
  dewaHousingFeePct: "hf",
  ejariFeeAnnual: "ej",
  securityDepositPct: "sd",
  investmentReturnPct: "ir",
  horizonYears: "hz",
};

const ENTRIES = Object.entries(KEYS) as [keyof CalculatorInputs, string][];

/** Serialise the inputs that differ from the defaults into a query string. */
export function encodeInputs(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();
  for (const [field, key] of ENTRIES) {
    const value = inputs[field];
    if (Number.isFinite(value) && value !== DEFAULT_INPUTS[field]) {
      params.set(key, String(round(value)));
    }
  }
  return params.toString();
}

/** Read inputs back out, falling back to the defaults for anything missing or junk. */
export function decodeInputs(
  params: URLSearchParams | ReadonlyURLSearchParamsLike | null | undefined,
): CalculatorInputs {
  const inputs = { ...DEFAULT_INPUTS };
  if (!params) return inputs;

  for (const [field, key] of ENTRIES) {
    const raw = params.get(key);
    if (raw === null || raw.trim() === "") continue;
    const value = Number(raw);
    if (!Number.isFinite(value)) continue;
    inputs[field] = value;
  }
  return inputs;
}

/** The share URL for a given set of inputs, relative to an origin + path. */
export function shareUrl(base: string, inputs: CalculatorInputs): string {
  const query = encodeInputs(inputs);
  return query ? `${base}?${query}` : base;
}

/** Minimal shape so this module never needs to import from next/navigation. */
interface ReadonlyURLSearchParamsLike {
  get(name: string): string | null;
}

// Trim float noise (0.30000000000000004) out of shared links.
const round = (n: number) => Math.round(n * 1e6) / 1e6;
