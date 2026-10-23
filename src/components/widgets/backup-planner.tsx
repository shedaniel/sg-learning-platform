"use client";

import { useId, useState } from "react";
import { Check } from "lucide-react";
import { clamp, formatDuration } from "@/lib/utils";
import { Field, Metric, Note, ResetButton, WidgetBody, numberProp, stringProp, type WidgetProps } from "./shared";

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;
const DAY_ORDER = [0, 1, 2, 3, 4, 5, 6] as const;

const CHECKLIST = [
  "コピーを3つ持つ（本番 + バックアップ2つ）",
  "2種類以上の媒体・保存先を使う",
  "1つは事業所外（オフサイト）に保管する",
  "1つはオフラインまたはイミュータブルにする",
  "リストア手順を定期的に訓練し、記録する",
] as const;

const WEEK_MINUTES = 7 * 24 * 60;

function buildWeekSchedule(fullDay: number, startMinute: number, intervalHours: number) {
  const counts = Array.from({ length: 7 }, () => 0);
  const interval = intervalHours * 60;
  let total = 0;
  for (let offset = interval; offset < WEEK_MINUTES; offset += interval) {
    const minute = (startMinute + offset) % WEEK_MINUTES;
    counts[Math.floor(minute / 1440)] += 1;
    total += 1;
  }
  return { counts, total };
}

function parseInteger(raw: string, min: number, max: number): number | null {
  if (!/^\d+$/.test(raw.trim())) return null;
  const value = Number(raw);
  return Number.isInteger(value) && value >= min && value <= max ? value : null;
}

function parseDecimal(raw: string, min: number, max: number): number | null {
  if (!/^\d+(\.\d+)?$/.test(raw.trim())) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function BackupPlanner({ props }: { props?: WidgetProps }) {
  const initialDay = clamp(Math.round(numberProp(props, "day", 0)), 0, 6);
  const initialTimeCandidate = stringProp(props, "time", "02:00");
  const initialTime = isValidTime(initialTimeCandidate) ? initialTimeCandidate : "02:00";
  const initialInterval = String(clamp(Math.round(numberProp(props, "interval", 4)), 1, 24));
  const initialRetention = String(clamp(Math.round(numberProp(props, "retention", 30)), 1, 365));
  const initialRate = String(clamp(numberProp(props, "rate", 100), 1, 100000));
  const initialSize = String(clamp(numberProp(props, "size", 500), 0.1, 1000000));

  const [fullDay, setFullDay] = useState(initialDay);
  const [fullTime, setFullTime] = useState(initialTime);
  const [intervalInput, setIntervalInput] = useState(initialInterval);
  const [retentionInput, setRetentionInput] = useState(initialRetention);
  const [rateInput, setRateInput] = useState(initialRate);
  const [sizeInput, setSizeInput] = useState(initialSize);
  const [checklist, setChecklist] = useState<boolean[]>(() => CHECKLIST.map(() => false));
  const groupId = useId();

  const interval = parseInteger(intervalInput, 1, 24);
  const retention = parseInteger(retentionInput, 1, 365);
  const rate = parseDecimal(rateInput, 1, 100000);
  const size = parseDecimal(sizeInput, 0.1, 1000000);
  const timeValid = isValidTime(fullTime);

  const intervalError = interval === null ? "1〜24 の整数で入力してください" : null;
  const retentionError = retention === null ? "1〜365 の整数で入力してください" : null;
  const rateError = rate === null ? "1〜100,000 MB/s の数値で入力してください" : null;
  const sizeError = size === null ? "0.1〜1,000,000 GB の数値で入力してください" : null;
  const timeError = timeValid ? null : "時刻を入力してください";

  const computed =
    interval !== null && retention !== null && rate !== null && size !== null && timeValid
      ? (() => {
          const hour = Number(fullTime.slice(0, 2));
          const minute = Number(fullTime.slice(3, 5));
          return {
            interval,
            retention,
            rate,
            size,
            schedule: buildWeekSchedule(fullDay, fullDay * 1440 + hour * 60 + minute, interval),
            restoreSeconds: (size * 1024) / rate,
            fullGenerations: Math.floor(retention / 7),
          };
        })()
      : null;

  const checkedCount = checklist.filter(Boolean).length;

  return (
    <WidgetBody>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="eyebrow">Backup planning</p>
          <h3 className="text-sm font-semibold text-fg">バックアップ計画から RPO と復旧時間を試算する</h3>
        </div>
        <ResetButton
          onClick={() => {
            setFullDay(initialDay);
            setFullTime(initialTime);
            setIntervalInput(initialInterval);
            setRetentionInput(initialRetention);
            setRateInput(initialRate);
            setSizeInput(initialSize);
            setChecklist(CHECKLIST.map(() => false));
          }}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="フルバックアップの曜日" htmlFor={`${groupId}-day`}>
          <select
            id={`${groupId}-day`}
            className="field"
            value={fullDay}
            onChange={(event) => setFullDay(Number(event.target.value))}
          >
            {DAY_ORDER.map((day) => (
              <option key={day} value={day}>
                {DAY_LABELS[day]}曜日
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="フルバックアップの開始時刻"
          htmlFor={`${groupId}-time`}
          error={timeError}
        >
          <input
            id={`${groupId}-time`}
            type="time"
            className="field"
            value={fullTime}
            onChange={(event) => setFullTime(event.target.value)}
            aria-invalid={!timeValid}
            aria-describedby={timeError ? `${groupId}-time-error` : undefined}
          />
        </Field>
        <Field
          label="増分バックアップの間隔"
          htmlFor={`${groupId}-interval`}
          hint="時間"
          error={intervalError}
        >
          <input
            id={`${groupId}-interval`}
            type="number"
            inputMode="numeric"
            min={1}
            max={24}
            step={1}
            className="field"
            value={intervalInput}
            onChange={(event) => setIntervalInput(event.target.value)}
            aria-invalid={interval !== null ? undefined : true}
            aria-describedby={intervalError ? `${groupId}-interval-error` : undefined}
          />
        </Field>
        <Field
          label="保持期間"
          htmlFor={`${groupId}-retention`}
          hint="日"
          error={retentionError}
        >
          <input
            id={`${groupId}-retention`}
            type="number"
            inputMode="numeric"
            min={1}
            max={365}
            step={1}
            className="field"
            value={retentionInput}
            onChange={(event) => setRetentionInput(event.target.value)}
            aria-invalid={retention !== null ? undefined : true}
            aria-describedby={retentionError ? `${groupId}-retention-error` : undefined}
          />
        </Field>
        <Field
          label="リストア速度"
          htmlFor={`${groupId}-rate`}
          hint="MB/s"
          error={rateError}
        >
          <input
            id={`${groupId}-rate`}
            type="number"
            inputMode="decimal"
            min={1}
            max={100000}
            step={1}
            className="field"
            value={rateInput}
            onChange={(event) => setRateInput(event.target.value)}
            aria-invalid={rate !== null ? undefined : true}
            aria-describedby={rateError ? `${groupId}-rate-error` : undefined}
          />
        </Field>
        <Field
          label="復元するデータ量"
          htmlFor={`${groupId}-size`}
          hint="GB"
          error={sizeError}
        >
          <input
            id={`${groupId}-size`}
            type="number"
            inputMode="decimal"
            min={0.1}
            max={1000000}
            step={0.1}
            className="field"
            value={sizeInput}
            onChange={(event) => setSizeInput(event.target.value)}
            aria-invalid={size !== null ? undefined : true}
            aria-describedby={sizeError ? `${groupId}-size-error` : undefined}
          />
        </Field>
      </div>

      <p className="sr-only" role="status">
        {computed
          ? `RPO は ${computed.interval} 時間、リストア時間は ${formatDuration(computed.restoreSeconds)} です。`
          : "入力値を確認してください。"}
      </p>

      {computed ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Metric
              label="RPO（最大データ損失）"
              value={`${computed.interval} 時間`}
              sub={`復旧できるのは最大 ${computed.interval * 60} 分前の時点（時間幅で表示）`}
              tone="accent"
            />
            <Metric
              label="リストア時間（転送のみ）"
              value={formatDuration(computed.restoreSeconds)}
              sub={`${computed.size} GB ÷ ${computed.rate} MB/s（1 GB = 1,024 MB）`}
              tone="warning"
            />
            <Metric
              label="増分の回数"
              value={`${computed.schedule.total} 回 / 週`}
              sub={`${computed.interval} 時間ごと。フルは週1回`}
            />
            <Metric
              label="フルバックアップの世代数"
              value={`${computed.fullGenerations} 世代`}
              sub={`保持 ${computed.retention} 日 ÷ 7 日の目安`}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-fg">週間タイムライン</p>
              <span className="chip">
                フル: 毎週{DAY_LABELS[fullDay]}曜 {fullTime}
              </span>
            </div>
            <ol className="grid grid-cols-7 gap-1" aria-label="1週間のバックアップ予定">
              {DAY_ORDER.map((day) => {
                const isFull = day === fullDay;
                const increments = computed.schedule.counts[day] ?? 0;
                return (
                  <li
                    key={day}
                    aria-label={`${DAY_LABELS[day]}曜日: ${isFull ? `フルバックアップ ${fullTime}、` : ""}増分 ${increments} 回`}
                    className={
                      isFull
                        ? "rounded-md border border-accent bg-accent-soft/60 px-1 py-1.5 text-center"
                        : "rounded-md border border-border bg-surface-2 px-1 py-1.5 text-center"
                    }
                  >
                    <span className="block text-[0.65rem] font-medium text-muted">{DAY_LABELS[day]}</span>
                    <span className="mono mt-0.5 block text-[0.7rem] font-semibold text-fg">
                      {isFull ? "F" : "—"}
                    </span>
                    <span className="mono block text-[0.6rem] leading-4 text-muted">
                      {increments > 0 ? `I×${increments}` : "I×0"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-1.5 text-[0.65rem] leading-5 text-muted">
              F = フルバックアップ、I = 増分バックアップ。曜日は日曜始まり。増分は直前のフルを基準に数えている。
            </p>
          </div>

          {computed.retention < 8 ? (
            <Note tone="warn">
              保持期間が7日以下の場合、週1回のフルバックアップより古い増分が復元できなくなる可能性がある。フルと増分の依存関係を確認し、保持期間を延ばすかフル間隔を短くする。
            </Note>
          ) : null}

          <Note>
            <strong className="font-semibold">RPO は増分の間隔で決まる。</strong>{" "}
            RPO は本来「復旧すべき時点」を指し、ここでは現在からその時点までの最大時間幅として表示している。フルバックアップを毎日取得しても、増分が 24 時間間隔なら最大 24 時間分の更新が失われ得る。増分が失敗した場合はさらに前の成功時点まで戻るため、失敗の監視と再実行が必要である。リストア時間は転送のみの試算であり、実際の RTO には増分の適用、整合性の検証、業務の切戻し時間が加わる。
          </Note>
        </div>
      ) : (
        <Note tone="warn">入力値を確認すると、RPO・復旧時間・タイムラインが表示される。</Note>
      )}

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-fg">3-2-1 チェックリスト</p>
          <span className="mono text-[0.7rem] text-muted">{checkedCount} / {CHECKLIST.length}</span>
        </div>
        <div
          className="mb-2 h-1.5 overflow-hidden rounded-full bg-bg-soft"
          role="progressbar"
          aria-label="3-2-1 チェックリストの達成状況"
          aria-valuemin={0}
          aria-valuemax={CHECKLIST.length}
          aria-valuenow={checkedCount}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${(checkedCount / CHECKLIST.length) * 100}%` }}
          />
        </div>
        <ul className="space-y-1.5">
          {CHECKLIST.map((item, index) => (
            <li key={item}>
              <label className="flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 text-[0.76rem] leading-5 text-fg hover:bg-surface-2">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0"
                  style={{ accentColor: "var(--accent)" }}
                  checked={checklist[index] ?? false}
                  onChange={(event) => {
                    const next = [...checklist];
                    next[index] = event.target.checked;
                    setChecklist(next);
                  }}
                />
                <span>{item}</span>
                {checklist[index] ? <Check aria-hidden className="ml-auto mt-0.5 size-3.5 shrink-0 text-success" /> : null}
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-1.5 text-[0.65rem] leading-5 text-muted">
          3-2-1 は最低線であり、暗号化・イミュータブル保存・復元訓練まで含めて初めて実効性が上がる。
        </p>
      </div>
    </WidgetBody>
  );
}
