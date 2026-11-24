"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Copies the current URL. The URL already carries the inputs — Calculator keeps
 * the query string in sync — so there is nothing to serialise here.
 */
export function ShareButton() {
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
      // Clipboard blocked (insecure context or denied permission). The address
      // bar already holds the shareable link, so there is nothing to recover.
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex shrink-0 items-center gap-2 rounded-md border border-rule px-3 py-1.5 text-[0.8125rem] font-medium text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
    >
      <svg aria-hidden viewBox="0 0 20 20" className="h-3.5 w-3.5">
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
      <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
    </button>
  );
}
