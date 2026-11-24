import { describe, expect, it } from "vitest";
import { DEFAULT_INPUTS } from "./defaults";
import { EMIRATE_PRESETS, applyPreset, detectEmirate, getPreset } from "./presets";
import type { CalculatorInputs } from "./types";
import { MAX_TENURE_YEARS, minDownPaymentPct, validate } from "./validate";

const inputs = (overrides: Partial<CalculatorInputs> = {}): CalculatorInputs => ({
  ...DEFAULT_INPUTS,
  ...overrides,
});

const fieldsWarned = (i: CalculatorInputs) =>
  validate(i)
    .filter((w) => w.level === "warn")
    .map((w) => w.field);

describe("minDownPaymentPct", () => {
  it("is 20% at or below AED 5M", () => {
    expect(minDownPaymentPct(1_000_000)).toBe(20);
    expect(minDownPaymentPct(5_000_000)).toBe(20);
  });

  it("is 25% above AED 5M", () => {
    expect(minDownPaymentPct(5_000_001)).toBe(25);
    expect(minDownPaymentPct(8_000_000)).toBe(25);
  });
});

describe("validate", () => {
  it("passes the defaults cleanly", () => {
    expect(fieldsWarned(DEFAULT_INPUTS)).toEqual([]);
  });

  it("flags a down payment under 20% below the AED 5M threshold", () => {
    expect(fieldsWarned(inputs({ propertyPrice: 2_000_000, downPaymentPct: 15 }))).toContain(
      "downPaymentPct",
    );
    expect(fieldsWarned(inputs({ propertyPrice: 2_000_000, downPaymentPct: 20 }))).not.toContain(
      "downPaymentPct",
    );
  });

  it("flags a down payment under 25% above the AED 5M threshold", () => {
    const warned = validate(inputs({ propertyPrice: 6_000_000, downPaymentPct: 20 }));
    const down = warned.find((w) => w.field === "downPaymentPct");
    expect(down?.level).toBe("warn");
    expect(down?.message).toContain("25%");
    expect(fieldsWarned(inputs({ propertyPrice: 6_000_000, downPaymentPct: 25 }))).not.toContain(
      "downPaymentPct",
    );
  });

  it("flags a tenure beyond the 25-year cap", () => {
    expect(fieldsWarned(inputs({ tenureYears: MAX_TENURE_YEARS + 1 }))).toContain("tenureYears");
    expect(fieldsWarned(inputs({ tenureYears: MAX_TENURE_YEARS }))).not.toContain("tenureYears");
  });

  it("flags nonsense figures", () => {
    expect(fieldsWarned(inputs({ propertyPrice: 0 }))).toContain("propertyPrice");
    expect(fieldsWarned(inputs({ annualRent: 0 }))).toContain("annualRent");
    expect(fieldsWarned(inputs({ propertySizeSqft: 0 }))).toContain("propertySizeSqft");
    expect(fieldsWarned(inputs({ downPaymentPct: 120 }))).toContain("downPaymentPct");
    expect(fieldsWarned(inputs({ tenureYears: 0 }))).toContain("tenureYears");
  });

  it("notes a horizon that outlives the mortgage without warning", () => {
    const notes = validate(inputs({ tenureYears: 5, horizonYears: 10 }));
    const note = notes.find((w) => w.field === "horizonYears");
    expect(note?.level).toBe("info");
    expect(fieldsWarned(inputs({ tenureYears: 5, horizonYears: 10 }))).toEqual([]);
  });

  it("notes optimistic assumptions as info, not errors", () => {
    expect(validate(inputs({ rentIncreasePct: 25 })).map((w) => w.level)).toEqual(["info"]);
    expect(validate(inputs({ appreciationPct: 12 })).map((w) => w.level)).toEqual(["info"]);
  });

  it("never blocks — it only ever returns messages", () => {
    const broken = inputs({ propertyPrice: 0, downPaymentPct: 0, tenureYears: 99 });
    expect(validate(broken).length).toBeGreaterThan(0);
    expect(validate(broken).every((w) => typeof w.message === "string")).toBe(true);
  });
});

describe("emirate presets", () => {
  it("defaults to Dubai rates", () => {
    expect(detectEmirate(DEFAULT_INPUTS)).toBe("dubai");
    expect(getPreset("dubai").overrides.dldFeePct).toBe(4);
  });

  it("switches Abu Dhabi to a 2% transfer fee", () => {
    const abuDhabi = applyPreset(DEFAULT_INPUTS, "abuDhabi");
    expect(abuDhabi.dldFeePct).toBe(2);
    expect(detectEmirate(abuDhabi)).toBe("abuDhabi");
  });

  it("leaves non-statutory inputs untouched", () => {
    const abuDhabi = applyPreset(inputs({ propertyPrice: 3_000_000, annualRent: 180_000 }), "abuDhabi");
    expect(abuDhabi.propertyPrice).toBe(3_000_000);
    expect(abuDhabi.annualRent).toBe(180_000);
    expect(abuDhabi.mortgageRatePct).toBe(DEFAULT_INPUTS.mortgageRatePct);
  });

  it("round-trips between presets", () => {
    const back = applyPreset(applyPreset(DEFAULT_INPUTS, "abuDhabi"), "dubai");
    expect(back).toEqual(DEFAULT_INPUTS);
  });

  it("reports no emirate once statutory fees are customised", () => {
    expect(detectEmirate(inputs({ dldFeePct: 3.5 }))).toBeNull();
  });

  it("gives every preset a label and a note", () => {
    for (const preset of EMIRATE_PRESETS) {
      expect(preset.label.length).toBeGreaterThan(0);
      expect(preset.note.length).toBeGreaterThan(0);
    }
  });
});
