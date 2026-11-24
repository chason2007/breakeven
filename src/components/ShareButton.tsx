"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Copies the current URL. The URL already carries the inputs — Calculator keeps
 * the query string in sync — so there is nothing to serialise here.
 */
export function ShareButton() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission).
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all ${
        copied
          ? "border-uae-green/40 bg-uae-green/10 text-uae-green shadow-xs"
          : "border-rule bg-panel text-ink-soft hover:border-ink-faint hover:text-ink shadow-2xs"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4">
        {copied ? (
          <path
            d="M4 10.5 8 14.5 16 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M8.5 11.5a3 3 0 0 0 4.3.1l2.6-2.6a3 3 0 0 0-4.2-4.2l-.6.6" />
            <path d="M11.5 8.5a3 3 0 0 0-4.3-.1l-2.6 2.6a3 3 0 0 0 4.2 4.2l.6-.6" />
          </g>
        )}
      </svg>
      <span aria-live="polite">{copied ? t.linkCopied : t.copyLink}</span>
    </button>
  );
}
