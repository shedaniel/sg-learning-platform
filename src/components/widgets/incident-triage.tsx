"use client";

import { useId, useState } from "react";
import { Field, Metric, Note, ResetButton, Verdict, WidgetBody } from "./shared";

const SEVERITIES = ["低", "中", "高", "重大"] as const;
type Severity = (typeof SEVERITIES)[number];

interface ActionOption {
  id: string;
  label: string;
}

interface Scenario {
  id: string;
  title: string;
  text: string;
  correctSeverity: Severity;
  correctActionId: string;
  actions: readonly ActionOption[];
  explanation: string;
}

const SCENARIOS: readonly Scenario[] = [
  {
    id: "malware",
    title: "第1問 不審な添付ファイル",
    text: "営業部員のPCで、取引先を装うメールの添付ファイルを開いた直後、EDRが外部の不審なドメインへの通信を検知した。情報漏えいはまだ確認されていない。",
    correctSeverity: "高",
    correctActionId: "a",
    actions: [
      { id: "a", label: "端末をネットワークから切り離し、メモリと関連ログを保全して被害範囲を確認する" },
      { id: "i", label: "端末を初期化して予備機と交換し、同じ利用者にすぐ再配布する" },
      { id: "u", label: "全社のメール送受信を停止し、経営会議の判断を待つ" },
      { id: "e", label: "添付ファイルを削除し、本人へ口頭で注意して終了する" },
    ],
    explanation:
      "感染の疑いがある段階では、封じ込め（隔離）と証拠保全を同時に行う。初期化は調査に必要な証拠を失わせ、全社メール停止は影響が過大である。通信先・実行ファイル・横展開の有無を確認し、漏えいが確認されれば重大へ引き上げる。",
  },
  {
    id: "dormant-account",
    title: "第2問 退職者のアカウント",
    text: "退職した社員のアカウントが3か月間無効化されずに残っていた。アクセスログを確認したところ、退職後のログインは検出されていない。",
    correctSeverity: "中",
    correctActionId: "a",
    actions: [
      { id: "a", label: "アカウントを直ちに無効化し、アクセスログと残存権限を確認する" },
      { id: "i", label: "退職者本人に電話して、退職後にログインしていないか確認する" },
      { id: "u", label: "全システムのパスワードを一斉に変更する" },
      { id: "e", label: "アカウントを削除し、関連するログも一緒に削除する" },
    ],
    explanation:
      "悪用の証拠はないが、認証情報が残っているだけで不正アクセスの入口になる。無効化はログインを止めつつ証拠を保全できる。アカウントの削除は設定やログの追跡を難しくするため、調査前に消さない。退職時の自動失効と定期的な棚卸しが再発防止になる。",
  },
  {
    id: "sql-exposure",
    title: "第3問 顧客情報の露出疑い",
    text: "顧客向けWebサイトでSQLエラーが発生し、外部の研究者から「顧客情報が取得できる状態だ」と連絡があった。実際に第三者へ渡ったかは未確認である。",
    correctSeverity: "重大",
    correctActionId: "a",
    actions: [
      { id: "a", label: "該当機能を停止して証拠を保全し、法務・個人情報保護担当と報告要否を判断する" },
      { id: "i", label: "WAFのブロック件数を確認し、増えていなければ様子を見る" },
      { id: "u", label: "サーバを再起動してエラーログを消し、サービス復旧を優先する" },
      { id: "e", label: "研究者に連絡し、公開しないよう口頭で依頼する" },
    ],
    explanation:
      "個人情報の漏えい疑いでは、被害の確定を待たずに封じ込めと証拠保全を行い、個人情報保護法上の報告・本人通知の要否を組織として判断する。ログの消去や再起動は証拠を損なう。研究者への口頭依頼は記録に残らず、対応の中心にはならない。",
  },
  {
    id: "usb-blocked",
    title: "第4問 私物USBへのコピー",
    text: "従業員が私物のUSBメモリに業務資料をコピーしようとしたところ、DLPが検知してブロックした。外部への持出しは確認されていない。",
    correctSeverity: "低",
    correctActionId: "a",
    actions: [
      { id: "a", label: "事実関係と意図を確認し、規程に基づく注意喚起と再発防止策を実施する" },
      { id: "i", label: "警察に窃盗として届け出る" },
      { id: "u", label: "全社でUSBメモリの使用を恒久的に禁止する" },
      { id: "e", label: "記録を残さず、口頭で注意するだけで終える" },
    ],
    explanation:
      "実害が出ていないため重大度は低いが、意図的な持出しや繰り返しなら懲戒・重大事案に発展する。DLPの検知ログを残し、本人の意図、過去の履歴、扱った情報の種類を確認する。教育と媒体管理の見直しにつなげる。",
  },
];

export function IncidentTriage() {
  const [answers, setAnswers] = useState<Record<string, { severity: string; action: string }>>(() => ({}));
  const [graded, setGraded] = useState(false);
  const groupId = useId();

  const severityScore = SCENARIOS.filter(
    (scenario) => answers[scenario.id]?.severity === scenario.correctSeverity,
  ).length;
  const actionScore = SCENARIOS.filter(
    (scenario) => answers[scenario.id]?.action === scenario.correctActionId,
  ).length;
  const score = severityScore + actionScore;

  return (
    <WidgetBody>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Incident triage</p>
          <h3 className="text-sm font-semibold text-fg">重大度と初動を判断する</h3>
        </div>
        <ResetButton
          onClick={() => {
            setAnswers({});
            setGraded(false);
          }}
        />
      </div>

      <Note>
        重大度は「確定した被害」ではなく、機密性・完全性・可用性への影響と拡大可能性から暫定判断する。調査で新たな事実が判明したら見直す。
      </Note>

      <div className="space-y-2.5">
        {SCENARIOS.map((scenario, scenarioIndex) => {
          const answer = answers[scenario.id] ?? { severity: "", action: "" };
          const severityCorrect = answer.severity === scenario.correctSeverity;
          const actionCorrect = answer.action === scenario.correctActionId;
          const correctAction = scenario.actions.find((action) => action.id === scenario.correctActionId);
          return (
            <fieldset key={scenario.id} className="rounded-lg border border-border bg-surface-2 p-3">
              <legend className="px-1 text-[0.72rem] font-semibold text-fg">{scenario.title}</legend>
              <p className="jp text-[0.78rem] leading-6 text-muted">{scenario.text}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <Field label="重大度" htmlFor={`${groupId}-severity-${scenarioIndex}`}>
                  <select
                    id={`${groupId}-severity-${scenarioIndex}`}
                    className="field text-xs"
                    value={answer.severity}
                    disabled={graded}
                    onChange={(event) => {
                      setAnswers((previous) => ({
                        ...previous,
                        [scenario.id]: { severity: event.target.value, action: answer.action },
                      }));
                    }}
                  >
                    <option value="">選択してください</option>
                    {SEVERITIES.map((severity) => (
                      <option key={severity} value={severity}>
                        {severity}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="最初の対応" htmlFor={`${groupId}-action-${scenarioIndex}`}>
                  <select
                    id={`${groupId}-action-${scenarioIndex}`}
                    className="field text-xs"
                    value={answer.action}
                    disabled={graded}
                    onChange={(event) => {
                      setAnswers((previous) => ({
                        ...previous,
                        [scenario.id]: { severity: answer.severity, action: event.target.value },
                      }));
                    }}
                  >
                    <option value="">選択してください</option>
                    {scenario.actions.map((action) => (
                      <option key={action.id} value={action.id}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {graded ? (
                <div className="mt-2 space-y-1.5">
                  <Verdict ok={severityCorrect}>
                    重大度: {severityCorrect ? "正解" : `不正解（正解は「${scenario.correctSeverity}」）`}
                  </Verdict>
                  <Verdict ok={actionCorrect}>
                    初動: {actionCorrect ? "正解" : `不正解（正解は「${correctAction?.label ?? ""}」）`}
                  </Verdict>
                  <p className="jp text-[0.72rem] leading-6 text-muted">{scenario.explanation}</p>
                </div>
              ) : null}
            </fieldset>
          );
        })}
      </div>

      {graded ? (
        <div className="grid grid-cols-2 gap-2" aria-live="polite">
          <Metric label="合計" value={`${score} / 8 点`} sub="重大度4点 + 初動4点" tone={score >= 6 ? "success" : "warning"} />
          <Metric label="内訳" value={`${severityScore} + ${actionScore}`} sub={`重大度 ${severityScore}/4、初動 ${actionScore}/4`} />
          <div className="col-span-2">
            <Note tone={score >= 6 ? "tip" : "warn"}>
              {score === 8
                ? "全問正解である。判断の根拠まで説明できるか確認する。"
                : score >= 6
                  ? "概ね妥当である。誤答した場面について、なぜその初動が優先されるかを振り返る。"
                  : "重大度と初動の対応関係を再確認する。被害の確定を待たず、封じ込めと証拠保全を優先する場面が多い。"}
            </Note>
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <button type="button" className="btn btn-primary" onClick={() => setGraded(true)}>
          採点する
        </button>
        <span className="text-[0.68rem] text-muted">未回答は不正解として扱われる</span>
      </div>

      <details className="rounded-lg border border-border bg-surface px-3 py-2">
        <summary className="cursor-pointer text-[0.72rem] font-semibold text-fg">重大度の目安</summary>
        <ul className="mt-1.5 space-y-1 text-[0.7rem] leading-5 text-muted">
          <li>
            <strong className="text-fg">重大:</strong> 個人情報の漏えい、重要システムの長期停止など、経営判断・対外報告が必要。
          </li>
          <li>
            <strong className="text-fg">高:</strong> 侵害の疑いが強く、封じ込めと全社調整が必要。
          </li>
          <li>
            <strong className="text-fg">中:</strong> 統制の不備はあるが、悪用の証拠はまだ確認されていない。
          </li>
          <li>
            <strong className="text-fg">低:</strong> 実害がなく、局所的な確認と再発防止で足りる。
          </li>
        </ul>
      </details>
    </WidgetBody>
  );
}
