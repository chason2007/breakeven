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
  const messages = warnings.length ? `${id}-messages` : undefined;
  const described = [messages, hint ? `${id}-hint` : undefined].filter(Boolean).join(" ");
  const flagged = warnings.some((w) => w.level === "warn");

  // The slider can't represent out-of-range values, so clamp the thumb and let
  // the number input carry the real figure — nothing typed is rewritten.
  const thumb = Math.min(Math.max(value, min), max);
  const progress = ((thumb - min) / (max - min)) * 100;

  return (
    <div className="group py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="text-[0.8125rem] leading-snug font-medium text-ink-soft group-hover:text-ink transition-colors">
          {label}
        </label>
        <div className="flex shrink-0 items-center gap-1.5">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            step={step}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
            aria-invalid={flagged || undefined}
            aria-describedby={described || undefined}
            className={`w-[6rem] rounded-md border bg-panel px-2 py-1 text-end text-sm font-semibold tabular-nums shadow-2xs transition-all focus:outline-none ${
              flagged
                ? "border-flag bg-flag/5 text-flag focus:ring-1 focus:ring-flag"
                : "border-rule hover:border-ink-faint focus:border-buy focus:ring-1 focus:ring-buy"
            }`}
          />
          {suffix ? (
            <span className="w-[3.75rem] text-[0.6875rem] leading-tight text-ink-faint text-start font-medium select-none">
              {suffix}
            </span>
          ) : null}
        </div>
      </div>

      {/*
        Pointer-only affordance: the number input above is the accessible,
        keyboard-reachable control, so this is hidden from assistive tech.
      */}
      <input
        aria-hidden="true"
        tabIndex={-1}
        type="range"
        min={min}
        max={max}
        step={step}
        value={thumb}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, var(--buy) ${progress}%, var(--rule) ${progress}%)`,
        }}
        className="mt-2.5 h-[4px] w-full cursor-pointer appearance-none rounded-full transition-opacity opacity-85 hover:opacity-100"
      />

      {warnings.length ? (
        <ul id={messages} className="mt-2 space-y-1">
          {warnings.map((w) => (
            <li
              key={w.message}
              className={`flex items-start gap-1.5 text-[0.6875rem] leading-snug ${
                w.level === "warn" ? "text-flag font-medium" : "text-ink-faint"
              }`}
            >
              <span className="shrink-0 mt-0.5">•</span>
              <span>{w.message}</span>
            </li>
          ))}
        </ul>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[0.6875rem] leading-snug text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
