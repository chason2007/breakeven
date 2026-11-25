import type { Metadata } from "next";
import { Fraunces, Public_Sans, Tajawal } from "next/font/google";
import { LanguageProvider } from "@/context/LanguageContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Fraunces carries the judgement calls — the verdict and the page title.
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

// Public Sans carries the regulated numbers: plainspoken, strong tabular figures.
const text = Public_Sans({
  variable: "--font-text",
  subsets: ["latin"],
  display: "swap",
});

// Tajawal covers the Arabic side, where Fraunces has no glyphs at all.
const arabic = Tajawal({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Breakeven UAE — Rent vs Buy Calculator",
  description:
    "Compare renting against buying a UAE home on true net cost: DLD/ADREC transfer fees, mortgage registration, service charges, early settlement rules, and the return you give up on the cash you tie up.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink selection:bg-buy/15">
        <LanguageProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
