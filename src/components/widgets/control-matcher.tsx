"use client";

import { useId, useState } from "react";
import { Field, Metric, Note, ResetButton, Verdict, WidgetBody } from "./shared";

const CONTROLS = [
  {
    id: "backup",
    label: "オフライン／イミュータブルなバックアップ + 復元訓練",
    rationale:
      "オフラインまたはイミュータブルなコピーは暗号化の影響を受けず、復旧の最後の手段になる。復元訓練で実際に戻せることと所要時間（RTO）を確認する。",
  },
  {
    id: "query",
    label: "パラメータ化クエリ + 入力値検証",
    rationale:
      "SQL文と入力を分離し、入力がSQL構文として解釈されないようにする。WAFやエスケープは補助であり、根本対策はパラメータ化クエリである。",
  },
  {
    id: "encryption",
    label: "全ディスク暗号化 + 遠隔消去",
    rationale:
      "紛失・盗難時の主なリスクは媒体の読み取りである。全ディスク暗号化でデータを保護し、遠隔消去は端末がオンラインになった場合の補助として使う。",
  },
  {
    id: "authenticate",
    label: "多要素認証 + 不審メールの訓練・フィルタ",
    rationale:
      "認証情報が盗まれても、パスワード単独ではログインできない。メールフィルタと訓練でクリック率を下げる。ただし中間者（AiTM）型フィッシングではMFAも突破され得るため、FIDO2などの耐フィッシング認証を併用する。",
  },
  {
    id: "separation",
    label: "職務分離 + 最小権限 + 操作ログの監査",
    rationale:
      "単独では完結できない権限設計にし、操作ログで検知可能性を高める。最小権限は不正の機会だけでなく、実行された場合の被害範囲も狭める。",
  },
] as const;

const THREATS = [
  {
    id: "phishing",
    label: "フィッシング",
    detail: "偽のログイン画面にID・パスワードを入力させる。",
    correctControlId: "authenticate",
  },
  {
    id: "ransomware",
    label: "ランサムウェア",
    detail: "共有ファイルを暗号化し、復旧と引き換えに金銭を要求する。",
    correctControlId: "backup",
  },
  {
    id: "sqli",
    label: "SQLインジェクション",
    detail: "入力欄からDBのデータを不正に取得・改ざんする。",
    correctControlId: "query",
  },
  {
    id: "insider",
    label: "内部不正",
    detail: "権限を持つ担当者が顧客情報を外部へ持ち出す。",
    correctControlId: "separation",
  },
  {
    id: "lost-device",
    label: "ノートPCの紛失",
    detail: "電車内に置き忘れ、端末が第三者に渡る。",
    correctControlId: "encryption",
  },
] as const;

export function ControlMatcher() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [graded, setGraded] = useState(false);
  const groupId = useId();

  const score = THREATS.filter((threat) => answers[threat.id] === threat.correctControlId).length;
  const allAnswered = THREATS.every((threat) => Boolean(answers[threat.id]));

  return (
    <WidgetBody>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Control matching</p>
          <h3 className="text-sm font-semibold text-fg">脅威に効く管理策を選ぶ</h3>
        </div>
        <ResetButton
          onClick={() => {
            setAnswers({});
            setGraded(false);
          }}
        />
      </div>

      <p className="text-[0.76rem] leading-6 text-muted">
        5つの脅威それぞれに、最も直接的に効く管理策を1つ選ぶ。同じ管理策を複数の脅威に割り当ててもよい。
      </p>

      <div className="space-y-2.5">
        {THREATS.map((threat, index) => {
          const selected = answers[threat.id] ?? "";
          const correct = selected === threat.correctControlId;
          const control = CONTROLS.find((entry) => entry.id === threat.correctControlId);
          return (
            <div key={threat.id} className="rounded-lg border border-border bg-surface-2 p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
                <p className="text-[0.76rem] font-semibold text-fg">
                  {index + 1}. {threat.label}
                </p>
                <span className="text-[0.62rem] font-medium text-muted">脅威</span>
              </div>
              <p className="mt-0.5 text-[0.7rem] leading-5 text-muted">{threat.detail}</p>
              <div className="mt-2">
                <Field label={`${threat.label}への対策`} htmlFor={`${groupId}-${threat.id}`}>
                  <select
                    id={`${groupId}-${threat.id}`}
                    className="field text-xs"
                    value={selected}
                    disabled={graded}
                    onChange={(event) => {
                      const value = event.target.value;
                      setAnswers((previous) => ({ ...previous, [threat.id]: value }));
                    }}
                  >
                    <option value="">管理策を選択</option>
                    {CONTROLS.map((entry) => (
                      <option key={entry.id} value={entry.id}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {graded ? (
                <div className="mt-2 space-y-1.5">
                  <Verdict ok={correct}>
                    {correct ? "正解" : `不正解（正解は「${control?.label ?? ""}」）`}
                  </Verdict>
                  <p className="jp text-[0.72rem] leading-6 text-muted">{control?.rationale}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn btn-primary" onClick={() => setGraded(true)} disabled={graded}>
          {graded ? "採点済み" : "答え合わせ"}
        </button>
        {!allAnswered ? (
          <span className="text-[0.68rem] text-muted">未選択の脅威は不正解として採点される</span>
        ) : null}
      </div>

      <p className="sr-only" role="status">
        {graded ? `採点結果は5問中${score}問正解です。` : ""}
      </p>

      {graded ? (
        <div>
          <Metric
            label="スコア"
            value={`${score} / 5 問`}
            sub={score === 5 ? "全問正解" : `${5 - score} 問を復習する`}
            tone={score === 5 ? "success" : "accent"}
          />
        </div>
      ) : null}

      <Note>
        管理策は1つで完全にはならない。フィッシング対策はMFAだけでなく訓練・メールフィルタ・認証の強化を重ね、ランサムウェア対策はバックアップと検知・侵害前提の設計を組み合わせる。
      </Note>
    </WidgetBody>
  );
}
