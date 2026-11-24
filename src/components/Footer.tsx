"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Logo } from "@/components/Logo";

export function Footer() {
  const { lang, isArabic } = useLanguage();

  return (
    <footer className="mt-20 border-t border-rule bg-panel/50 py-12 transition-colors">
      <div className="mx-auto w-full max-w-[82rem] px-5 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3 sm:col-span-2">
            <Logo variant="full" lang={lang} size="sm" />
            <p className="max-w-[42ch] text-xs leading-relaxed text-ink-faint">
              {isArabic
                ? "أداة ذكية للمقارنة بين شراء واستئجار العقارات السكنية في دولة الإمارات العربية المتحدة، مصممة وفق لوائح دائرة الأراضي والأملاك ومصرف الإمارات المركزي."
                : "Real estate financial modeling tool designed specifically for the UAE residential market, accounting for statutory transfer fees, mortgage caps, and investment opportunity costs."}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {isArabic ? "الجهات التنظيمية" : "Statutory Framework"}
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-xs text-ink-faint">
              <li>{isArabic ? "دائرة الأراضي والأملاك بدبي (DLD)" : "Dubai Land Department (DLD)"}</li>
              <li>{isArabic ? "مركز أبوظبي العقاري (ADREC)" : "Abu Dhabi Real Estate Centre (ADREC)"}</li>
              <li>{isArabic ? "مصرف الإمارات العربية المتحدة المركزي" : "Central Bank of the UAE"}</li>
              <li>{isArabic ? "مؤسسة التنظيم العقاري (ريرا)" : "Real Estate Regulatory Agency (RERA)"}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              {isArabic ? "الافتراضات المعتمدة" : "Key Standard Rules"}
            </h4>
            <ul className="mt-2.5 space-y-1.5 text-xs text-ink-faint">
              <li>{isArabic ? "سقف تمويل الرهن 25 سنة" : "Max 25-yr mortgage tenure"}</li>
              <li>{isArabic ? "دفعة أولى 20% (25% فوق 5M)" : "20% min down (<AED 5M), 25% (>5M)"}</li>
              <li>{isArabic ? "سقف السداد المبكر 10,000 د.إ" : "Early settlement cap AED 10k"}</li>
              <li>{isArabic ? "0% ضريبة دخل أو أرباح رأسمالية" : "0% personal capital gains tax"}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-rule-soft pt-6 text-xs text-ink-faint sm:flex-row">
          <p>
            © 2026 {isArabic ? "دار الميزان - حاسبة التملك والإيجار" : "BREAKEVEN UAE • Rent vs Buy Model"}.
          </p>
          <p className="text-[11px]">
            {isArabic
              ? "هذه الأداة لأغراض التحليل والمحاكاة وليست استشارة استثمارية معتمدة."
              : "Analytical simulation model. Not legal or financial advice."}
          </p>
        </div>
      </div>
    </footer>
  );
}
