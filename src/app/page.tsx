import { Suspense } from "react";
import { Calculator } from "@/components/Calculator";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-700 dark:text-sky-400">
          UAE property
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Rent vs Buy</h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          The true cost of owning a home in the UAE, with the fees people forget — land
          department transfer, service charges, exit costs — and the return you give up on the
          cash you tie up.
        </p>
      </header>

      {/* useSearchParams needs a Suspense boundary so the rest of the page can prerender. */}
      <Suspense fallback={<CalculatorSkeleton />}>
        <Calculator />
      </Suspense>
    </main>
  );
}

function CalculatorSkeleton() {
  return (
    <div
      aria-hidden
      className="grid items-start gap-6 lg:grid-cols-[21rem_minmax(0,1fr)] lg:gap-8"
    >
      <div className="h-[32rem] animate-pulse rounded-2xl border border-slate-200 bg-surface dark:border-slate-800" />
      <div className="space-y-6">
        <div className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-surface dark:border-slate-800" />
        <div className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-surface dark:border-slate-800" />
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-surface dark:border-slate-800" />
      </div>
    </div>
  );
}
