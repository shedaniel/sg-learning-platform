"use client";

import type { WidgetId } from "@/lib/content/types";

const LABELS: Record<WidgetId, string> = {
  "risk-matrix": "リスクマトリックス",
  "backup-planner": "バックアップ計画",
  "access-matrix": "アクセス権マトリックス",
  "hash-demo": "ハッシュ実験",
  "incident-triage": "インシデント・トリアージ",
  "control-matcher": "管理策マッチング",
  "cia-impact": "CIA 影響",
  "subnet-calculator": "サブネット計算",
};

export function WidgetRenderer({ widget }: { widget: WidgetId; props?: Record<string, string | number | boolean> }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface-2 px-4 py-8 text-center">
      <p className="text-sm font-semibold">{LABELS[widget]}</p>
      <p className="mt-1 text-xs text-muted">インタラクティブ部品を読み込み中</p>
    </div>
  );
}
