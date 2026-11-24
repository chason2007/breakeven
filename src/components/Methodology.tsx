"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Methodology() {
  const { t } = useLanguage();

  return (
    <section aria-labelledby="method" className="mt-10 rounded-2xl border border-rule bg-panel p-6 sm:p-8 shadow-xs">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-wash text-gold font-bold text-sm">
          ⚖️
        </span>
        <h2 id="method" className="font-display text-xl sm:text-2xl font-bold text-ink">
          {t.methodologyHeading}
        </h2>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {t.methodology.map((s, idx) => (
          <div
            key={s.title}
            className="rounded-xl border border-rule-soft bg-paper/50 p-4 transition-all hover:border-rule"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rule-soft text-[10px] font-bold text-ink-faint">
                {idx + 1}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-ink">{s.title}</h3>
            </div>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-rule-soft pt-4 text-xs leading-relaxed text-ink-faint">
        {t.methodologyDisclaimer}
      </p>
    </section>
  );
}
