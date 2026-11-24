"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Copies the current URL. The URL already carries the inputs (Calculator keeps
 * the query string in sync), so there is nothing to serialise here.
 */
export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — the URL bar
      // already holds the shareable link, so there is nothing to fall back to.
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-surface px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white"
    >
      <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4">
        {copied ? (
          <path
            d="M4 10.5 8 14.5 16 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M8.5 11.5a3 3 0 0 0 4.3.1l2.6-2.6a3 3 0 0 0-4.2-4.2l-.6.6" />
            <path d="M11.5 8.5a3 3 0 0 0-4.3-.1l-2.6 2.6a3 3 0 0 0 4.2 4.2l.6-.6" />
          </g>
        )}
      </svg>
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}
