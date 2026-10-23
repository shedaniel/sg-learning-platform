"use client";

import type { ReactNode } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type WidgetProps = Record<string, string | number | boolean> | undefined;

/** Read a numeric prop without trusting its shape or range. */
export function numberProp(props: WidgetProps, key: string, fallback: number): number {
  const value = props?.[key];
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function stringProp(props: WidgetProps, key: string, fallback: string): string {
  const value = props?.[key];
  return typeof value === "string" && value.trim() !== "" ? value : fallback;
}

export function WidgetBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[40rem] space-y-4 text-sm", className)}>{children}</div>;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 space-y-1", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <label htmlFor={htmlFor} className="text-xs font-semibold text-fg">
          {label}
        </label>
        {hint ? <span className="text-[0.65rem] font-medium text-muted">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-[0.7rem] font-medium leading-5 text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

const METRIC_TONES = {
  default: "text-fg",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
} as const;

export function Metric({
  label,
  value,
  sub,
  tone = "default",
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: keyof typeof METRIC_TONES;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0 rounded-lg border border-border bg-surface-2 px-3 py-2", className)}>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className={cn("mono mt-0.5 break-words text-base font-semibold leading-6", METRIC_TONES[tone])}>{value}</p>
      {sub ? <p className="text-[0.68rem] leading-5 text-muted">{sub}</p> : null}
    </div>
  );
}

const NOTE_TONES = {
  info: "border-accent/45 bg-bg-soft",
  tip: "border-success/45 bg-success/10",
  warn: "border-warning/50 bg-warning/10",
} as const;

export function Note({
  children,
  tone = "info",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof NOTE_TONES;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border-l-2 px-3 py-2 text-[0.74rem] leading-6 text-fg", NOTE_TONES[tone], className)}>
      {children}
    </div>
  );
}

export function Verdict({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex items-start gap-1.5 rounded-md px-2 py-1.5 text-[0.74rem] font-semibold leading-5",
        ok ? "bg-success/10 text-success" : "bg-error/10 text-error",
      )}
    >
      {ok ? (
        <Check aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      ) : (
        <X aria-hidden className="mt-0.5 size-3.5 shrink-0" />
      )}
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}

export function ResetButton({ onClick, label = "リセット" }: { onClick: () => void; label?: string }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-ghost">
      <RotateCcw aria-hidden className="size-3.5" />
      {label}
    </button>
  );
}
