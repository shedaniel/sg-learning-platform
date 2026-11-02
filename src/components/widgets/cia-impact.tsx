"use client";

import { useId, useState } from "react";
import { Field, Note, WidgetBody, stringProp, type WidgetProps } from "./shared";

type Level = 0 | 1 | 2 | 3;
type SystemId = "customer" | "accounting" | "hr" | "dev";
type IncidentId = "leak" | "tamper" | "ddos" | "misdelivery" | "ransomware";

interface Impact {
  c: Level;
  i: Level;
  a: Level;
  note: string;
}

interface SystemDef {
  id: SystemId;
  label: string;
  short: string;
}

interface IncidentDef {
  id: IncidentId;
  label: string;
  description: string;
  impacts: Record<SystemId, Impact>;
}

const LEVEL_LABELS = ["なし", "小", "中", "大"] as const;

const SYSTEMS: readonly SystemDef[] = [
  { id: "customer", label: "顧客向けWeb（EC・会員）", short: "顧客Web" },
  { id: "accounting", label: "会計・経理システム", short: "会計" },
  { id: "hr", label: "人事・給与システム", short: "人事" },
  { id: "dev", label: "開発・CI 環境", short: "開発" },
];

const INCIDENTS: readonly IncidentDef[] = [
  {
    id: "leak",
    label: "情報漏えい（顧客DBの露出）",
    description: "顧客DBの設定不備により、外部から氏名・連絡先・購入履歴を取得できる状態だった。",
    impacts: {
      customer: {
        c: 3,
        i: 0,
        a: 0,
        note: "顧客の氏名・連絡先・購入履歴が外部から取得可能になった。Web機能は稼働しており、改ざんや停止は生じていない。",
      },
      accounting: {
        c: 3,
        i: 0,
        a: 0,
        note: "取引先の請求情報や口座情報が漏れると、振込先のすり替えや信用低下に直結する。データの正確性自体は保たれている。",
      },
      hr: {
        c: 3,
        i: 0,
        a: 0,
        note: "従業員の氏名・連絡先・給与情報は機密性が高い。人事情報の漏えいは採用や労務対応にも影響する。",
      },
      dev: {
        c: 2,
        i: 0,
        a: 0,
        note: "ソースコードや設計書の漏えいは知的財産の喪失であり、脆弱性の探索に再利用される二次リスクがある。",
      },
    },
  },
  {
    id: "tamper",
    label: "データ改ざん（Web・DB）",
    description: "入力検証の不備を突かれ、商品説明と注文データの一部が書き換えられた。",
    impacts: {
      customer: {
        c: 0,
        i: 3,
        a: 2,
        note: "商品説明や注文データが書き換えられ、誤った情報の表示や注文処理が発生した。復旧のため一部機能を止める可能性がある。",
      },
      accounting: {
        c: 0,
        i: 3,
        a: 1,
        note: "仕訳や請求金額の改ざんは決算・税務申告の信頼性を損なう。正しい金額の再計算に時間を要する。",
      },
      hr: {
        c: 0,
        i: 3,
        a: 1,
        note: "勤怠や給与計算の基礎データが変わると支給額に影響する。改ざん範囲の特定と再計算が必要になる。",
      },
      dev: {
        c: 0,
        i: 3,
        a: 2,
        note: "ソースコードやビルド成果物の改ざんはサプライチェーン攻撃に発展する。リリースを止めて整合性を確認する必要がある。",
      },
    },
  },
  {
    id: "ddos",
    label: "DDoS（サービス停止）",
    description: "大量の偽リクエストで公開サービスが応答不能になった。",
    impacts: {
      customer: {
        c: 0,
        i: 0,
        a: 3,
        note: "大量の偽リクエストでWebが応答不能になり、購入や問い合わせができない。データの漏えいや改ざんは生じていない。",
      },
      accounting: {
        c: 0,
        i: 0,
        a: 2,
        note: "会計システムが外部公開されている場合、締め処理や請求書発行が遅延する。業務は手作業で一部継続できる。",
      },
      hr: {
        c: 0,
        i: 0,
        a: 2,
        note: "給与振込や勤怠締めの処理が遅延し、従業員への支払に影響する。データ自体は保持されている。",
      },
      dev: {
        c: 0,
        i: 0,
        a: 2,
        note: "CI/CDやパッケージレジストリが停止すると、開発とリリースが止まる。ソースの完全性は保たれる。",
      },
    },
  },
  {
    id: "misdelivery",
    label: "メール誤送信",
    description: "担当者が添付ファイルの宛先を誤り、社外の第三者にメールを送信した。",
    impacts: {
      customer: {
        c: 2,
        i: 0,
        a: 0,
        note: "キャンペーン資料や顧客リストを誤った宛先に送ると、個人情報の漏えいになる。宛先への削除依頼と報告判断が必要である。",
      },
      accounting: {
        c: 3,
        i: 0,
        a: 0,
        note: "請求書や口座情報の誤送信は、振込先のすり替えに悪用され得る。金額や取引内容の正確性は変わらない。",
      },
      hr: {
        c: 3,
        i: 0,
        a: 0,
        note: "給与明細や人事評価の誤送信は機密性の侵害である。本人への説明と再発防止が求められる。",
      },
      dev: {
        c: 2,
        i: 0,
        a: 0,
        note: "設計書やAPIキーの誤送信は不正アクセスの入口になる。漏えた認証情報の無効化・再発行が必要である。",
      },
    },
  },
  {
    id: "ransomware",
    label: "ランサムウェア（暗号化）",
    description: "端末経由でランサムウェアに感染し、共有ファイルが暗号化された。",
    impacts: {
      customer: {
        c: 2,
        i: 2,
        a: 3,
        note: "Webサーバ上のファイルが暗号化されてサービスが停止する。窃取データの公開を脅迫された場合は機密性も損なわれる。",
      },
      accounting: {
        c: 2,
        i: 3,
        a: 3,
        note: "帳簿や請求データが暗号化され、復旧まで決算・入金確認が止まる。バックアップの完全性も確認が必要である。",
      },
      hr: {
        c: 2,
        i: 3,
        a: 3,
        note: "給与データが暗号化され、支払いや社会保険手続に支障が出る。復旧後にデータの正確性を検証する必要がある。",
      },
      dev: {
        c: 2,
        i: 3,
        a: 3,
        note: "ソースコードとビルド環境が暗号化され、復旧まで開発・リリースが停止する。バックアップからの復元と改ざん確認が必要である。",
      },
    },
  },
];

const TRAITS = [
  { key: "c", label: "機密性", short: "C", color: "var(--c1)", hint: "許可された人だけが見られる" },
  { key: "i", label: "完全性", short: "I", color: "var(--c2)", hint: "正確で改ざんされていない" },
  { key: "a", label: "可用性", short: "A", color: "var(--c3)", hint: "必要なときに使える" },
] as const;

function ImpactBar({
  label,
  short,
  hint,
  color,
  level,
}: {
  label: string;
  short: string;
  hint: string;
  color: string;
  level: Level;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
        <span className="text-[0.8125rem] font-semibold text-foreground">
          <span className="mono mr-1 text-muted-foreground">{short}</span>
          {label}
          <span className="ml-1 text-xs font-normal text-muted-foreground">{hint}</span>
        </span>
        <span className="mono text-[0.8125rem] text-muted-foreground">
          {LEVEL_LABELS[level]}（{level}/3）
        </span>
      </div>
      <div
        className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={`${label}への影響`}
        aria-valuemin={0}
        aria-valuemax={3}
        aria-valuenow={level}
        aria-valuetext={`${LEVEL_LABELS[level]}（${level}/3）`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${(level / 3) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function CiaImpact({ props }: { props?: WidgetProps }) {
  const [incidentId, setIncidentId] = useState<IncidentId>(() => {
    const candidate = stringProp(props, "incident", "leak");
    return (INCIDENTS.find((entry) => entry.id === candidate)?.id ?? "leak") as IncidentId;
  });
  const [systemId, setSystemId] = useState<SystemId>(() => {
    const candidate = stringProp(props, "system", "customer");
    return (SYSTEMS.find((entry) => entry.id === candidate)?.id ?? "customer") as SystemId;
  });
  const groupId = useId();

  const incident = INCIDENTS.find((entry) => entry.id === incidentId) ?? INCIDENTS[0];
  const system = SYSTEMS.find((entry) => entry.id === systemId) ?? SYSTEMS[0];
  const impact = incident.impacts[system.id];

  const values = [impact.c, impact.i, impact.a];
  const maxLevel = Math.max(...values);
  const leaders = TRAITS.filter((trait) => impact[trait.key] === maxLevel).map((trait) => trait.label);

  return (
    <WidgetBody>
      <div>
        <h3 className="text-sm font-semibold text-foreground">同じ事故でも、システムで影響は変わる</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="発生したインシデント" htmlFor={`${groupId}-incident`}>
          <select
            id={`${groupId}-incident`}
            className="field text-xs"
            value={incident.id}
            onChange={(event) => setIncidentId(event.target.value as IncidentId)}
          >
            {INCIDENTS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="影響を受けるシステム" htmlFor={`${groupId}-system`}>
          <select
            id={`${groupId}-system`}
            className="field text-xs"
            value={system.id}
            onChange={(event) => setSystemId(event.target.value as SystemId)}
          >
            {SYSTEMS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <p className="text-[0.8125rem] leading-5 text-muted-foreground">{incident.description}</p>

      <div className="rounded-lg border border-border bg-muted p-3">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-1">
          <p className="text-xs font-semibold text-foreground">{system.label}</p>
          <span className="chip">{incident.label}</span>
        </div>

        <div className="space-y-2.5">
          {TRAITS.map((trait) => (
            <ImpactBar
              key={trait.key}
              label={trait.label}
              short={trait.short}
              hint={trait.hint}
              color={trait.color}
              level={impact[trait.key]}
            />
          ))}
        </div>

        <p
          className="mt-3 rounded-md bg-card px-2.5 py-2 text-[0.8125rem] leading-6 text-foreground"
          aria-live="polite"
        >
          <span className="font-semibold">
            {maxLevel === 0 ? "CIA への影響は想定されない。" : `最も影響が大きいのは${leaders.join("・")}（${LEVEL_LABELS[maxLevel]}）。`}
          </span>
          {impact.note}
        </p>
      </div>

      <Note>
        数値は学習用の整理であり、実際の影響は情報資産の分類・規模・代替手段・法的義務で変わる。同じ「漏えい」でも、顧客データを扱うWebと開発環境では重みが異なる。
      </Note>
    </WidgetBody>
  );
}
