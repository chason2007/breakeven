import { EARLY_SETTLEMENT_CAP } from "@/lib/calc";

const SECTIONS = [
  {
    title: "The comparison",
    body: "Both sides are measured as cumulative net cost at the end of each year, assuming you exit that year — the buyer sells, the renter moves out. Lower is better, and the breakeven year is the first year buying costs less.",
  },
  {
    title: "What buying costs",
    body: "Down payment, transfer fee (4% in Dubai, 2% in Abu Dhabi), mortgage registration (0.25% of the loan plus AED 290), agent fee plus 5% VAT, and your other upfront fees. Then every year: the mortgage, the service charge (which compounds), and maintenance.",
  },
  {
    title: "What you get back",
    body: `Not the headline price. Net sale proceeds are the home's value less the outstanding loan, less the selling agent's fee plus VAT, less early mortgage settlement at 1% of the balance (capped at AED ${EARLY_SETTLEMENT_CAP.toLocaleString("en-AE")}).`,
  },
  {
    title: "What renting costs",
    body: "Rent, the 5% municipality housing fee collected on your DEWA bill, and annual Ejari registration. The security deposit is refundable, so it isn't a cost — but it's cash you can't invest, which is.",
  },
  {
    title: "Opportunity cost",
    body: "The renter invests the money a buyer would tie up — the down payment and all upfront fees — plus any year where renting costs less than owning. That portfolio compounds at your investment-return assumption. This is usually what decides the answer.",
  },
  {
    title: "What it leaves out",
    body: "Rental yield if you let the property, income tax (there is none on UAE residential property for individuals), mortgage life insurance, fit-out and furnishing, moving costs, and the chance that your own circumstances change. Rates are treated as fixed for the whole horizon.",
  },
];

export function Methodology() {
  return (
    <section
      aria-labelledby="methodology-heading"
      className="rounded-2xl border border-slate-200 bg-surface p-5 sm:p-6 dark:border-slate-800"
    >
      <h2 id="methodology-heading" className="font-semibold">
        How this is calculated
      </h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {s.body}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500 dark:border-slate-800 dark:text-slate-400">
        Fee rates reflect published UAE norms and are editable above. This is a modelling tool for
        comparison, not financial advice — confirm current rates with your bank and the relevant
        land department before committing.
      </p>
    </section>
  );
}
