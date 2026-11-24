import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";
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
  title: "Rent or buy in the UAE",
  description:
    "Compare renting against buying a UAE home on true net cost: transfer and agent fees, service charges, exit costs and the return you give up on the cash you tie up.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
