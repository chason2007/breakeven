import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
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

export const metadata: Metadata = {
  title: "BREAKEVEN UAE | Rent vs Buy Property Calculator | دار الميزان",
  description:
    "Compare renting against buying a UAE residential home on true net cost: DLD/ADREC statutory transfer fees, mortgage registration, service charges, early settlement rules, and investment opportunity costs.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} h-full antialiased`}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </head>
      <body className="flex min-h-full flex-col bg-paper text-ink selection:bg-buy/15">
        <LanguageProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
