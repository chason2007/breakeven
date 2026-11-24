import type { CalculatorResult } from "./types";
import { EARLY_SETTLEMENT_CAP } from "./calc";

export type Language = "en" | "ar";

export interface LocalizedVerdict {
  kind: "buy" | "rent" | "tooClose";
  headline: string;
  detail: string;
  advantage: number;
  badgeLabel: string;
}

export function formatCompactCurrency(n: number, lang: Language = "en"): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? (lang === "ar" ? "-" : "-") : "";

  if (lang === "ar") {
    if (abs >= 1_000_000) {
      const val = (abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1);
      return `${sign}${val} مليون د.إ`;
    }
    if (abs >= 1_000) {
      return `${sign}${Math.round(abs / 1_000)} ألف د.إ`;
    }
    return `${sign}${Math.round(abs)} د.إ`;
  }

  // English
  if (abs >= 1_000_000) {
    return `${sign}AED ${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}AED ${Math.round(abs / 1_000)}k`;
  }
  return `${sign}AED ${Math.round(abs)}`;
}

export function formatCurrency(n: number, lang: Language = "en"): string {
  const formatter = new Intl.NumberFormat(lang === "ar" ? "ar-AE" : "en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  });
  return formatter.format(n);
}

export function getLocalizedVerdict(
  result: CalculatorResult,
  horizonYears: number,
  lang: Language = "en"
): LocalizedVerdict {
  const last = result.years.at(-1);

  if (!last) {
    return {
      kind: "tooClose",
      headline: lang === "ar" ? "لا توجد بيانات كافية" : "Nothing to compare yet",
      detail:
        lang === "ar"
          ? "يرجى تحديد أفق زمني للمقارنة لا يقل عن سنة واحدة."
          : "Set a comparison horizon of at least one year.",
      advantage: 0,
      badgeLabel: lang === "ar" ? "غير محدد" : "Indeterminate",
    };
  }

  const advantage = last.rentNetCost - last.buyNetCost;
  const scale = Math.max(Math.abs(last.rentNetCost), Math.abs(last.buyNetCost), 1);
  const breakeven = result.breakevenYear;
  const isClose = Math.abs(advantage) / scale < 0.02;

  const yearsStr = (n: number) => {
    if (lang === "ar") {
      if (n === 1) return "سنة واحدة";
      if (n === 2) return "سنتين";
      if (n >= 3 && n <= 10) return `${n} سنوات`;
      return `${n} سنة`;
    }
    return `${n} ${n === 1 ? "year" : "years"}`;
  };

  if (isClose) {
    return {
      kind: "tooClose",
      headline: lang === "ar" ? "النتيجتان متقاربتان جداً" : "Too close to call",
      detail:
        lang === "ar"
          ? `خلال ${yearsStr(horizonYears)} الفرق بين الخيارين أقل من 2%، لذا يتوقف القرار الفعلي على مدة بقائك المتوقعة في العقار.`
          : `Over ${yearsStr(horizonYears)} the two options land within 2% of each other, so the choice comes down to how long you'll really stay.`,
      advantage,
      badgeLabel: lang === "ar" ? "خيارات متوازنة" : "Too Close",
    };
  }

  if (advantage > 0 && breakeven !== null) {
    return {
      kind: "buy",
      headline:
        lang === "ar"
          ? breakeven === 1
            ? "الشراء يتفوق على الإيجار من السنة الأولى"
            : `الشراء يتفوق على الإيجار بعد ${yearsStr(breakeven)}`
          : breakeven === 1
            ? "Buying beats renting from year one"
            : `Buying beats renting after ${yearsStr(breakeven)}`,
      detail:
        lang === "ar"
          ? `عند البقاء لكامل فترة ${yearsStr(horizonYears)}، يحقق لك الشراء وفراً مالياً يقدّر بحوالي ${formatCompactCurrency(advantage, "ar")}.`
          : `Stay the full ${yearsStr(horizonYears)} and buying leaves you better off by about ${formatCompactCurrency(advantage, "en")}.`,
      advantage,
      badgeLabel: lang === "ar" ? "يُنصح بالشراء" : "Favors Buying",
    };
  }

  if (advantage > 0) {
    return {
      kind: "buy",
      headline:
        lang === "ar"
          ? `الشراء أفضل على مدى ${yearsStr(horizonYears)}`
          : `Buying wins over ${yearsStr(horizonYears)}`,
      detail:
        lang === "ar"
          ? `ينتهي الشراء بأقل تكلفة بنحو ${formatCompactCurrency(advantage, "ar")}، على الرغم من أن الإيجار قد يكون أقل كلفة في البداية.`
          : `Buying ends about ${formatCompactCurrency(advantage, "en")} cheaper, though renting is ahead for most of the period.`,
      advantage,
      badgeLabel: lang === "ar" ? "يُنصح بالشراء" : "Favors Buying",
    };
  }

  return {
    kind: "rent",
    headline:
      lang === "ar"
        ? `الإيجار يتفوق على مدى ${yearsStr(horizonYears)}`
        : `Renting wins over ${yearsStr(horizonYears)}`,
    detail:
      lang === "ar"
        ? `الشراء لا يعوّض تكاليفه الأولية خلال ${yearsStr(horizonYears)}، حيث يكلّف نحو ${formatCompactCurrency(-advantage, "ar")} أكثر بعد احتساب الرسوم وعوائد الاستثمار البديلة.`
        : `Buying never catches up within ${yearsStr(horizonYears)} — it ends about ${formatCompactCurrency(-advantage, "en")} more expensive once fees and opportunity cost are counted.`,
    advantage,
    badgeLabel: lang === "ar" ? "يُنصح بالإيجار" : "Favors Renting",
  };
}

export const DICTIONARY = {
  en: {
    appName: "BREAKEVEN",
    appTagline: "Rent vs Buy Calculator",
    heroTitle: "Rent or buy in the UAE?",
    heroSubtitle:
      "Owning costs more than the mortgage. This compares both sides on true net cost — transfer and agent fees, service charges, what it takes to sell again, and the return you give up on the cash you tie up.",
    reset: "Reset numbers",
    yourNumbers: "Your parameters",
    emirate: "Emirate",
    emirateManual: "Fees edited by hand. Pick an emirate to restore statutory rates.",
    buyingOver: "Buying over",
    rentingOver: "Renting over",
    monthlyOwn: "Monthly to own",
    monthlyRent: "Monthly to rent",
    breakeven: "Breakeven",
    feesToBuy: "Upfront purchase fees",
    copyLink: "Share scenario",
    linkCopied: "Link copied to clipboard",
    yearByYear: "Year-by-year cash flows",
    yearsInAed: "years, in AED",
    chartCaption: "Cumulative net cost in AED if you exit in that year. Lower is better.",
    chartBuySeries: "Buying",
    chartRentSeries: "Renting",
    chartBreakevenLabel: "Breakeven",
    yearLabel: "Year",
    methodologyHeading: "How this is calculated in the UAE",
    methodologyDisclaimer:
      "Fee rates follow published UAE norms and Central Bank regulations; every parameter is editable. This is an analytical tool, not financial advice — verify current rates with your bank, DLD, or ADREC prior to committing.",
    quickPresets: "Quick values",
    statutoryBadge: "Statutory UAE Rules Applied",
    dubaiLandDept: "Dubai Land Dept (DLD)",
    abuDhabiMun: "Abu Dhabi Real Estate Centre (ADREC)",
    uaeCentralBank: "UAE Central Bank (LTV Rules)",
    years: "years",
    year: "year",
    never: "Never in horizon",
    modeSimple: "Simple",
    modeAdvanced: "Advanced",
    simpleModeBadge: "Essential",
    advancedModeBadge: "All 21 Parameters",
    simpleModeNotice: "16 statutory fees & running costs use official UAE market defaults (DLD 4%, mortgage registration 0.25%, service charges, Ejari, DEWA).",
    customizeAll: "Customize all parameters",
    coreInputsSection: "Core parameters",
    sections: {
      theProperty: "The property",
      theMortgage: "The mortgage",
      runningCosts: "Running costs",
      feesToBuy: "Fees to buy",
      feesToSell: "Fees to sell",
      renting: "Renting",
      yourAssumptions: "Your assumptions",
    },
    fields: {
      propertyPrice: { label: "Property price", suffix: "AED" },
      propertySizeSqft: { label: "Built-up size", suffix: "sqft" },
      appreciationPct: { label: "Appreciation", suffix: "%/yr" },
      downPaymentPct: { label: "Down payment", suffix: "%" },
      mortgageRatePct: { label: "Mortgage interest", suffix: "%" },
      tenureYears: { label: "Loan tenure", suffix: "yrs" },
      serviceChargePerSqft: { label: "Service charge", suffix: "AED/sqft" },
      serviceChargeIncreasePct: { label: "Service charge rise", suffix: "%/yr" },
      maintenancePct: {
        label: "Maintenance reserve",
        suffix: "%/yr",
        hint: "Share of property value spent on upkeep each year.",
      },
      dldFeePct: {
        label: "Transfer fee",
        suffix: "%",
        hint: "Dubai Land Department 4%; Abu Dhabi 2%.",
      },
      mortgageRegistrationPct: {
        label: "Mortgage registration",
        suffix: "% of loan",
        hint: "0.25% of loan amount + AED 290 flat admin fee.",
      },
      agentFeePct: { label: "Buyer agent fee", suffix: "% + VAT" },
      otherUpfront: {
        label: "Other upfront fees",
        suffix: "AED",
        hint: "Property valuation, trustee office, bank processing.",
      },
      sellingAgentFeePct: {
        label: "Agent fee on sale",
        suffix: "% + VAT",
        hint: "Early settlement penalty (1% capped at AED 10k) added automatically.",
      },
      annualRent: { label: "Annual rent", suffix: "AED" },
      rentIncreasePct: { label: "Rent increase", suffix: "%/yr" },
      dewaHousingFeePct: {
        label: "Housing fee",
        suffix: "% of rent",
        hint: "DEWA / municipality charge on the tenancy contract.",
      },
      ejariFeeAnnual: {
        label: "Ejari registration",
        suffix: "AED/yr",
        hint: "Annual lease attestation fee (Dubai Ejari).",
      },
      securityDepositPct: {
        label: "Security deposit",
        suffix: "% of rent",
        hint: "Refundable; represents opportunity cost of locked capital.",
      },
      investmentReturnPct: {
        label: "Alternative investment return",
        suffix: "%/yr",
        hint: "What the renter earns by investing the down payment and savings.",
      },
      horizonYears: { label: "Comparison horizon", suffix: "yrs" },
    },
    tableColumns: {
      mortgagePaid: { label: "Mortgage", title: "Mortgage payments made this year" },
      serviceCharge: { label: "Service", title: "Service charge for the year" },
      maintenance: { label: "Upkeep", title: "Maintenance for the year" },
      loanBalance: { label: "Loan left", title: "Outstanding mortgage balance" },
      homeValue: { label: "Home value", title: "Property value after appreciation" },
      sellingCosts: { label: "To sell", title: "Agent fee plus VAT and early settlement" },
      buyNetCost: { label: "Buy Net Cost", title: "Cumulative net cost of buying" },
      rentCashOut: { label: "Rent paid", title: "Rent plus housing fee and Ejari" },
      rentNetCost: { label: "Rent Net Cost", title: "Cumulative net cost of renting" },
    },
    methodology: [
      {
        title: "The net cost comparison",
        body: "Both sides are measured as cumulative net cost at the end of each year, assuming you exit that year — the buyer sells, the renter moves out. Lower is better, and the breakeven year is the first year buying costs less.",
      },
      {
        title: "What buying costs in the UAE",
        body: "Down payment, statutory transfer fee (4% in Dubai DLD, 2% in Abu Dhabi), mortgage registration at 0.25% of the loan plus AED 290, agent fee (2% + 5% VAT), and bank valuation. Annual costs include mortgage payments, compounding service charges, and maintenance reserves.",
      },
      {
        title: "Net sale proceeds at exit",
        body: `Not the headline price. Net sale proceeds equal the appreciated home value minus the outstanding loan, minus the selling broker's fee (2% + VAT), minus early mortgage settlement at 1% of the balance, strictly capped at AED ${EARLY_SETTLEMENT_CAP.toLocaleString("en-AE")} per UAE Central Bank regulations.`,
      },
      {
        title: "What renting costs in the UAE",
        body: "Annual contract rent, the 5% municipality housing fee collected through DEWA utility bills (3% in Abu Dhabi), and annual Ejari tenancy registration. The refundable security deposit is not lost, but cannot be invested.",
      },
      {
        title: "The opportunity cost of capital",
        body: "The renter invests what a buyer would sink into the down payment and upfront purchase fees, compounded at your investment return rate. In high-yield environments, this compounding portfolio is often the decisive factor.",
      },
      {
        title: "UAE statutory considerations",
        body: "UAE residential property incurs 0% personal capital gains tax and 0% personal income tax. Central Bank rules enforce minimum down payments of 20% (< AED 5M) and 25% (> AED 5M), and cap maximum mortgage tenure at 25 years.",
      },
    ],
  },
  ar: {
    appName: "دار الميزان",
    appTagline: "حاسبة التملك والإيجار",
    heroTitle: "الشراء أم الإيجار في الإمارات؟",
    heroSubtitle:
      "تكلفة التملك العقاري تتجاوز مجرد أقساط الرهن. هذه الأداة تقارن بين الخيارين وفق التكلفة الصافية الفعلية — شاملة رسوم التسجيل العقاري والوسطاء، رسوم الخدمات والصيانة، تكاليف إعادة البيع، والعائد الضائع على السيولة المستثمرة.",
    reset: "إعادة تعيين الأرقام",
    yourNumbers: "مدخلات الحساب",
    emirate: "الإمارة",
    emirateManual: "تم تعديل الرسوم يدوياً. اختر الإمارة لتطبيق النسب والرسوم الرسمية.",
    buyingOver: "الشراء خلال",
    rentingOver: "الإيجار خلال",
    monthlyOwn: "التكلفة الشهرية للتملك",
    monthlyRent: "التكلفة الشهرية للإيجار",
    breakeven: "نقطة التعادل",
    feesToBuy: "رسوم الشراء الأولية",
    copyLink: "مشاركة السيناريو",
    linkCopied: "تم نسخ الرابط بنجاح",
    yearByYear: "التدفقات المالية سنة بسنة",
    yearsInAed: "سنوات، بالدرهم الإماراتي",
    chartCaption: "التكلفة التراكمية الصافية بالدرهم عند التخارج في تلك السنة. القيمة الأقل هي الأفضل.",
    chartBuySeries: "التملك (الشراء)",
    chartRentSeries: "الإيجار",
    chartBreakevenLabel: "نقطة التعادل",
    yearLabel: "السنة",
    methodologyHeading: "كيف يتم الحساب وفق القوانين والأنظمة الإماراتية؟",
    methodologyDisclaimer:
      "تعتمد الرسوم على اللوائح الصادرة عن دائرة الأراضي والأملاك في دبي والبلديات ومصرف الإمارات المركزي. هذه أداة تحليلية وليست استشارة مالية — يُرجى التحقق من الرسوم المحدثة مع المصرف والجهات المختصة قبل اتخاذ القرار.",
    quickPresets: "قيم سريعة",
    statutoryBadge: "وفق لوائح وقوانين دولة الإمارات",
    dubaiLandDept: "أراضي دبي (DLD)",
    abuDhabiMun: "مركز أبوظبي العقاري (ADREC)",
    uaeCentralBank: "مصرف الإمارات المركزي (الحد الائتماني)",
    years: "سنوات",
    year: "سنة",
    never: "لا تتحقق خلال المدة",
    modeSimple: "مبسط",
    modeAdvanced: "متقدم",
    simpleModeBadge: "المدخلات الأساسية",
    advancedModeBadge: "كافة الـ 21 معياراً",
    simpleModeNotice: "تم ضبط 16 رسماً وتكلفة تشغيلية تلقائياً وفق معايير السوق الرسمية في الإمارات (أراضي دبي 4%، تسجيل الرهن 0.25%، رسوم الخدمات، إيجاري، ديوا).",
    customizeAll: "تخصيص كافة المعايير",
    coreInputsSection: "المدخلات الرئيسية",
    sections: {
      theProperty: "بيانات العقار",
      theMortgage: "التمويل العقاري (الرهن)",
      runningCosts: "التكاليف التشغيلية السنوية",
      feesToBuy: "رسوم الشراء الأولية",
      feesToSell: "تكاليف البيع والخروج",
      renting: "تكاليف الإيجار",
      yourAssumptions: "الافتراضات الاستثمارية",
    },
    fields: {
      propertyPrice: { label: "سعر العقار", suffix: "د.إ" },
      propertySizeSqft: { label: "المساحة الإجمالية", suffix: "قدم²" },
      appreciationPct: { label: "نسبة نمو القيمة", suffix: "%/سنوياً" },
      downPaymentPct: { label: "الدفعة الأولى", suffix: "%" },
      mortgageRatePct: { label: "نسبة فائدة الرهن", suffix: "%" },
      tenureYears: { label: "مدة التمويل", suffix: "سنوات" },
      serviceChargePerSqft: { label: "رسوم الخدمات", suffix: "د.إ/قدم²" },
      serviceChargeIncreasePct: { label: "زيادة رسوم الخدمات", suffix: "%/سنوياً" },
      maintenancePct: {
        label: "مخصص الصيانة",
        suffix: "%/سنوياً",
        hint: "نسبة سنوية من قيمة العقار تُخصص للإصلاحات والتجديد.",
      },
      dldFeePct: {
        label: "رسوم نقل الملكية",
        suffix: "%",
        hint: "أراضي دبي 4%؛ بلدية أبوظبي 2%.",
      },
      mortgageRegistrationPct: {
        label: "تسجيل الرهن العقاري",
        suffix: "% من القرض",
        hint: "0.25% من قيمة التمويل + 290 درهم رسوم إدارية ثابتة.",
      },
      agentFeePct: { label: "عمولة وسيط الشراء", suffix: "% + ضريبة" },
      otherUpfront: {
        label: "رسوم أولية أخرى",
        suffix: "د.إ",
        hint: "التقييم العقاري، أمين التسجيل، رسوم البنك الإدارية.",
      },
      sellingAgentFeePct: {
        label: "عمولة وسيط البيع",
        suffix: "% + ضريبة",
        hint: "غرامة السداد المبكر (1% بحد أقصى 10 آلاف درهم) تُحسب تلقائياً.",
      },
      annualRent: { label: "الإيجار السنوي", suffix: "د.إ" },
      rentIncreasePct: { label: "زيادة الإيجار المتوقعة", suffix: "%/سنوياً" },
      dewaHousingFeePct: {
        label: "رسوم السكن البلدية",
        suffix: "% من الإيجار",
        hint: "رسوم بلدية دبي المضافة لفاتورة ديوا (5%) أو أبوظبي (3%).",
      },
      ejariFeeAnnual: {
        label: "توثيق عقد إيجاري",
        suffix: "د.إ/سنوياً",
        hint: "رسوم تصديق عقد الإيجار السنوية (إيجاري/توثيق).",
      },
      securityDepositPct: {
        label: "مبلغ التأمين المسترد",
        suffix: "% من الإيجار",
        hint: "مبلغ مسترد؛ يمثل تكلفة الفرصة البديلة لعدم استثماره.",
      },
      investmentReturnPct: {
        label: "العائد الاستثماري البديل",
        suffix: "%/سنوياً",
        hint: "العائد المتوقع لو تم استثمار الدفعة الأولى والمدخرات في الأسهم أو الصناديق.",
      },
      horizonYears: { label: "أفق المقارنة الزمني", suffix: "سنوات" },
    },
    tableColumns: {
      mortgagePaid: { label: "أقساط الرهن", title: "أقساط التمويل المسددة خلال السنة" },
      serviceCharge: { label: "رسوم الخدمات", title: "رسوم الخدمات السنوية للبرج/المجمع" },
      maintenance: { label: "الصيانة", title: "تكاليف الصيانة والترميم السنوية" },
      loanBalance: { label: "الرصيد المتبقي", title: "رصيد الرهن المتبقي على العقار" },
      homeValue: { label: "قيمة العقار", title: "القيمة السوقية بعد نمو الأسعار" },
      sellingCosts: { label: "تكاليف البيع", title: "عمولة البيع وضريبة القيمة المضافة وغرامة السداد المبكر" },
      buyNetCost: { label: "صافي تكلفة الشراء", title: "التكلفة الصافية التراكمية عند التملك" },
      rentCashOut: { label: "الإيجار المدفوع", title: "الإيجار السنوي مع رسوم البلدية وإيجاري" },
      rentNetCost: { label: "صافي تكلفة الإيجار", title: "التكلفة الصافية التراكمية عند الإيجار" },
    },
    methodology: [
      {
        title: "مبدأ المقارنة وفق التكلفة الصافية",
        body: "تُقاس كلتا الحالتين على أساس التكلفة التراكمية الصافية بنهاية كل سنة، بافتراض الخروج في تلك السنة (بيع المشتري للعقار، أو إخلاء المستأجر). القيمة الأقل تمثل الخيار الأفضل، وسنة التعادل هي أول سنة تصبح فيها كلفة الشراء أقل من الإيجار.",
      },
      {
        title: "تكاليف شراء العقار في الإمارات",
        body: "تشمل الدفعة الأولى، رسوم التسجيل العقاري (4% في دبي DLD، و2% في أبوظبي ADREC)، رسوم تسجيل الرهن 0.25% + 290 درهم، عمولة الوسيط 2% + 5% ضريبة، ورسوم التقييم وأمين التسجيل. سنوياً: أقساط الرهن، رسوم الخدمات المتصاعدة، ومخصصات الصيانة.",
      },
      {
        title: "صافي عوائد البيع عند التخارج",
        body: `ليست مجرد سعر البيع. صافي العائد هو القيمة السوقية للعقار مطروحاً منها رصيد الرهن المتبقي، وعمولة وسيط البيع (2% + ضريبة)، ورسوم السداد المبكر المحددة بنسبة 1% بحد أقصى ${EARLY_SETTLEMENT_CAP.toLocaleString("ar-AE")} درهم وفق أنظمة المصرف المركزي.`,
      },
      {
        title: "تكاليف الإيجار في الإمارات",
        body: "الإيجار السنوي المتفق عليه، ورسوم السكن البلدية (5% في دبي تُحصّل عبر فاتورة ديوا، و3% في أبوظبي)، ورسوم تصديق عقد إيجاري/توثيق. مبلغ التأمين مسترد، لكنه يمثل سيولة مجمّدة لا تُستثمر.",
      },
      {
        title: "تكلفة الفرصة البديلة لرأس المال",
        body: "المستأجر يستثمر المبلغ الذي كان سيدفعه المشتري كدفعة أولى ورسوم تسجيل، مضافاً إليه أي وفر نقدي سنوي. نمو هذه المحفظة الاستثمارية بالمركب وفق عائدك المفترض هو غالباً ما يحسم قرار الشراء أو الإيجار.",
      },
      {
        title: "البيئة التنظيمية والضريبية في الدولة",
        body: "تتميز عقارات الإمارات السكنية بـ 0% ضريبة دخل شخصي و0% ضريبة أرباح رأسمالية. ويحدد المصرف المركزي الحد الأدنى للدفعة الأولى بـ 20% للمواطنين/المقيمين (25% للعقارات فوق 5 ملايين درهم) مع سقف 25 سنة للتمويل.",
      },
    ],
  },
};

export const PRESET_LABELS: Record<Language, Record<string, { label: string; note: string }>> = {
  en: {
    dubai: {
      label: "Dubai",
      note: "DLD transfer fee 4%, Ejari AED 220/yr, 5% municipality housing fee.",
    },
    abuDhabi: {
      label: "Abu Dhabi",
      note: "ADREC transfer fee 2%, no Ejari fee, 3% municipality housing fee.",
    },
  },
  ar: {
    dubai: {
      label: "دبي",
      note: "رسوم أراضي دبي 4%، إيجاري 220 د.إ/سنة، رسوم البلدية 5%.",
    },
    abuDhabi: {
      label: "أبوظبي",
      note: "رسوم التسجيل 2%، إعفاء إيجاري، رسوم البلدية 3%.",
    },
  },
};
