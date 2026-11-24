import { Suspense } from "react";
import { Calculator } from "@/components/Calculator";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[82rem] px-5 py-8 sm:px-8 sm:py-12">
      <Hero />

      {/* useSearchParams needs a Suspense boundary so the rest of the page can prerender. */}
      <div className="mt-8 sm:mt-10">
        <Suspense fallback={<CalculatorSkeleton />}>
          <Calculator />
        </Suspense>
      </div>
    </main>
  );
}

function CalculatorSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-10 lg:grid-cols-[20.5rem_minmax(0,1fr)] lg:gap-12">
      <div className="h-[34rem] animate-pulse rounded-xl bg-rule-soft" />
      <div className="space-y-8">
        <div className="h-[36rem] animate-pulse rounded-2xl bg-rule-soft" />
        <div className="h-16 animate-pulse rounded-xl bg-rule-soft" />
      </div>
    </div>
  );
}
