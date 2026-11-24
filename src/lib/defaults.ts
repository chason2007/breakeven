import type { CalculatorInputs } from "./types";

// Representative Dubai 2-bed apartment. Tweak as you research current market data.
export const DEFAULT_INPUTS: CalculatorInputs = {
  propertyPrice: 2_000_000,
  downPaymentPct: 20,
  mortgageRatePct: 4.5,
  tenureYears: 25,
  serviceChargePerSqft: 18,
  propertySizeSqft: 1_200,
  maintenancePct: 0.5,
  appreciationPct: 3,

  dldFeePct: 4,
  mortgageRegistrationPct: 0.25,
  agentFeePct: 2,
  otherUpfront: 10_000,

  annualRent: 130_000,
  rentIncreasePct: 5,
  investmentReturnPct: 5,

  horizonYears: 10,
};
