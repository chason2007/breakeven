export interface LogoProps {
  variant?: "full" | "icon" | "mark";
  lang?: "en" | "ar";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({
  variant = "full",
  lang = "en",
  className = "",
  size = "md",
}: LogoProps) {
  const isArabic = lang === "ar";

  const iconSizes = {
    sm: 34,
    md: 46,
    lg: 54,
  };

  const px = iconSizes[size];

  return (
    <div
      className={`inline-flex items-center gap-3.5 select-none ${className}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* UAE Property Brand Emblem */}
      <svg
        width={px}
        height={px}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.14)] transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          {/* UAE Luxury Gold Gradient */}
          <linearGradient id="uaeGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFBF7A" />
            <stop offset="50%" stopColor="#C5A059" />
            <stop offset="100%" stopColor="#8E6B23" />
          </linearGradient>

          {/* Deep Navy / Sapphire Architectural Gradient */}
          <linearGradient id="uaeNavy" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1B4D8F" />
            <stop offset="100%" stopColor="#0B2545" />
          </linearGradient>

          {/* Subtle Glow Filter */}
          <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#C5A059" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer Architectural Diamond Shield / Islamic Geometric Star Contour */}
        <rect
          x="32"
          y="3"
          width="41"
          height="41"
          rx="7"
          transform="rotate(45 32 3)"
          fill="url(#uaeNavy)"
          stroke="url(#uaeGold)"
          strokeWidth="1.75"
        />

        {/* Inner Geometric Pattern / Mashrabiya Arches */}
        <rect
          x="32"
          y="8"
          width="34"
          height="34"
          rx="4"
          transform="rotate(45 32 8)"
          stroke="url(#uaeGold)"
          strokeWidth="0.8"
          strokeOpacity="0.45"
          fill="none"
        />

        {/* Centerpiece: UAE Skyline Spire + Property Gable Roof + Balance Scales */}
        {/* Modern Burj / Skyline Spire (Rising high) */}
        <path
          d="M32 10L35 22H29L32 10Z"
          fill="url(#uaeGold)"
          filter="url(#softGlow)"
        />
        <line x1="32" y1="8" x2="32" y2="22" stroke="#FFF" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

        {/* High-Rise Stepped Tower Columns */}
        <path
          d="M26 24H38V44H26V24Z"
          fill="#0B2545"
          stroke="url(#uaeGold)"
          strokeWidth="1.2"
        />

        {/* Stepped Architectural Terrace Cuts */}
        <line x1="26" y1="29" x2="38" y2="29" stroke="url(#uaeGold)" strokeWidth="0.8" opacity="0.6" />
        <line x1="26" y1="34" x2="38" y2="34" stroke="url(#uaeGold)" strokeWidth="0.8" opacity="0.6" />
        <line x1="26" y1="39" x2="38" y2="39" stroke="url(#uaeGold)" strokeWidth="0.8" opacity="0.6" />

        {/* Residential Property Villa Gable Roof (Overlaid across the skyline) */}
        <path
          d="M17 38L32 25L47 38"
          stroke="url(#uaeGold)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#softGlow)"
        />

        {/* Traditional Islamic Arch Doorway / Foundation Vault */}
        <path
          d="M29 44V36C29 34.3431 30.3431 33 32 33C33.6569 33 35 34.3431 35 36V44"
          stroke="url(#uaeGold)"
          strokeWidth="1.5"
          fill="url(#uaeGold)"
          fillOpacity="0.25"
        />

        {/* UAE Breakeven Balance Fulcrum (Left & Right Balanced Pods) */}
        <circle cx="21" cy="45" r="2.5" fill="url(#uaeGold)" />
        <circle cx="43" cy="45" r="2.5" fill="url(#uaeGold)" />
        <line x1="19" y1="48" x2="45" y2="48" stroke="url(#uaeGold)" strokeWidth="1.75" strokeLinecap="round" />

        {/* UAE National Accent Dot Trio (Green, White, Red subtle prestige jewel) */}
        <circle cx="28" cy="53" r="1.2" fill="#009739" />
        <circle cx="32" cy="53" r="1.2" fill="#FFFFFF" />
        <circle cx="36" cy="53" r="1.2" fill="#E5233B" />
      </svg>

      {/* Typography: Bilingual Branding */}
      {variant === "full" && (
        <div className="flex items-center gap-2.5">
          <span className="font-display text-xl sm:text-[1.65rem] font-black tracking-tight text-ink group-hover:text-buy transition-colors">
            {isArabic ? "دار الميزان" : "BREAKEVEN"}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-gold-wash/90 border border-gold/40 text-gold-dark dark:text-gold-light uppercase tracking-wider shadow-2xs">
            {isArabic ? "الإمارات" : "UAE"}
          </span>
        </div>
      )}
    </div>
  );
}
