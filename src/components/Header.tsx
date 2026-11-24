"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { Logo } from "@/components/Logo";

export function Header() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-panel/95 backdrop-blur-md transition-colors shadow-xs">
      <div className="mx-auto flex w-full max-w-[82rem] items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group inline-flex items-center focus:outline-none" aria-label={t.appName}>
          <Logo variant="full" lang={lang} size="lg" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Bilingual Switcher Toggle */}
          <div className="flex items-center rounded-lg border border-rule bg-paper p-0.5 shadow-sm">
            <button
              type="button"
              onClick={() => lang !== "en" && toggleLang()}
              aria-label="Switch to English"
              aria-pressed={lang === "en"}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                lang === "en"
                  ? "bg-panel text-ink shadow-sm font-bold"
                  : "text-ink-faint hover:text-ink"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => lang !== "ar" && toggleLang()}
              aria-label="التبديل إلى اللغة العربية"
              aria-pressed={lang === "ar"}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                lang === "ar"
                  ? "bg-panel text-ink shadow-sm font-bold"
                  : "text-ink-faint hover:text-ink"
              }`}
            >
              العربية
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
