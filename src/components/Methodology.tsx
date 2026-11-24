import { EARLY_SETTLEMENT_CAP } from "@/lib/calc";

const SECTIONS = [
  {
    title: "The comparison",
    body: "Both sides are measured as cumulative net cost at the end of each year, assuming you exit that year — the buyer sells, the renter moves out. Lower is better, and the breakeven year is the first year buying costs less.",
  },
  {
    title: "What buying costs",
    body: "Down payment, transfer fee (4% in Dubai, 2% in Abu Dhabi), mortgage registration at 0.25% of the loan plus AED 290, agent fee plus 5% VAT, and your other upfront fees. Then every year: the mortgage, the service charge, which compounds, and maintenance.",
  },
  {
    title: "What you get back",
    body: `Not the headline price. Net sale proceeds are the home's value less the outstanding loan, less the selling agent's fee plus VAT, less early mortgage settlement at 1% of the balance, capped at AED ${EARLY_SETTLEMENT_CAP.toLocaleString("en-AE")}.`,
  },
  {
    title: "What renting costs",
    body: "Rent, the 5% municipality housing fee collected through your DEWA bill, and annual Ejari registration. The security deposit comes back, so it is not a cost — but it is cash you cannot invest, which is.",
  },
  {
    title: "The cash you tie up",
    body: "The renter invests what a buyer would sink into the purchase — down payment and every upfront fee — plus any year where renting costs less than owning. That portfolio compounds at your investment-return assumption, and it is usually what decides the answer.",
  },
  {
    title: "What this leaves out",
    body: "Rental income if you let the property, mortgage life insurance, fit-out and furnishing, moving costs, and the chance your own plans change. Rates are held fixed for the whole horizon. There is no personal income tax on UAE residential property, so none is modelled.",
  },
];

export function Methodology() {
  return (
    <section aria-labelledby="method" className="border-t border-rule pt-6">
      <h2 id="method" className="font-display text-xl font-semibold">
        How this is calculated
      </h2>
      <div className="mt-5 grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h3 className="text-[0.8125rem] font-semibold">{s.title}</h3>
            <p className="mt-1.5 max-w-[48ch] text-[0.8125rem] leading-relaxed text-ink-soft">
              {s.body}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 max-w-[62ch] border-t border-rule-soft pt-5 text-xs leading-relaxed text-ink-faint">
        Fee rates follow published UAE norms and every one of them is editable. This is a
        modelling tool, not financial advice — check current rates with your bank and the
        relevant land department before you commit to anything.
      </p>
    </section>
  );
}
