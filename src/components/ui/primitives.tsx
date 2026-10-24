import type { ReactNode } from "react";
import Link from "next/link";
import {
  Badge as CossBadge,
  type BadgeProps as CossBadgeProps,
} from "@coss/ui/components/badge";
import { Button as CossButton } from "@coss/ui/components/button";
import { Card as CossCard } from "@coss/ui/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@coss/ui/components/empty";
import { Kbd as CossKbd } from "@coss/ui/components/kbd";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@coss/ui/components/progress";
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
  return (
    <CossCard
      className={cn("gap-0 p-0", className)}
      render={Tag === "div" ? undefined : <Tag />}
    >
      {children}
    </CossCard>
  );
}

const toneToVariant: Record<string, CossBadgeProps["variant"]> = {
  neutral: "outline",
  accent: "info",
  success: "success",
  warning: "warning",
  error: "error",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning" | "error";
  className?: string;
}) {
  return (
    <CossBadge variant={toneToVariant[tone]} className={className}>
      {children}
    </CossBadge>
  );
}

export function ProgressBar({
  value,
  tone = "var(--primary)",
  height = 6,
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
    <Progress
      value={pct}
      aria-label={label ?? "進捗"}
      className={cn("w-full", className)}
    >
      <ProgressTrack style={{ height }} className="bg-input">
        <ProgressIndicator style={{ background: tone, height }} />
      </ProgressTrack>
    </Progress>
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
        <h1 className="display text-3xl md:text-[2.5rem]">{title}</h1>
        {description ? (
          <p className="jp mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-[0.95rem]">
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
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
      <p className="mono mt-1 text-2xl font-semibold tracking-tight" style={{ color: tone }}>
        {value}
      </p>
      {sub ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{sub}</p> : null}
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
    <Empty className="card min-h-56 px-6 py-10 md:py-12">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {action}
    </Empty>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="パンくず" className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 ? <span aria-hidden>/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
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
    <CossButton
      variant={variant === "primary" ? "default" : variant === "ghost" ? "ghost" : "outline"}
      render={<Link href={href} />}
      className={className}
    >
      {children}
    </CossButton>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <CossKbd>{children}</CossKbd>;
}
