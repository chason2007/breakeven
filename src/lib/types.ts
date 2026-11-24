// All money values are AED. Rates are annual percentages (e.g. 4.5 = 4.5%).

export interface CalculatorInputs {
  // Buy side
  propertyPrice: number;
  downPaymentPct: number; // UAE min: 20% (expat, first home < AED 5M), 25% above 5M
  mortgageRatePct: number;
  tenureYears: number; // UAE max: 25 years
  serviceChargePerSqft: number; // AED / sqft / year (paid by owner)
  propertySizeSqft: number;
  maintenancePct: number; // % of property value per year
  appreciationPct: number;

  // Upfront purchase costs (Dubai defaults)
  dldFeePct: number; // Dubai Land Department transfer fee, 4%
  mortgageRegistrationPct: number; // 0.25% of loan amount + AED 290
  agentFeePct: number; // typically 2% + VAT
  otherUpfront: number; // trustee, valuation, bank processing, etc.

  // Rent side
  annualRent: number;
  rentIncreasePct: number; // capped by RERA rental index in Dubai
  investmentReturnPct: number; // opportunity cost on down payment + upfront costs

  // Horizon
  horizonYears: number;
}

export interface YearRow {
  year: number;
  // Cumulative net cost (cash out minus equity) — the comparison metric
  buyNetCost: number;
  rentNetCost: number;
  // Cash flows in that year
  buyCashOut: number;
  rentCashOut: number;
  homeValue: number;
  loanBalance: number;
  equity: number;
}

export interface CalculatorResult {
  loanAmount: number;
  monthlyMortgage: number;
  monthlyBuyCost: number; // mortgage + service charge + maintenance, year 1
  monthlyRentCost: number; // year 1
  upfrontCosts: number; // excludes down payment
  breakevenYear: number | null; // first year buying is cheaper; null if never within horizon
  years: YearRow[];
}
