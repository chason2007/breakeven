import type { CalculatorInputs, CalculatorResult, YearRow } from "./types";

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

export function calculate(i: CalculatorInputs): CalculatorResult {
  const downPayment = (i.propertyPrice * i.downPaymentPct) / 100;
  const loanAmount = i.propertyPrice - downPayment;
  const monthlyMortgage = monthlyPayment(loanAmount, i.mortgageRatePct, i.tenureYears);

  const upfrontCosts =
    (i.propertyPrice * i.dldFeePct) / 100 +
    (loanAmount * i.mortgageRegistrationPct) / 100 +
    290 + // DLD mortgage registration admin fee
    ((i.propertyPrice * i.agentFeePct) / 100) * 1.05 + // agent fee + 5% VAT
    i.otherUpfront;

  const serviceCharge = i.serviceChargePerSqft * i.propertySizeSqft;
  const ret = i.investmentReturnPct / 100;

  // TODO: refine model — e.g. selling costs at exit, DEWA housing fee (5% of rent),
  // Ejari fees, rent security deposit, rising service charges, early settlement fees.
  const years: YearRow[] = [];
  let buyCash = downPayment + upfrontCosts;
  let rentCash = 0;
  let rent = i.annualRent;
  // Renter invests the cash the buyer spent upfront; track that portfolio.
  let renterPortfolio = downPayment + upfrontCosts;
  let renterContributed = renterPortfolio;

  for (let y = 1; y <= i.horizonYears; y++) {
    const homeValue = i.propertyPrice * Math.pow(1 + i.appreciationPct / 100, y);
    const loanBalance = remainingBalance(loanAmount, i.mortgageRatePct, i.tenureYears, y * 12);
    const mortgageThisYear = y <= i.tenureYears ? monthlyMortgage * 12 : 0;
    const maintenance = (homeValue * i.maintenancePct) / 100;
    const buyCashOut = mortgageThisYear + serviceCharge + maintenance;
    buyCash += buyCashOut;

    const rentCashOut = rent;
    rentCash += rentCashOut;
    renterPortfolio *= 1 + ret;
    // Renter also invests any monthly surplus vs. owning.
    const surplus = Math.max(0, buyCashOut - rentCashOut);
    renterPortfolio += surplus;
    renterContributed += surplus;
    rent *= 1 + i.rentIncreasePct / 100;

    const equity = homeValue - loanBalance;
    years.push({
      year: y,
      buyNetCost: buyCash - equity,
      // Net cost = rent paid minus investment gains on money not sunk into the property
      rentNetCost: rentCash + renterContributed - renterPortfolio,
      buyCashOut,
      rentCashOut,
      homeValue,
      loanBalance,
      equity,
    });
  }

  const breakeven = years.find((r) => r.buyNetCost <= r.rentNetCost);

  return {
    loanAmount,
    monthlyMortgage,
    monthlyBuyCost: years[0] ? years[0].buyCashOut / 12 : 0,
    monthlyRentCost: i.annualRent / 12,
    upfrontCosts,
    breakevenYear: breakeven?.year ?? null,
    years,
  };
}
