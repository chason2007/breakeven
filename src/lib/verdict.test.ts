import { describe, expect, it } from "vitest";
import { calculate } from "./calc";
import { DEFAULT_INPUTS } from "./defaults";
import type { CalculatorInputs } from "./types";
import { verdict } from "./verdict";

const inputs = (overrides: Partial<CalculatorInputs> = {}): CalculatorInputs => ({
  ...DEFAULT_INPUTS,
  ...overrides,
});

const verdictFor = (overrides: Partial<CalculatorInputs> = {}) => {
  const i = inputs(overrides);
  return verdict(calculate(i), i.horizonYears);
};

describe("verdict", () => {
  it("names the breakeven year when buying wins", () => {
    const v = verdictFor({ annualRent: 95_000, investmentReturnPct: 7, rentIncreasePct: 4, horizonYears: 30 });
    expect(v.kind).toBe("buy");
    expect(v.headline).toBe("Buying beats renting after 9 years");
    expect(v.advantage).toBeGreaterThan(0);
  });

  it("uses a year-one phrasing rather than 'after 1 years'", () => {
    const v = verdictFor({
      propertyPrice: 1_000_000,
      annualRent: 150_000,
      appreciationPct: 6,
      investmentReturnPct: 2,
      rentIncreasePct: 7,
      horizonYears: 15,
    });
    expect(v.kind).toBe("buy");
    expect(v.headline).toBe("Buying beats renting from year one");
  });

  it("says renting wins when buying never catches up", () => {
    const v = verdictFor({
      propertyPrice: 4_000_000,
      annualRent: 90_000,
      mortgageRatePct: 6,
      appreciationPct: 0,
      investmentReturnPct: 9,
      rentIncreasePct: 2,
      horizonYears: 20,
    });
    expect(v.kind).toBe("rent");
    expect(v.headline).toBe("Renting wins over 20 years");
    expect(v.detail).toContain("never catches up");
    expect(v.advantage).toBeLessThan(0);
  });

  it("calls a near-tie too close to call", () => {
    const result = calculate(DEFAULT_INPUTS);
    const last = result.years.at(-1)!;
    // Nudge the two series to within 1% of each other.
    const tied = {
      ...result,
      years: [...result.years.slice(0, -1), { ...last, rentNetCost: last.buyNetCost * 1.01 }],
    };
    const v = verdict(tied, DEFAULT_INPUTS.horizonYears);
    expect(v.kind).toBe("tooClose");
    expect(v.headline).toBe("Too close to call");
  });

  it("handles an empty series", () => {
    const v = verdict({ ...calculate(DEFAULT_INPUTS), years: [], breakevenYear: null }, 0);
    expect(v.kind).toBe("tooClose");
    expect(v.headline).toBe("Nothing to compare yet");
    expect(v.advantage).toBe(0);
  });

  it("singularises a one-year horizon", () => {
    const v = verdictFor({
      propertyPrice: 1_000_000,
      annualRent: 150_000,
      appreciationPct: 6,
      investmentReturnPct: 2,
      horizonYears: 1,
    });
    expect(v.detail).toContain("1 year");
    expect(v.detail).not.toContain("1 years");
  });

  it("formats the advantage compactly", () => {
    const millions = verdictFor({
      propertyPrice: 1_000_000,
      annualRent: 300_000,
      appreciationPct: 6,
      investmentReturnPct: 2,
      horizonYears: 15,
    });
    expect(millions.detail).toMatch(/AED \d+(\.\d)?M/);

    const thousands = verdictFor({
      annualRent: 95_000,
      investmentReturnPct: 7,
      rentIncreasePct: 4,
      horizonYears: 12,
    });
    expect(thousands.detail).toMatch(/AED \d+k/);
  });

  it("always returns a non-empty headline and detail", () => {
    const scenarios: Partial<CalculatorInputs>[] = [
      {},
      { horizonYears: 1 },
      { horizonYears: 30 },
      { downPaymentPct: 100 },
      { appreciationPct: -5 },
      { investmentReturnPct: 0 },
      { annualRent: 1 },
      { propertyPrice: 15_000_000 },
    ];
    for (const scenario of scenarios) {
      const v = verdictFor(scenario);
      expect(v.headline.length).toBeGreaterThan(0);
      expect(v.detail.length).toBeGreaterThan(0);
      expect(Number.isFinite(v.advantage)).toBe(true);
    }
  });
});
