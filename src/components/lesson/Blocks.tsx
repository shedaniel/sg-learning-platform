import Link from "next/link";
import type { ReactNode } from "react";
import { TERM_BY_ID } from "@/content";
import type { Block } from "@/lib/content/types";
import { Diagram } from "@/components/diagrams";
import { WidgetRenderer } from "@/components/widgets";
import { cn } from "@/lib/utils";

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\{\{term:[^}|]+\|[^}]+\}\}|\{\{term:[^}]+\}\})/g;

export function InlineText({ text }: { text: string }): ReactNode {
  const parts = text.split(TOKEN).filter((part) => part.length > 0);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={index}>{part.slice(1, -1)}</code>;
        }
        if (part.startsWith("{{term:")) {
          const body = part.slice(7, -2);
          const [id, customLabel] = body.split("|");
          const term = TERM_BY_ID.get(id);
          const label = customLabel ?? term?.ja ?? id;
          return (
            <Link
              key={index}
              href={`/glossary/${id}`}
              className="term-link"
              title={term ? `${term.ja}（${term.en}）: ${term.shortJa}` : undefined}
            >
              {label}
            </Link>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function TermsBlock({ termIds }: { termIds: readonly string[] }) {
  const terms = termIds.map((id) => TERM_BY_ID.get(id)).filter(Boolean);
  if (terms.length === 0) return null;
  return (
    <div className="my-5 grid gap-2 sm:grid-cols-2">
      {terms.map((term) => {
        if (!term) return null;
        return (
          <Link
            key={term.id}
            href={`/glossary/${term.id}`}
            className="group rounded-xl border border-border bg-muted p-3.5 transition-colors hover:border-ring/50"
          >
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold text-foreground group-hover:text-info-foreground">{term.ja}</span>
              {term.reading ? (
                <span className="text-[0.7rem] text-muted-foreground">（{term.reading}）</span>
              ) : null}
              <span className="text-[0.7rem] text-muted-foreground">{term.en}</span>
            </div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{term.shortJa}</p>
          </Link>
        );
      })}
    </div>
  );
}

const calloutStyles = {
  tip: {
    wrap: "border-border border-l-2 border-l-accent bg-muted",
    label: "試験のヒント",
    icon: "◎",
  },
  trap: {
    wrap: "border-warning/30 bg-warning/8",
    label: "ひっかけ注意",
    icon: "△",
  },
  info: {
    wrap: "border-border bg-muted",
    label: "補足",
    icon: "i",
  },
  example: {
    wrap: "border-c3/25 bg-c3/6",
    label: "事例",
    icon: "▸",
  },
} as const;

export function CalloutBlock({
  tone,
  title,
  text,
}: {
  tone: keyof typeof calloutStyles;
  title: string;
  text: string;
}) {
  const style = calloutStyles[tone];
  return (
    <aside className={cn("my-5 rounded-xl border px-4 py-3.5", style.wrap)}>
      <p className="mb-1 flex items-center gap-2 text-xs font-semibold">
        <span className="mono grid size-5 place-items-center rounded-full border border-current text-[0.6rem] opacity-70">
          {style.icon}
        </span>
        {title}
        <span className="ml-auto text-[0.6rem] font-normal uppercase tracking-wider opacity-60">
          {style.label}
        </span>
      </p>
      <p className="jp text-sm leading-7 text-foreground/90">
        <InlineText text={text} />
      </p>
    </aside>
  );
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "lead":
      return (
        <p className="jp mb-5 mt-1 text-lg font-medium leading-8 text-foreground md:text-xl md:leading-9">
          <InlineText text={block.text} />
        </p>
      );
    case "p":
      return (
        <p className="jp my-3.5 text-[0.98rem] leading-8 text-foreground/90">
          <InlineText text={block.text} />
        </p>
      );
    case "list":
      return block.ordered ? (
        <ol className="my-4 list-decimal space-y-2 pl-5 text-[0.95rem] leading-7 marker:text-muted-foreground">
          {block.items.map((item, index) => (
            <li key={index} className="jp pl-1">
              <InlineText text={item} />
            </li>
          ))}
        </ol>
      ) : (
        <ul className="my-4 space-y-2 pl-1 text-[0.95rem] leading-7">
          {block.items.map((item, index) => (
            <li key={index} className="jp flex gap-2.5">
              <span aria-hidden className="mt-[0.65rem] size-1.5 shrink-0 rounded-full bg-primary/70" />
              <span>
                <InlineText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <figure className="my-6">
          <div className="scrollbar-thin overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              {block.caption ? (
                <caption className="border-b border-border bg-muted px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  {block.caption}
                </caption>
              ) : null}
              <thead>
                <tr className="border-b border-border bg-muted/70">
                  {block.headers.map((header, index) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-4 py-2.5 text-xs font-semibold text-muted-foreground"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-border last:border-0">
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={cn(
                          "jp px-4 py-3 align-top text-[0.86rem] leading-6",
                          cellIndex === 0 && "font-medium text-foreground",
                        )}
                      >
                        <InlineText text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.note ? (
            <figcaption className="mt-2 px-1 text-[0.7rem] leading-5 text-muted-foreground">
              {block.note}
            </figcaption>
          ) : null}
        </figure>
      );
    case "callout":
      return <CalloutBlock {...block} />;
    case "terms":
      return <TermsBlock termIds={block.termIds} />;
    case "diagram":
      return (
        <figure className="my-7">
          <div className="rounded-xl border border-border bg-card p-3 md:p-5">
            <Diagram id={block.diagram} props={block.props} />
          </div>
          {block.caption ? (
            <figcaption className="mt-2 px-1 text-center text-xs leading-5 text-muted-foreground">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    case "interactive":
      return (
        <div className="my-7 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2.5">
            <span className="size-1.5 rounded-full bg-primary" />
            <span className="text-xs font-semibold text-info-foreground">
              {block.title ?? "インタラクティブ"}
            </span>
            <span className="ml-auto text-[0.62rem] uppercase tracking-wider text-muted-foreground">
              Try it
            </span>
          </div>
          <div className="p-4 md:p-5">
            <WidgetRenderer widget={block.widget} props={block.props} />
          </div>
        </div>
      );
    case "comparison":
      return (
        <div className="my-6 grid gap-3 md:grid-cols-2">
          {[block.left, block.right].map((column, index) => (
            <div key={index} className="rounded-xl border border-border bg-muted p-4">
              <h4 className="mb-2 text-sm font-semibold text-foreground">{column.title}</h4>
              <ul className="space-y-1.5">
                {column.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="jp flex gap-2 text-[0.86rem] leading-6 text-muted-foreground">
                    <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary/60" />
                    <InlineText text={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    case "steps":
      return (
        <ol className="my-6 space-y-0">
          {block.items.map((item, index) => (
            <li key={index} className="relative flex gap-4 pb-5 last:pb-0">
              {index < block.items.length - 1 ? (
                <span className="absolute left-[0.95rem] top-8 h-full w-px bg-border" aria-hidden />
              ) : null}
              <span className="mono grid size-8 shrink-0 place-items-center rounded-full border border-ring/30 bg-muted text-xs font-semibold text-info-foreground">
                {index + 1}
              </span>
              <div className="pt-0.5">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="jp mt-1 text-[0.87rem] leading-6 text-muted-foreground">
                  <InlineText text={item.text} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      );
    default:
      return null;
  }
}

export function BlockList({ blocks }: { blocks: readonly Block[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </>
  );
}
