import type { CalculatorInputs, CalculatorResult, YearRow } from "./types";

/** Flat DLD mortgage registration admin fee (AED), independent of loan size. */
export const DLD_MORTGAGE_ADMIN_FEE = 290;

/** VAT applied to broker/agent services in the UAE. */
export const VAT_RATE = 0.05;

/**
 * UAE Central Bank caps early mortgage settlement at 1% of the outstanding
 * balance or AED 10,000, whichever is lower.
 */
export const EARLY_SETTLEMENT_PCT = 1;
export const EARLY_SETTLEMENT_CAP = 10_000;

/** Standard amortizing monthly payment. */
export function monthlyPayment(principal: number, annualRatePct: number, years: number): number {
  const n = years * 12;
  const r = annualRatePct / 100 / 12;
  if (n <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/** Loan balance remaining after `months` payments. */
export function remainingBalance(
  principal: number,
  annualRatePct: number,
  years: number,
  months: number,
): number {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (months >= n) return 0;
  if (r === 0) return principal * (1 - months / n);
  const pmt = monthlyPayment(principal, annualRatePct, years);
  return principal * Math.pow(1 + r, months) - (pmt * (Math.pow(1 + r, months) - 1)) / r;
}

/** Penalty for clearing the mortgage early: 1% of the balance, capped at AED 10,000. */
export function earlySettlementFee(loanBalance: number): number {
  if (loanBalance <= 0) return 0;
  return Math.min((loanBalance * EARLY_SETTLEMENT_PCT) / 100, EARLY_SETTLEMENT_CAP);
}

/** What it costs to sell: agent commission + VAT, plus any early settlement penalty. */
export function sellingCosts(
  saleValue: number,
  loanBalance: number,
  agentFeePct: number,
): number {
  return ((saleValue * agentFeePct) / 100) * (1 + VAT_RATE) + earlySettlementFee(loanBalance);
}

export function calculate(i: CalculatorInputs): CalculatorResult {
  const downPayment = (i.propertyPrice * i.downPaymentPct) / 100;
  const loanAmount = i.propertyPrice - downPayment;
  const monthlyMortgage = monthlyPayment(loanAmount, i.mortgageRatePct, i.tenureYears);

  const upfrontCosts =
    (i.propertyPrice * i.dldFeePct) / 100 +
    (loanAmount * i.mortgageRegistrationPct) / 100 +
    DLD_MORTGAGE_ADMIN_FEE +
    ((i.propertyPrice * i.agentFeePct) / 100) * (1 + VAT_RATE) + // agent fee + VAT
    i.otherUpfront;

  // Refundable, so not a cost — but it is cash the renter cannot invest.
  const securityDeposit = (i.annualRent * i.securityDepositPct) / 100;

  const ret = i.investmentReturnPct / 100;
  const buyUpfront = downPayment + upfrontCosts;

  const years: YearRow[] = [];
  let buyCash = buyUpfront;
  let rentCash = 0;
  let rent = i.annualRent;
  let serviceCharge = i.serviceChargePerSqft * i.propertySizeSqft;
  // The renter invests the cash the buyer sank into the purchase, less the
  // deposit their landlord holds (refunded on exit, so it earns nothing).
  let renterPortfolio = Math.max(0, buyUpfront - securityDeposit);
  let renterContributed = renterPortfolio;

  for (let y = 1; y <= i.horizonYears; y++) {
    const homeValue = i.propertyPrice * Math.pow(1 + i.appreciationPct / 100, y);
    const loanBalance = remainingBalance(loanAmount, i.mortgageRatePct, i.tenureYears, y * 12);
    const mortgagePaid = y <= i.tenureYears ? monthlyMortgage * 12 : 0;
    const maintenance = (homeValue * i.maintenancePct) / 100;
    const serviceChargeThisYear = serviceCharge;
    const buyCashOut = mortgagePaid + serviceChargeThisYear + maintenance;
    buyCash += buyCashOut;

    const rentPaid = rent;
    const housingFee = (rent * i.dewaHousingFeePct) / 100;
    const rentCashOut = rentPaid + housingFee + i.ejariFeeAnnual;
    rentCash += rentCashOut;

    renterPortfolio *= 1 + ret;
    // The renter also invests any annual surplus vs. owning.
    const surplus = Math.max(0, buyCashOut - rentCashOut);
    renterPortfolio += surplus;
    renterContributed += surplus;

    rent *= 1 + i.rentIncreasePct / 100;
    serviceCharge *= 1 + i.serviceChargeIncreasePct / 100;

    // Selling is assumed at the end of each year, so the comparison is always
    // "what if I exited now" rather than a paper-equity figure.
    const exitCosts = sellingCosts(homeValue, loanBalance, i.sellingAgentFeePct);
    const netSaleProceeds = homeValue - loanBalance - exitCosts;

    years.push({
      year: y,
      buyNetCost: buyCash - netSaleProceeds,
      // Net cost = cash out minus the investment gains on money not sunk into
      // the property. The deposit comes back, so it never counts as a cost.
      rentNetCost: rentCash + renterContributed - renterPortfolio,
      buyCashOut,
      rentCashOut,
      mortgagePaid,
      serviceCharge: serviceChargeThisYear,
      maintenance,
      homeValue,
      loanBalance,
      equity: homeValue - loanBalance,
      sellingCosts: exitCosts,
      netSaleProceeds,
      rentPaid,
      housingFee,
      ejariFee: i.ejariFeeAnnual,
      renterPortfolio,
    });
  }

  const breakeven = years.find((r) => r.buyNetCost <= r.rentNetCost);
  const firstYear = years[0];

  return {
    loanAmount,
    monthlyMortgage,
    monthlyBuyCost: firstYear ? firstYear.buyCashOut / 12 : 0,
    monthlyRentCost: firstYear ? firstYear.rentCashOut / 12 : 0,
    upfrontCosts,
    securityDeposit,
    breakevenYear: breakeven?.year ?? null,
    years,
  };
}
