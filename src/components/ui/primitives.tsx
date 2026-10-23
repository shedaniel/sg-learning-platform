import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}) {
  return <Tag className={cn("card", className)}>{children}</Tag>;
}

const toneStyles = {
  neutral: "bg-surface-2 text-muted border-border",
  accent: "bg-surface-2 text-accent border-accent/30",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/25",
  error: "bg-error/10 text-error border-error/25",
} as const;

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof toneStyles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.7rem] font-semibold leading-5",
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "var(--accent)",
  height = 7,
  label,
  className,
}: {
  value: number;
  tone?: string;
  height?: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn("w-full overflow-hidden rounded-full bg-bg-soft", className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "進捗"}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, background: tone }}
      />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="display text-3xl font-semibold md:text-[2.6rem]">{title}</h1>
        {description ? (
          <p className="jp mt-3 max-w-2xl text-sm leading-7 text-muted md:text-[0.95rem]">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: string;
}) {
  return (
    <div className="card px-4 py-4 md:px-5">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <p className="mono mt-1 text-2xl font-semibold tracking-tight" style={{ color: tone }}>
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs leading-5 text-muted">{sub}</p> : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="grid size-11 place-items-center rounded-full bg-bg-soft text-lg text-muted">
        空
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="max-w-md text-sm leading-6 text-muted">{description}</p>
      {action}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="パンくず" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 ? <span aria-hidden>/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-fg">
              {item.label}
            </Link>
          ) : (
            <span className="text-fg">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function LinkButton({
  href,
  children,
  variant = "default",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "default" | "primary" | "ghost";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "btn",
        variant === "primary" && "btn-primary",
        variant === "ghost" && "btn-ghost",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted">
      {children}
    </kbd>
  );
}
