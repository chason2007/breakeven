// All money values are AED. Rates are annual percentages (e.g. 4.5 = 4.5%).

export interface CalculatorInputs {
  // Buy side
  propertyPrice: number;
  downPaymentPct: number; // UAE min: 20% (expat, first home < AED 5M), 25% above 5M
  mortgageRatePct: number;
  tenureYears: number; // UAE max: 25 years
  serviceChargePerSqft: number; // AED / sqft / year (paid by owner)
  propertySizeSqft: number;
  serviceChargeIncreasePct: number; // service charges drift up each year
  maintenancePct: number; // % of property value per year
  appreciationPct: number;

  // Upfront purchase costs (Dubai defaults)
  dldFeePct: number; // Land department transfer fee: Dubai 4%, Abu Dhabi 2%
  mortgageRegistrationPct: number; // 0.25% of loan amount + AED 290
  agentFeePct: number; // typically 2% + VAT
  otherUpfront: number; // trustee, valuation, bank processing, etc.

  // Exit costs (charged on the assumed sale at the end of the horizon)
  sellingAgentFeePct: number; // typically 2% + VAT, on the sale price

  // Rent side
  annualRent: number;
  rentIncreasePct: number; // capped by RERA rental index in Dubai
  dewaHousingFeePct: number; // municipality housing fee, 5% of annual rent
  ejariFeeAnnual: number; // tenancy contract registration, ~AED 220/yr
  securityDepositPct: number; // 5% of annual rent, refunded on exit
  investmentReturnPct: number; // opportunity cost on down payment + upfront costs

  // Horizon
  horizonYears: number;
}

export interface YearRow {
  year: number;
  // Cumulative net cost (cash out minus net sale proceeds) — the comparison metric
  buyNetCost: number;
  rentNetCost: number;
  // Cash flows in that year
  buyCashOut: number;
  rentCashOut: number;
  // Buy-side components for the year-by-year breakdown
  mortgagePaid: number;
  serviceCharge: number;
  maintenance: number;
  homeValue: number;
  loanBalance: number;
  equity: number;
  // Cost of selling in this year (agent fee + VAT + early settlement fee)
  sellingCosts: number;
  // What the buyer actually walks away with if they sell in this year
  netSaleProceeds: number;
  // Rent-side components
  rentPaid: number;
  housingFee: number;
  ejariFee: number;
  renterPortfolio: number;
}

export interface CalculatorResult {
  loanAmount: number;
  monthlyMortgage: number;
  monthlyBuyCost: number; // mortgage + service charge + maintenance, year 1
  monthlyRentCost: number; // rent + housing fee + Ejari, year 1
  upfrontCosts: number; // buy-side transaction fees, excludes the down payment
  securityDeposit: number; // rent-side cash tied up, refunded on exit
  breakevenYear: number | null; // first year buying is cheaper; null if never within horizon
  years: YearRow[];
}
