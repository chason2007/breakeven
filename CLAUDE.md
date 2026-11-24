@AGENTS.md

# UAE Rent vs Buy Calculator

Portfolio project: Next.js 16 (App Router) + TypeScript + Tailwind v4 + Recharts.

## Layout
- `src/lib/calc.ts` — pure financial engine (amortization, upfront fees, yearly net-cost series, breakeven). Keep it UI-free and testable.
- `src/lib/types.ts` — input/result types. `src/lib/defaults.ts` — Dubai defaults.
- `src/lib/validate.ts` — non-blocking UAE rule checks (20/25% down, 25-yr tenure).
- `src/lib/presets.ts` — Dubai / Abu Dhabi statutory fee presets.
- `src/lib/verdict.ts` — headline copy from a result. `src/lib/urlState.ts` — query-string codec.
- `src/components/` — `Calculator` (state owner), `InputPanel` + `NumberField`, `VerdictCard`,
  `ResultsSummary`, `CostChart`, `YearTable`, `Methodology`, `ShareButton`.
- `src/app/page.tsx` — server shell (header + `<Suspense>`); `Calculator` is the client boundary.
- `src/lib/*.test.ts` — Vitest suites. `npm test` (or `npm run test:watch`).

## Model

Both sides are expressed as **cumulative net cost** at the end of each year, assuming
you exit that year (the buyer sells, the renter moves out). Lower is better.

**Buy:** cash out − net sale proceeds.
- Cash out = down payment + upfront fees + mortgage + service charge + maintenance.
- Upfront fees = land department transfer (Dubai 4% / Abu Dhabi 2%) + mortgage
  registration (0.25% of loan + flat AED 290) + agent fee (2% + 5% VAT) + other.
- Service charges compound annually at `serviceChargeIncreasePct`.
- Net sale proceeds = home value − loan balance − selling costs.
- Selling costs = agent fee (2% + VAT) on the sale price + early mortgage settlement
  (1% of the outstanding balance, capped at AED 10,000 per UAE Central Bank rules).

**Rent:** cash out − investment gains on the money not sunk into the property.
- Cash out = rent + DEWA/municipality housing fee (5% of annual rent) + Ejari (~AED 220/yr).
- The renter invests the buyer's down payment + upfront fees, plus any annual cash-flow
  surplus vs. owning, at `investmentReturnPct`.
- The 5% security deposit is refundable, so it is never a cost — but it is excluded from
  the invested pool, so it costs the renter the forgone return.

**Breakeven** = first year buy net cost ≤ rent net cost; `null` if that never happens
within the horizon.

Constants live in `calc.ts`: `VAT_RATE`, `DLD_MORTGAGE_ADMIN_FEE`, `EARLY_SETTLEMENT_PCT`,
`EARLY_SETTLEMENT_CAP`.

## Validation
Rules are advisory, never blocking — `validate()` returns `Warning[]` which `InputPanel`
renders inline under the relevant field. `warn` level is a UAE rule break (min down
payment, 25-yr tenure cap, impossible figures); `info` level is a soft caution.

## Shareable state
`Calculator` seeds its state from `useSearchParams()` on first render (hence the `<Suspense>`
boundary in `page.tsx` — required with Cache Components), then keeps the URL in sync with
`window.history.replaceState`. Only inputs that differ from `DEFAULT_INPUTS` are written, so a
default link stays clean. Decoding ignores junk rather than producing `NaN`.

## Theming
Chart and surface colours are CSS variables in `globals.css`, switched by
`prefers-color-scheme`. Recharts SVG props take `var(--chart-*)` directly; the tooltip is a
custom component with Tailwind `dark:` classes.

## Next steps
- Rental yield / letting the property, mortgage life insurance, fit-out costs
- Scenario comparison (save two sets of inputs side by side)
