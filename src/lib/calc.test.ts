import { describe, expect, it } from "vitest";
import {
  DLD_MORTGAGE_ADMIN_FEE,
  VAT_RATE,
  calculate,
  monthlyPayment,
  remainingBalance,
} from "./calc";
import { DEFAULT_INPUTS } from "./defaults";
import type { CalculatorInputs } from "./types";

const inputs = (overrides: Partial<CalculatorInputs> = {}): CalculatorInputs => ({
  ...DEFAULT_INPUTS,
  ...overrides,
});

describe("monthlyPayment", () => {
  it("matches the textbook amortization figure", () => {
    // AED 100,000 at 6% over 30 years is the standard worked example: 599.55/month.
    expect(monthlyPayment(100_000, 6, 30)).toBeCloseTo(599.55, 2);
  });

  it("matches a UAE-shaped loan", () => {
    // AED 1.6M at 4.5% over 25 years.
    expect(monthlyPayment(1_600_000, 4.5, 25)).toBeCloseTo(8_893.32, 2);
  });

  it("splits the principal evenly at a 0% rate", () => {
    expect(monthlyPayment(1_200_000, 0, 25)).toBeCloseTo(4_000, 10);
  });

  it("returns 0 for a zero-length loan", () => {
    expect(monthlyPayment(1_000_000, 4.5, 0)).toBe(0);
  });

  it("scales linearly with principal", () => {
    expect(monthlyPayment(2_000_000, 4.5, 25)).toBeCloseTo(
      2 * monthlyPayment(1_000_000, 4.5, 25),
      6,
    );
  });
});

describe("remainingBalance", () => {
  it("is the full principal before any payment", () => {
    expect(remainingBalance(1_600_000, 4.5, 25, 0)).toBeCloseTo(1_600_000, 6);
  });

  it("reaches exactly 0 at the end of the tenure", () => {
    expect(remainingBalance(1_600_000, 4.5, 25, 25 * 12)).toBe(0);
    expect(remainingBalance(100_000, 6, 30, 30 * 12)).toBe(0);
    expect(remainingBalance(1_200_000, 0, 25, 25 * 12)).toBe(0);
  });

  it("stays at 0 past the end of the tenure", () => {
    expect(remainingBalance(1_600_000, 4.5, 25, 30 * 12)).toBe(0);
  });

  it("converges to 0 from above over the final months", () => {
    const penultimate = remainingBalance(100_000, 6, 30, 30 * 12 - 1);
    // One discounted payment left.
    expect(penultimate).toBeGreaterThan(0);
    expect(penultimate).toBeCloseTo(596.57, 2);
  });

  it("amortizes slowly at first (interest-heavy early years)", () => {
    const halfway = remainingBalance(100_000, 6, 30, 180);
    expect(halfway).toBeCloseTo(71_048.84, 2);
    // More than half the principal is still outstanding at the midpoint.
    expect(halfway).toBeGreaterThan(50_000);
  });

  it("amortizes linearly at a 0% rate", () => {
    expect(remainingBalance(1_200_000, 0, 25, 12 * 10)).toBeCloseTo(720_000, 6);
  });

  it("decreases monotonically", () => {
    let previous = Infinity;
    for (let m = 0; m <= 25 * 12; m++) {
      const balance = remainingBalance(1_600_000, 4.5, 25, m);
      expect(balance).toBeLessThan(previous);
      previous = balance;
    }
  });
});

describe("upfront purchase costs", () => {
  it("totals the fee stack for the default inputs", () => {
    const { upfrontCosts } = calculate(DEFAULT_INPUTS);
    // Price 2,000,000 @ 20% down -> loan 1,600,000:
    //   DLD transfer 4%             = 80,000
    //   mortgage registration 0.25% =  4,000
    //   DLD admin flat fee          =    290
    //   agent fee 2% + 5% VAT       = 42,000
    //   other (valuation, trustee)  = 10,000
    expect(upfrontCosts).toBeCloseTo(136_290, 6);
  });

  it("is built from the documented components", () => {
    const i = DEFAULT_INPUTS;
    const loan = i.propertyPrice * (1 - i.downPaymentPct / 100);
    const expected =
      (i.propertyPrice * i.dldFeePct) / 100 +
      (loan * i.mortgageRegistrationPct) / 100 +
      DLD_MORTGAGE_ADMIN_FEE +
      ((i.propertyPrice * i.agentFeePct) / 100) * (1 + VAT_RATE) +
      i.otherUpfront;
    expect(calculate(i).upfrontCosts).toBeCloseTo(expected, 6);
  });

  it("excludes the down payment", () => {
    const base = calculate(inputs({ downPaymentPct: 20 }));
    const higher = calculate(inputs({ downPaymentPct: 50 }));
    // Only the loan-linked registration fee moves when the down payment changes.
    const registrationDelta =
      ((2_000_000 * 0.5 - 2_000_000 * 0.8) * DEFAULT_INPUTS.mortgageRegistrationPct) / 100;
    expect(higher.upfrontCosts - base.upfrontCosts).toBeCloseTo(registrationDelta, 6);
  });

  it("reduces to the flat admin fee when every percentage fee is waived", () => {
    const result = calculate(
      inputs({ dldFeePct: 0, mortgageRegistrationPct: 0, agentFeePct: 0, otherUpfront: 0 }),
    );
    expect(result.upfrontCosts).toBeCloseTo(DLD_MORTGAGE_ADMIN_FEE, 6);
  });
});

describe("breakeven year", () => {
  it("finds an early breakeven when buying clearly wins", () => {
    // Cheap property, expensive rent, strong appreciation, weak market returns.
    const result = calculate(
      inputs({
        propertyPrice: 1_000_000,
        annualRent: 150_000,
        appreciationPct: 6,
        investmentReturnPct: 2,
        rentIncreasePct: 7,
        horizonYears: 15,
      }),
    );
    expect(result.breakevenYear).toBe(1);

    const first = result.years[0];
    expect(first.buyNetCost).toBeLessThan(first.rentNetCost);
  });

  it("finds a mid-horizon breakeven for a marginal purchase", () => {
    const result = calculate(
      inputs({
        propertyPrice: 2_000_000,
        annualRent: 95_000,
        mortgageRatePct: 4.5,
        appreciationPct: 3,
        investmentReturnPct: 7,
        rentIncreasePct: 4,
        horizonYears: 30,
      }),
    );
    expect(result.breakevenYear).toBe(8);

    // Renting is ahead the year before and behind from the breakeven year on.
    const before = result.years[result.breakevenYear! - 2];
    const at = result.years[result.breakevenYear! - 1];
    expect(before.buyNetCost).toBeGreaterThan(before.rentNetCost);
    expect(at.buyNetCost).toBeLessThanOrEqual(at.rentNetCost);
  });

  it("returns null when renting wins across the whole horizon", () => {
    // Expensive property, cheap rent, flat prices, strong market returns.
    const result = calculate(
      inputs({
        propertyPrice: 4_000_000,
        annualRent: 90_000,
        mortgageRatePct: 6,
        appreciationPct: 0,
        investmentReturnPct: 9,
        rentIncreasePct: 2,
        horizonYears: 20,
      }),
    );
    expect(result.breakevenYear).toBeNull();
    for (const row of result.years) {
      expect(row.buyNetCost).toBeGreaterThan(row.rentNetCost);
    }
  });

  it("is null when the horizon ends before buying catches up", () => {
    const short = calculate(
      inputs({
        propertyPrice: 2_000_000,
        annualRent: 95_000,
        investmentReturnPct: 7,
        rentIncreasePct: 4,
        horizonYears: 5,
      }),
    );
    expect(short.breakevenYear).toBeNull();
  });

  it("handles the all-zero-rates case by hand", () => {
    // Price 1M, 20% down, 0% mortgage over 20 years, no appreciation, no fees
    // but the DLD transfer, no market return, no rent increase.
    const result = calculate({
      propertyPrice: 1_000_000,
      downPaymentPct: 20,
      mortgageRatePct: 0,
      tenureYears: 20,
      serviceChargePerSqft: 0,
      propertySizeSqft: 1_000,
      maintenancePct: 0,
      appreciationPct: 0,

      dldFeePct: 4,
      mortgageRegistrationPct: 0,
      agentFeePct: 0,
      otherUpfront: 0,

      annualRent: 40_000,
      rentIncreasePct: 0,
      investmentReturnPct: 0,

      horizonYears: 5,
    });

    // Upfront = 4% of 1M + flat admin fee.
    expect(result.upfrontCosts).toBeCloseTo(40_000 + DLD_MORTGAGE_ADMIN_FEE, 6);
    // Mortgage = 800,000 / 240 months.
    expect(result.monthlyMortgage).toBeCloseTo(800_000 / 240, 10);

    // With no appreciation and no interest, every mortgage dirham becomes equity,
    // so the buyer's net cost is a constant: just the sunk transaction fees.
    for (const row of result.years) {
      expect(row.buyNetCost).toBeCloseTo(40_290, 6);
      // Rent cash out matches the mortgage exactly, so there is no surplus to invest
      // and no return to earn: the renter's net cost is simply the rent paid.
      expect(row.rentNetCost).toBeCloseTo(40_000 * row.year, 6);
    }

    // 40,290 of fees is beaten by the second year of rent.
    expect(result.breakevenYear).toBe(2);
  });
});

describe("yearly series", () => {
  it("produces one row per horizon year", () => {
    const result = calculate(inputs({ horizonYears: 12 }));
    expect(result.years).toHaveLength(12);
    expect(result.years.map((r) => r.year)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it("tracks equity as home value minus loan balance", () => {
    for (const row of calculate(DEFAULT_INPUTS).years) {
      expect(row.equity).toBeCloseTo(row.homeValue - row.loanBalance, 6);
    }
  });

  it("stops mortgage payments after the tenure ends", () => {
    const result = calculate(inputs({ tenureYears: 5, horizonYears: 7 }));
    const serviceCharge =
      DEFAULT_INPUTS.serviceChargePerSqft * DEFAULT_INPUTS.propertySizeSqft;
    const afterPayoff = result.years[6];
    expect(afterPayoff.loanBalance).toBe(0);
    expect(afterPayoff.buyCashOut).toBeCloseTo(
      serviceCharge + (afterPayoff.homeValue * DEFAULT_INPUTS.maintenancePct) / 100,
      6,
    );
  });

  it("compounds rent at the rent-increase rate", () => {
    const result = calculate(inputs({ rentIncreasePct: 5, horizonYears: 4 }));
    result.years.forEach((row, index) => {
      expect(row.rentCashOut).toBeCloseTo(DEFAULT_INPUTS.annualRent * 1.05 ** index, 6);
    });
  });

  it("compounds the home value at the appreciation rate", () => {
    const result = calculate(inputs({ appreciationPct: 3, horizonYears: 4 }));
    result.years.forEach((row) => {
      expect(row.homeValue).toBeCloseTo(DEFAULT_INPUTS.propertyPrice * 1.03 ** row.year, 6);
    });
  });

  it("reports year-1 monthly costs consistent with the first row", () => {
    const result = calculate(DEFAULT_INPUTS);
    expect(result.monthlyBuyCost).toBeCloseTo(result.years[0].buyCashOut / 12, 6);
    expect(result.monthlyRentCost).toBeCloseTo(DEFAULT_INPUTS.annualRent / 12, 6);
  });
});
