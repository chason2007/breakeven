import { describe, expect, it } from "vitest";
import { DEFAULT_INPUTS } from "./defaults";
import type { CalculatorInputs } from "./types";
import { decodeInputs, encodeInputs, shareUrl } from "./urlState";

const inputs = (overrides: Partial<CalculatorInputs> = {}): CalculatorInputs => ({
  ...DEFAULT_INPUTS,
  ...overrides,
});

describe("encodeInputs", () => {
  it("writes nothing when the inputs are the defaults", () => {
    expect(encodeInputs(DEFAULT_INPUTS)).toBe("");
  });

  it("writes only what the user changed", () => {
    expect(encodeInputs(inputs({ propertyPrice: 3_500_000 }))).toBe("pp=3500000");
    expect(encodeInputs(inputs({ annualRent: 200_000, horizonYears: 15 }))).toBe(
      "ar=200000&hz=15",
    );
  });

  it("trims floating-point noise", () => {
    expect(encodeInputs(inputs({ mortgageRatePct: 0.1 + 0.2 }))).toBe("mr=0.3");
  });

  it("skips non-finite values rather than writing NaN", () => {
    expect(encodeInputs(inputs({ propertyPrice: Number.NaN }))).toBe("");
    expect(encodeInputs(inputs({ annualRent: Number.POSITIVE_INFINITY }))).toBe("");
  });
});

describe("decodeInputs", () => {
  it("returns the defaults for an empty or missing query string", () => {
    expect(decodeInputs(new URLSearchParams())).toEqual(DEFAULT_INPUTS);
    expect(decodeInputs(null)).toEqual(DEFAULT_INPUTS);
    expect(decodeInputs(undefined)).toEqual(DEFAULT_INPUTS);
  });

  it("reads values back out", () => {
    const decoded = decodeInputs(new URLSearchParams("pp=3500000&dp=25&hz=15"));
    expect(decoded.propertyPrice).toBe(3_500_000);
    expect(decoded.downPaymentPct).toBe(25);
    expect(decoded.horizonYears).toBe(15);
    // Untouched fields keep their defaults.
    expect(decoded.mortgageRatePct).toBe(DEFAULT_INPUTS.mortgageRatePct);
  });

  it("ignores junk instead of producing NaN", () => {
    const decoded = decodeInputs(new URLSearchParams("pp=banana&dp=&ar=&hz=abc"));
    expect(decoded.propertyPrice).toBe(DEFAULT_INPUTS.propertyPrice);
    expect(decoded.downPaymentPct).toBe(DEFAULT_INPUTS.downPaymentPct);
    expect(decoded.annualRent).toBe(DEFAULT_INPUTS.annualRent);
    expect(decoded.horizonYears).toBe(DEFAULT_INPUTS.horizonYears);
    expect(Object.values(decoded).every(Number.isFinite)).toBe(true);
  });

  it("ignores unknown keys", () => {
    expect(decodeInputs(new URLSearchParams("wat=1&pp=1000000"))).toEqual(
      inputs({ propertyPrice: 1_000_000 }),
    );
  });

  it("accepts negative values (e.g. a falling market) without clamping", () => {
    // Clamping is the validator's job, not the URL's.
    expect(decodeInputs(new URLSearchParams("ap=-3")).appreciationPct).toBe(-3);
  });
});

describe("round trip", () => {
  const cases: CalculatorInputs[] = [
    DEFAULT_INPUTS,
    inputs({ propertyPrice: 7_250_000, downPaymentPct: 25, tenureYears: 20 }),
    inputs({ dldFeePct: 2, ejariFeeAnnual: 0, dewaHousingFeePct: 3 }),
    inputs({ appreciationPct: -2.5, investmentReturnPct: 8.5, maintenancePct: 1.2 }),
    inputs({ horizonYears: 1 }),
  ];

  it.each(cases.map((c, index) => [index, c] as const))(
    "survives encode -> decode (case %i)",
    (_index, value) => {
      expect(decodeInputs(new URLSearchParams(encodeInputs(value)))).toEqual(value);
    },
  );
});

describe("shareUrl", () => {
  it("appends the query when there is one", () => {
    expect(shareUrl("https://example.com/", inputs({ horizonYears: 20 }))).toBe(
      "https://example.com/?hz=20",
    );
  });

  it("leaves a default link clean", () => {
    expect(shareUrl("https://example.com/", DEFAULT_INPUTS)).toBe("https://example.com/");
  });
});
