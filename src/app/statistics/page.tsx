import Link from "next/link";
import { SYLLABUS_TOPICS } from "@/content/syllabus";
import { getLearner } from "@/lib/session";
import { getAreaProgress, getProgressSnapshot, MODE_LABEL } from "@/lib/progress";
import { getAllAttempts, getMockHistory } from "@/lib/db/store";
import { LinkButton, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { formatDate, percent } from "@/lib/utils";

export const dynamic = "force-dynamic";

function Trend({ points }: { points: Array<{ label: string; value: number; count: number }> }) {
  if (points.length === 0) {
    return (
      <div className="grid h-40 place-items-center rounded-lg border border-dashed border-border text-[0.9375rem] text-muted-foreground">
        演習すると正答率の推移が表示されます
      </div>
    );
  }
  const width = 560;
  const height = 160;
  const padding = 24;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;
  const coordinates = points.map((point, index) => ({
    x: padding + index * step,
    y: padding + ((100 - point.value) / 100) * (height - padding * 2),
    ...point,
  }));
  const path = coordinates.map((point) => `${point.x},${point.y}`).join(" ");
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="正答率の推移">
      {[0, 25, 50, 75, 100].map((value) => {
        const y = padding + ((100 - value) / 100) * (height - padding * 2);
        return (
          <g key={value}>
            <line x1={padding} x2={width - padding} y1={y} y2={y} stroke="var(--border)" strokeWidth="0.7" />
            <text x={2} y={y + 3} fontSize="10" fill="var(--muted-foreground)">{value}</text>
          </g>
        );
      })}
      <polyline points={path} fill="none" stroke="var(--info)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {coordinates.map((point, index) => (
        <g key={index}>
          <circle cx={point.x} cy={point.y} r="3.5" fill="var(--card)" stroke="var(--info)" strokeWidth="2" />
          <title>{`${point.label}: ${point.value}% (${point.count}問)`}</title>
        </g>
      ))}
    </svg>
  );
}

export default async function StatisticsPage() {
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const areas = getAreaProgress(snapshot);
  const attempts = getAllAttempts(id);
  const mocks = getMockHistory(id);

  const buckets = [];
  const size = 10;
  for (let index = 0; index < attempts.length; index += size) {
    const chunk = attempts.slice(index, index + size);
    if (chunk.length === 0) continue;
    buckets.push({
      label: `${index + 1}-${index + chunk.length}`,
      value: percent(chunk.filter((attempt) => attempt.correct).length, chunk.length),
      count: chunk.length,
    });
  }
  const trendPoints = buckets.slice(-12);

  const masteryCounts = {
    "not-started": snapshot.topics.filter((topic) => topic.mastery === "not-started").length,
    learning: snapshot.topics.filter((topic) => topic.mastery === "learning").length,
    developing: snapshot.topics.filter((topic) => topic.mastery === "developing").length,
    proficient: snapshot.topics.filter((topic) => topic.mastery === "proficient").length,
    mastered: snapshot.topics.filter((topic) => topic.mastery === "mastered").length,
  };

  const attemptedTopics = snapshot.topics.filter((topic) => topic.attempts > 0);
  const modes = attempts.reduce<Record<string, number>>((accumulator, attempt) => {
    accumulator[attempt.mode] = (accumulator[attempt.mode] ?? 0) + 1;
    return accumulator;
  }, {});

  const CONFIDENCE_LABEL = { high: "高", medium: "中", low: "低" } as const;

  return (
    <div>
      <PageHeader
        title="統計"
        description="正答率だけでなく、分野の広がり、復習の滞留、模擬試験の推移を確認します。準備度は本サイト独自の暫定指標です。"
        actions={
          <LinkButton href="/review" className="h-10 px-4">
            復習キュー（{snapshot.reviewCounts.due}）
          </LinkButton>
        }
      />

      <dl className="grid grid-cols-2 gap-y-5 border-y border-border py-5 lg:grid-cols-4">
        {[
          { label: "解答数", value: snapshot.attemptCount, sub: `${snapshot.uniqueQuestionsAttempted}問 / ${snapshot.questionCount}問` },
          {
            label: "全体正答率",
            value: snapshot.attemptCount > 0 ? `${snapshot.accuracy}%` : "—",
            sub: snapshot.attemptCount > 0 ? `直近 ${snapshot.recentAccuracy}%` : "未演習",
          },
          { label: "演習した分野", value: `${attemptedTopics.length}/${SYLLABUS_TOPICS.length}`, sub: "1問以上の解答" },
          {
            label: "暫定準備度",
            value: `${snapshot.readiness.score}/100`,
            sub: `信頼度 ${CONFIDENCE_LABEL[snapshot.readiness.confidence]}`,
          },
        ].map((item) => (
          <div key={item.label} className="lg:px-5 lg:first:pl-0 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-border">
            <dt className="text-[0.8125rem] text-muted-foreground">{item.label}</dt>
            <dd className="mono mt-0.5 text-2xl font-semibold">{item.value}</dd>
            <dd className="text-[0.8125rem] text-muted-foreground">{item.sub}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section aria-labelledby="trend-heading">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="trend-heading" className="text-lg font-semibold">
              正答率の推移
            </h2>
            <span className="text-[0.8125rem] text-muted-foreground">10問ごと・直近12区間</span>
          </div>
          <div className="mt-3">
            <Trend points={trendPoints} />
          </div>
          <p className="mt-2 text-[0.8125rem] leading-6 text-muted-foreground">
            後半で下がっている場合は、難易度の高い科目Bや未学習分野に進んだ影響もあります。単純な実力低下と決めつけず、分野別も確認してください。
          </p>
        </section>

        <section aria-labelledby="mastery-heading">
          <h2 id="mastery-heading" className="text-lg font-semibold">
            習得の分布
          </h2>
          <p className="mt-1 text-[0.8125rem] leading-6 text-muted-foreground">
            レッスン閲覧ではなく、複数回の解答に基づく判定です。
          </p>
          <ul className="mt-3 space-y-3">
            {[
              ["mastered", "習得", "var(--success)"],
              ["proficient", "準習得", "var(--info)"],
              ["developing", "要強化", "var(--warning)"],
              ["learning", "学習中", "var(--chart-5)"],
              ["not-started", "未着手", "var(--muted-foreground)"],
            ].map(([key, label, tone]) => {
              const value = masteryCounts[key as keyof typeof masteryCounts];
              return (
                <li key={key}>
                  <div className="flex items-baseline justify-between text-[0.9375rem]">
                    <span>{label}</span>
                    <span className="mono text-muted-foreground">{value} トピック</span>
                  </div>
                  <ProgressBar
                    value={(value / Math.max(1, snapshot.topics.length)) * 100}
                    tone={tone}
                    height={5}
                    label={label}
                    className="mt-1.5"
                  />
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="areas-heading">
          <h2 id="areas-heading" className="text-lg font-semibold">
            分野別の正答率
          </h2>
          <ul className="mt-3 space-y-3.5">
            {areas.map((area) => (
              <li key={area.areaId}>
                <div className="flex items-baseline justify-between gap-3 text-[0.9375rem]">
                  <Link href={`/learn/${area.areaId}`} className="truncate hover:text-info-foreground">
                    {area.title}
                  </Link>
                  <span className="mono shrink-0 text-[0.8125rem] text-muted-foreground">
                    {area.attempts ? `${area.accuracy}% · ${area.attempts}回` : "未演習"}
                  </span>
                </div>
                <ProgressBar
                  value={area.accuracy}
                  height={5}
                  label={`${area.title}の正答率`}
                  tone={
                    area.accuracy >= 80
                      ? "var(--success)"
                      : area.accuracy >= 60
                        ? "var(--warning)"
                        : "var(--destructive)"
                  }
                  className="mt-1.5"
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="weak-heading">
          <h2 id="weak-heading" className="text-lg font-semibold">
            トピック別の弱点
          </h2>
          {attemptedTopics.length === 0 ? (
            <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">まだ演習データがありません。</p>
          ) : (
            <ul className="scrollbar-thin mt-1 max-h-[28rem] divide-y divide-border overflow-y-auto pr-1">
              {[...attemptedTopics]
                .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
                .slice(0, 14)
                .map((topic) => (
                  <li key={topic.topic.id}>
                    <Link
                      href={`/practice/${topic.topic.id}`}
                      className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 text-[0.9375rem] transition-colors hover:bg-muted"
                    >
                      <span className="min-w-0 flex-1 truncate">{topic.topic.title}</span>
                      <span className="mono text-[0.8125rem] text-muted-foreground">{topic.attempts}回</span>
                      <span
                        className={`mono w-12 text-right font-semibold ${topic.accuracy < 60 ? "text-destructive-foreground" : topic.accuracy < 80 ? "text-warning-foreground" : "text-success-foreground"}`}
                      >
                        {topic.accuracy}%
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <section aria-labelledby="mock-heading">
          <h2 id="mock-heading" className="text-lg font-semibold">
            模擬試験の推移
          </h2>
          {mocks.length === 0 ? (
            <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">
              まだ模擬試験の記録がありません。
              <Link href="/mock" className="font-medium text-info-foreground hover:underline">
                60問に挑戦する
              </Link>
            </p>
          ) : (
            <ul className="mt-1 divide-y divide-border">
              {mocks.slice(0, 6).map((mock) => (
                <li key={mock.id}>
                  <Link
                    href={`/mock/results/${mock.id}`}
                    className="-mx-2 flex items-center gap-4 rounded-lg px-2 py-2.5 text-[0.9375rem] transition-colors hover:bg-muted"
                  >
                    <span className="text-muted-foreground">{formatDate(mock.startedAt)}</span>
                    <span className="mono font-semibold">{percent(mock.correct, mock.total)}%</span>
                    <span className="ml-auto mono text-[0.8125rem] text-muted-foreground">
                      {mock.correct}/{mock.total}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-labelledby="breakdown-heading">
          <h2 id="breakdown-heading" className="text-lg font-semibold">
            学習の内訳
          </h2>
          <dl className="mt-1 divide-y divide-border text-[0.9375rem]">
            {[
              ["レッスン", `${snapshot.completedLessons}/${snapshot.lessonCount}`],
              ["用語", `${snapshot.learnedTermIds.length}/${snapshot.termCount}`],
              ["復習待ち", `${snapshot.reviewCounts.due}`],
              ["ブックマーク", `${snapshot.bookmarks.length}`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between py-2.5">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="mono font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          {Object.keys(modes).length > 0 ? (
            <p className="mt-3 text-[0.8125rem] leading-6 text-muted-foreground">
              解答の内訳：
              {Object.entries(modes)
                .map(([mode, count]) => `${MODE_LABEL[mode] ?? mode} ${count}回`)
                .join("、")}
            </p>
          ) : null}
        </section>
      </div>

      <p className="mt-14 max-w-3xl text-pretty text-[0.8125rem] leading-6 text-muted-foreground">
        {snapshot.readiness.note}
        準備度は、レッスン完了率25%、直近正答率35%、分野の広がり20%、模擬試験20%の独自加重です。データが少ないほど信頼度は低くなります。
      </p>
    </div>
  );
}
