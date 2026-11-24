"use client";

import { useId } from "react";
import type { Warning } from "@/lib/validate";

export interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (next: number) => void;
  /** Slider bounds. The number input accepts values outside them. */
  min: number;
  max: number;
  step: number;
  suffix?: string;
  hint?: string;
  warnings?: Warning[];
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  suffix,
  hint,
  warnings = [],
}: NumberFieldProps) {
  const id = useId();
  const describedBy = warnings.length ? `${id}-warnings` : hint ? `${id}-hint` : undefined;
  const hasError = warnings.some((w) => w.level === "warn");
  // The slider cannot represent out-of-range values; clamp its thumb and let the
  // number input carry the real figure so nothing is silently rewritten.
  const sliderValue = Math.min(Math.max(value, min), max);

  return (
    <div className="py-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            step={step}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={`w-28 rounded-lg border bg-white px-2.5 py-1.5 text-right text-sm font-medium tabular-nums text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:bg-slate-900 dark:text-slate-100 ${
              hasError
                ? "border-amber-500 dark:border-amber-500/70"
                : "border-slate-300 focus:border-sky-500 dark:border-slate-700 dark:focus:border-sky-400"
            }`}
          />
          {suffix ? (
            <span className="w-[4.5rem] shrink-0 text-xs text-slate-500 dark:text-slate-400">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={`${label} slider`}
        tabIndex={-1}
        className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-sky-600 dark:bg-slate-700 dark:accent-sky-400"
      />

      {warnings.length ? (
        <ul id={`${id}-warnings`} className="mt-1.5 space-y-1">
          {warnings.map((w) => (
            <li
              key={w.message}
              className={`text-xs leading-snug ${
                w.level === "warn"
                  ? "text-amber-700 dark:text-amber-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {w.level === "warn" ? "⚠ " : ""}
              {w.message}
            </li>
          ))}
        </ul>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
