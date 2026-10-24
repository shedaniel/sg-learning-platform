"use client";

import { Fragment, useId, useState } from "react";
import { clamp, cn } from "@/lib/utils";
import { Field, ResetButton, WidgetBody, numberProp, type WidgetProps } from "./shared";

const PROBABILITY_LABELS = ["まれ", "低い", "中程度", "高い", "非常に高い"] as const;
const IMPACT_LABELS = ["軽微", "小", "中", "大", "重大"] as const;
const LEVELS = [1, 2, 3, 4, 5] as const;

// リスク評価レッスンの例（低1–7 / 中8–14 / 高15–25）に合わせ、
// 高領域を「低減（15–19）」と「回避（20–25）」に分ける。
const ZONES = [
  {
    id: "accept",
    label: "受容",
    min: 1,
    max: 7,
    color: "var(--success-foreground)",
    summary: "リスクを許容し、監視を続ける",
    description:
      "対応コストが低減効果を上回る場合に選ぶ。許容したまま放置せず、責任者・見直し時期・再評価の条件を記録する。",
    points: ["残余リスクを文書化する", "基準を超えたら対応を見直す"],
  },
  {
    id: "transfer",
    label: "移転",
    min: 8,
    max: 14,
    color: "var(--c5)",
    summary: "保険・契約で金銭的損失を移す",
    description:
      "サイバー保険などで損失の金銭的負担を第三者に移す。外部委託は委託先が止まれば自社業務も止まるため、移転ではなく共有・低減として整理する。低減策と組み合わせて残余リスクを下げる。",
    points: ["移転後も事故対応と説明責任は残る", "保険の免責・支払限度を確認する"],
  },
  {
    id: "reduce",
    label: "低減",
    min: 15,
    max: 19,
    color: "var(--warning-foreground)",
    summary: "管理策で確率または影響を下げる",
    description:
      "技術的・組織的な管理策を組み合わせ、発生確率か影響のどちらかを下げる。対策後の残余リスクを再評価し、受容基準と比較する。",
    points: ["予防策と検知策を組み合わせる", "対策の効果を測定する"],
  },
  {
    id: "avoid",
    label: "回避",
    min: 20,
    max: 25,
    color: "var(--destructive-foreground)",
    summary: "活動自体を停止・変更する",
    description:
      "リスクが許容水準を大きく超えるため、その活動を止めるか設計を根本から変える。代替案に新たなリスクがないかも評価する。",
    points: ["活動停止の影響も評価する", "代替案のリスクを比較する"],
  },
] as const;

type Zone = (typeof ZONES)[number];

function zoneFor(score: number): Zone {
  return ZONES.find((zone) => score >= zone.min && score <= zone.max) ?? ZONES[0];
}

export function RiskMatrix({ props }: { props?: WidgetProps }) {
  const initialProbability = clamp(Math.round(numberProp(props, "probability", 3)), 1, 5);
  const initialImpact = clamp(Math.round(numberProp(props, "impact", 3)), 1, 5);
  const [probability, setProbability] = useState(initialProbability);
  const [impact, setImpact] = useState(initialImpact);
  const groupId = useId();

  const score = probability * impact;
  const zone = zoneFor(score);

  return (
    <WidgetBody>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Risk assessment</p>
          <h3 className="text-sm font-semibold text-foreground">発生確率 × 影響度でリスクを評価する</h3>
        </div>
        <ResetButton
          onClick={() => {
            setProbability(initialProbability);
            setImpact(initialImpact);
          }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="発生確率" htmlFor={`${groupId}-probability`} hint={`${probability} / 5`}>
          <input
            id={`${groupId}-probability`}
            type="range"
            min={1}
            max={5}
            step={1}
            value={probability}
            onChange={(event) => setProbability(Number(event.target.value))}
            aria-valuetext={`${probability}（${PROBABILITY_LABELS[probability - 1]}）`}
            className="h-6 w-full"
            style={{ accentColor: "var(--chart-2)" }}
          />
          <p className="text-[0.68rem] text-muted-foreground">{PROBABILITY_LABELS[probability - 1]}</p>
        </Field>
        <Field label="影響度" htmlFor={`${groupId}-impact`} hint={`${impact} / 5`}>
          <input
            id={`${groupId}-impact`}
            type="range"
            min={1}
            max={5}
            step={1}
            value={impact}
            onChange={(event) => setImpact(Number(event.target.value))}
            aria-valuetext={`${impact}（${IMPACT_LABELS[impact - 1]}）`}
            className="h-6 w-full"
            style={{ accentColor: "var(--chart-2)" }}
          />
          <p className="text-[0.68rem] text-muted-foreground">{IMPACT_LABELS[impact - 1]}</p>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <div
            role="group"
            aria-label="5段階の確率と影響度から選ぶリスクマトリックス。セルを押すと両方の値が変わります。"
            className="grid grid-cols-[1.1rem_repeat(5,minmax(0,1fr))] gap-1"
          >
            <span aria-hidden />
            {LEVELS.map((level) => (
              <span key={`p-${level}`} className="text-center text-[0.6rem] font-medium text-muted-foreground">
                {level}
              </span>
            ))}
            {[5, 4, 3, 2, 1].map((impactLevel) => (
              <Fragment key={`row-${impactLevel}`}>
                <span className="flex items-center justify-center text-[0.6rem] font-medium text-muted-foreground">{impactLevel}</span>
                {LEVELS.map((probabilityLevel) => {
                  const cellScore = probabilityLevel * impactLevel;
                  const cellZone = zoneFor(cellScore);
                  const selected = probabilityLevel === probability && impactLevel === impact;
                  return (
                    <button
                      key={`${probabilityLevel}-${impactLevel}`}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`確率${probabilityLevel}、影響度${impactLevel}、スコア${cellScore}、対応${cellZone.label}`}
                      onClick={() => {
                        setProbability(probabilityLevel);
                        setImpact(impactLevel);
                      }}
                      className={cn(
                        "flex aspect-square cursor-pointer items-center justify-center rounded-[6px] border text-[0.68rem] font-semibold transition-colors",
                        selected ? "border-2 border-ring ring-1 ring-accent/40" : "border-transparent hover:border-input",
                      )}
                      style={{
                        background: `color-mix(in srgb, ${cellZone.color} ${selected ? 30 : 14}%, var(--card))`,
                        color: "var(--foreground)",
                      }}
                    >
                      {cellScore}
                    </button>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <p className="mt-2 text-[0.65rem] leading-5 text-muted-foreground">
            横軸: 発生確率（1→5）／縦軸: 影響度（1→5）。セルを押すと両方の値が変わります。
          </p>
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className="eyebrow">リスクスコア</p>
              <p className="mono text-3xl font-semibold leading-none text-foreground" aria-live="polite">
                {score}
                <span className="ml-1 text-sm font-medium text-muted-foreground">/ 25</span>
              </p>
              <p className="mt-1 text-[0.7rem] text-muted-foreground">
                確率 {probability} × 影響度 {impact}
              </p>
            </div>
            <span className="chip" style={{ color: zone.color, borderColor: zone.color }}>
              {zone.label}
            </span>
          </div>

          <div aria-live="polite" className="rounded-lg border border-border bg-muted p-3">
            <p className="text-xs font-semibold text-foreground">
              {zone.summary}（{zone.label}）
            </p>
            <p className="mt-1 text-[0.75rem] leading-6 text-muted-foreground">{zone.description}</p>
            <ul className="mt-1.5 space-y-0.5">
              {zone.points.map((point) => (
                <li key={point} className="flex gap-1.5 text-[0.7rem] leading-5 text-muted-foreground">
                  <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-primary/70" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="スコア帯と推奨対応">
        {ZONES.map((entry) => (
          <span
            key={entry.id}
            className={cn("chip", entry.id === zone.id && "font-bold")}
            style={entry.id === zone.id ? { color: entry.color, borderColor: entry.color } : undefined}
          >
            {entry.label} {entry.min}–{entry.max}
          </span>
        ))}
      </div>

      <p className="text-[0.68rem] leading-5 text-muted-foreground">
        スコア帯は学習用の目安である。実際の対応は、リスク基準・法的義務・対応コストを踏まえて決める。低減と移転を組み合わせることも多い。
      </p>
    </WidgetBody>
  );
}
