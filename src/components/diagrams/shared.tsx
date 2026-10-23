import type { ReactNode } from "react";

/** 図の配色は CSS 変数だけを使い、ライト・ダークの両テーマに追従させる。 */
export const COLORS = {
  neutral: "var(--border-strong)",
  fg: "var(--fg)",
  muted: "var(--muted)",
  accent: "var(--accent)",
  success: "var(--success)",
  warning: "var(--warning)",
  error: "var(--error)",
  c1: "var(--c1)",
  c2: "var(--c2)",
  c3: "var(--c3)",
  c4: "var(--c4)",
  c5: "var(--c5)",
  c6: "var(--c6)",
} as const;

export type Tone = keyof typeof COLORS;

const ARROW_TONES = [
  "fg",
  "muted",
  "accent",
  "success",
  "warning",
  "error",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
] as const;
export type ArrowTone = (typeof ARROW_TONES)[number];

/**
 * 矢印の先端は SVG マーカーで描く。マーカー id は図ごとの接頭辞で分離し、
 * 同じページに複数の図が並んでも衝突しないようにする。
 */
export function ArrowDefs({ prefix }: { prefix: string }) {
  return (
    <defs>
      {ARROW_TONES.map((tone) => (
        <marker
          key={tone}
          id={`${prefix}-arrow-${tone}`}
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="6.5"
          markerHeight="6.5"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS[tone]} />
        </marker>
      ))}
    </defs>
  );
}

export function DiagramSvg({
  title,
  desc,
  viewBox = "0 0 760 360",
  children,
}: {
  title: string;
  desc: string;
  viewBox?: string;
  children: ReactNode;
}) {
  return (
    <svg viewBox={viewBox} className="h-auto w-full" role="img" preserveAspectRatio="xMidYMid meet">
      <title>{title}</title>
      <desc>{desc}</desc>
      <g fontFamily="inherit" fontSize={13} fill="var(--fg)">
        {children}
      </g>
    </svg>
  );
}

export function Txt({
  x,
  y,
  children,
  anchor = "middle",
  tone = "fg",
  size = 13,
  weight = 400,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  tone?: Tone;
  size?: number;
  weight?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} fill={COLORS[tone]}>
      {children}
    </text>
  );
}

export function Node({
  x,
  y,
  w,
  h,
  title,
  sub,
  note,
  tone = "neutral",
  noteTone = "muted",
  dashed = false,
  titleSize = 14,
  rx = 10,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  note?: string;
  tone?: Tone;
  noteTone?: Tone;
  dashed?: boolean;
  titleSize?: number;
  rx?: number;
}) {
  const stroke = COLORS[tone];
  const cx = x + w / 2;
  const titleY = note ? y + h / 2 - 12 : sub ? y + h / 2 - 2 : y + h / 2 + 5;
  const subY = note ? y + h / 2 + 8 : y + h / 2 + 16;
  const noteY = y + h / 2 + 26;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={tone === "neutral" ? "var(--surface-2)" : stroke}
        fillOpacity={tone === "neutral" ? 0.65 : 0.1}
        stroke={stroke}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text x={cx} y={titleY} textAnchor="middle" fontSize={titleSize} fontWeight={600} fill="var(--fg)">
        {title}
      </text>
      {sub ? (
        <text x={cx} y={subY} textAnchor="middle" fontSize={13} fill="var(--muted)">
          {sub}
        </text>
      ) : null}
      {note ? (
        <text x={cx} y={noteY} textAnchor="middle" fontSize={13} fill={COLORS[noteTone]}>
          {note}
        </text>
      ) : null}
    </g>
  );
}

export function Panel({
  x,
  y,
  w,
  h,
  tone = "neutral",
  dashed = false,
  rx = 14,
  title,
  sub,
  titleSize = 14,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone?: Tone;
  dashed?: boolean;
  rx?: number;
  title?: string;
  sub?: string;
  titleSize?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={tone === "neutral" ? "var(--surface-2)" : COLORS[tone]}
        fillOpacity={tone === "neutral" ? 0.55 : 0.07}
        stroke={tone === "neutral" ? "var(--border)" : COLORS[tone]}
        strokeWidth={1.5}
        strokeDasharray={dashed ? "6 5" : undefined}
      />
      {title ? (
        <text x={x + 16} y={y + 24} fontSize={titleSize} fontWeight={600} fill="var(--fg)">
          {title}
        </text>
      ) : null}
      {sub ? (
        <text x={x + 16} y={y + 44} fontSize={13} fill="var(--muted)">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

export function Arrow({
  prefix,
  x1,
  y1,
  x2,
  y2,
  tone = "muted",
  dashed = false,
  both = false,
}: {
  prefix: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  tone?: ArrowTone;
  dashed?: boolean;
  both?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={COLORS[tone]}
      strokeWidth={1.5}
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd={`url(#${prefix}-arrow-${tone})`}
      markerStart={both ? `url(#${prefix}-arrow-${tone})` : undefined}
    />
  );
}

export function ArrowPath({
  prefix,
  d,
  tone = "muted",
  dashed = false,
}: {
  prefix: string;
  d: string;
  tone?: ArrowTone;
  dashed?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={COLORS[tone]}
      strokeWidth={1.5}
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd={`url(#${prefix}-arrow-${tone})`}
    />
  );
}
