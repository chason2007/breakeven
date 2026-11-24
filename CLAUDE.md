@AGENTS.md

# UAE Rent vs Buy Calculator

Portfolio project: Next.js 16 (App Router) + TypeScript + Tailwind v4 + Recharts.

## Layout
- `src/lib/calc.ts` — pure financial engine (amortization, upfront fees, yearly net-cost series, breakeven). Keep it UI-free and testable.
- `src/lib/types.ts` — input/result types. `src/lib/defaults.ts` — Dubai defaults.
- `src/components/` — `InputPanel`, `ResultsSummary`, `CostChart`.
- `src/app/page.tsx` — client page wiring state → `calculate()` → UI.

## Model
- Net cost (buy) = all cash out (down payment, upfront fees, mortgage, service charge, maintenance) − equity (home value − loan balance).
- Net cost (rent) = rent paid − investment gains on the money the renter didn't spend (down payment + fees + any monthly surplus).
- Breakeven = first year buy net cost ≤ rent net cost.

## Next steps (TODOs in code)
- Unit tests for calc.ts (Vitest)
- Selling costs at exit, DEWA housing fee, Ejari, security deposit
- Input validation (20/25% min down, 25-yr max tenure), sliders, emirate presets
- Breakeven ReferenceLine on chart, year-by-year table, shareable URL state
