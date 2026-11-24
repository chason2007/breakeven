"use client";

import { useLanguage } from "@/context/LanguageContext";

export function Hero() {
  const { t } = useLanguage();

  return (
    <header className="max-w-[44rem]">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl leading-[1.12]">
        {t.heroTitle}
      </h1>

      <p className="mt-4 text-[0.9375rem] sm:text-base leading-relaxed text-ink-soft max-w-[56ch]">
        {t.heroSubtitle}
      </p>
    </header>
  );
}
