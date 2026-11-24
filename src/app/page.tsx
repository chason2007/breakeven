import { Suspense } from "react";
import { Calculator } from "@/components/Calculator";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[82rem] px-5 py-10 sm:px-8 sm:py-14">
      <header className="max-w-[34rem]">
        <h1 className="font-display text-[2.125rem] leading-[1.05] font-semibold sm:text-5xl">
          Rent or buy in the UAE?
        </h1>
        <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
          Owning costs more than the mortgage. This compares both sides on net cost — transfer
          and agent fees, service charges, what it takes to sell again, and the return you give
          up on the cash you tie up.
        </p>
      </header>

      {/* useSearchParams needs a Suspense boundary so the rest of the page can prerender. */}
      <div className="mt-10 sm:mt-12">
        <Suspense fallback={<CalculatorSkeleton />}>
          <Calculator />
        </Suspense>
      </div>
    </main>
  );
}

function CalculatorSkeleton() {
  return (
    <div aria-hidden className="grid gap-10 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-14">
      <div className="h-[30rem] animate-pulse rounded-md bg-rule-soft" />
      <div className="space-y-8">
        <div className="h-[34rem] animate-pulse rounded-2xl bg-rule-soft" />
        <div className="h-14 animate-pulse rounded-md bg-rule-soft" />
      </div>
    </div>
  );
}
