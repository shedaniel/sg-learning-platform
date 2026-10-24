import Link from "next/link";
import { Activity, BarChart3, BookOpen, Brain, Target, TrendingUp } from "lucide-react";
import { SYLLABUS_TOPICS } from "@/content/syllabus";
import { getLearner } from "@/lib/session";
import { getAreaProgress, getProgressSnapshot, MASTERY_LABEL } from "@/lib/progress";
import { getAllAttempts, getMockHistory } from "@/lib/db/store";
import { PageHeader, Badge, ProgressBar, Stat } from "@/components/ui/primitives";
import { formatDate, percent } from "@/lib/utils";

export const dynamic = "force-dynamic";

function Trend({ points }: { points: Array<{ label: string; value: number; count: number }> }) {
  if (points.length === 0) {
    return (
      <div className="grid h-40 place-items-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
        演習すると正答率の推移が表示されます
      </div>
    );
  }
  const width = 560;
  const height = 160;
  const padding = 18;
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
            <text x={2} y={y + 3} fontSize="8" fill="var(--muted-foreground)">{value}</text>
          </g>
        );
      })}
      <polyline points={path} fill="none" stroke="var(--chart-2)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {coordinates.map((point, index) => (
        <g key={index}>
          <circle cx={point.x} cy={point.y} r="3.5" fill="var(--card)" stroke="var(--chart-2)" strokeWidth="2" />
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

  return (
    <div className="">
      <PageHeader
        eyebrow="Statistics"
        title="数字で、学習を点検する。"
        description="正答率だけでなく、分野の広がり、復習の滞留、模擬試験の推移を見ます。準備度は本サイト独自の暫定指標です。"
        actions={<Link href="/review" className="btn">復習キュー（{snapshot.reviewCounts.due}）</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="解答数" value={snapshot.attemptCount} sub={`${snapshot.uniqueQuestionsAttempted}問 / ${snapshot.questionCount}問`} />
        <Stat label="全体正答率" value={`${snapshot.accuracy}%`} sub={`直近 ${snapshot.recentAccuracy}%`} />
        <Stat label="演習した分野" value={`${attemptedTopics.length}/${SYLLABUS_TOPICS.length}`} sub="1問以上の解答" />
        <Stat label="暫定準備度" value={`${snapshot.readiness.score}/100`} sub={`信頼度 ${snapshot.readiness.confidence}`} />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-info-foreground" />
              <h2 className="text-sm font-semibold">正答率の推移</h2>
            </div>
            <span className="text-[0.65rem] text-muted-foreground">10問ごと・直近12区間</span>
          </div>
          <div className="mt-3">
            <Trend points={trendPoints} />
          </div>
          <p className="mt-2 text-[0.65rem] leading-5 text-muted-foreground">
            後半で下がっている場合は、難易度の高い科目Bや未学習分野に進んだ影響もあります。単純な実力低下と決めつけず、分野別も確認してください。
          </p>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-info-foreground" />
            <h2 className="text-sm font-semibold">習得の分布</h2>
          </div>
          <p className="mt-1 text-[0.65rem] text-muted-foreground">レッスン閲覧ではなく、複数回の解答に基づく判定です。</p>
          <div className="mt-3 space-y-2.5">
            {[
              ["mastered", "習得", "var(--success-foreground)"],
              ["proficient", "準習得", "var(--chart-2)"],
              ["developing", "要強化", "var(--warning-foreground)"],
              ["learning", "学習中", "var(--c5)"],
              ["not-started", "未着手", "var(--input)"],
            ].map(([key, label, tone]) => {
              const value = masteryCounts[key as keyof typeof masteryCounts];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-[0.7rem]">
                    <span>{label}</span>
                    <span className="mono text-muted-foreground">{value} topics</span>
                  </div>
                  <ProgressBar
                    value={(value / Math.max(1, snapshot.topics.length)) * 100}
                    tone={tone}
                    height={4}
                    className="mt-1"
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-info-foreground" />
            <h2 className="text-sm font-semibold">エリア別</h2>
          </div>
          <div className="mt-3 space-y-3">
            {areas.map((area) => (
              <div key={area.areaId}>
                <div className="flex items-center justify-between text-[0.7rem]">
                  <Link href={`/learn/${area.areaId}`} className="truncate hover:text-info-foreground">{area.title}</Link>
                  <span className="mono shrink-0 text-muted-foreground">
                    {area.attempts ? `${area.accuracy}% · ${area.attempts}回` : "未演習"}
                  </span>
                </div>
                <ProgressBar
                  value={area.accuracy}
                  height={4}
                  tone={area.accuracy >= 80 ? "var(--success-foreground)" : area.accuracy >= 60 ? "var(--warning-foreground)" : "var(--destructive-foreground)"}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-info-foreground" />
            <h2 className="text-sm font-semibold">トピック別の弱点</h2>
          </div>
          {attemptedTopics.length === 0 ? (
            <p className="mt-4 text-xs leading-5 text-muted-foreground">まだ演習データがありません。</p>
          ) : (
            <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
              {[...attemptedTopics]
                .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
                .slice(0, 14)
                .map((topic) => (
                  <Link
                    key={topic.topic.id}
                    href={`/practice/${topic.topic.id}`}
                    className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-2 text-[0.7rem] hover:border-ring/50"
                  >
                    <span className="min-w-0 flex-1 truncate">{topic.topic.title}</span>
                    <span className="mono text-muted-foreground">{topic.attempts}回</span>
                    <span className={`mono w-10 text-right font-semibold ${topic.accuracy < 60 ? "text-destructive-foreground" : topic.accuracy < 80 ? "text-warning-foreground" : "text-success-foreground"}`}>
                      {topic.accuracy}%
                    </span>
                  </Link>
                ))}
            </div>
          )}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-info-foreground" />
            <h2 className="text-sm font-semibold">模擬試験の推移</h2>
          </div>
          {mocks.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">まだ模擬試験の記録がありません。<Link href="/mock" className="text-info-foreground">60問に挑戦</Link></p>
          ) : (
            <div className="mt-3 space-y-2">
              {mocks.slice(0, 6).map((mock) => (
                <Link key={mock.id} href={`/mock/results/${mock.id}`} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-xs hover:border-ring/50">
                  <span className="mono text-muted-foreground">{formatDate(mock.startedAt)}</span>
                  <span className="mono font-semibold">{percent(mock.correct, mock.total)}%</span>
                  <span className="ml-auto text-[0.65rem] text-muted-foreground">{mock.correct}/{mock.total}</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-info-foreground" />
            <h2 className="text-sm font-semibold">学習の内訳</h2>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border bg-muted p-3">
              <p className="text-[0.65rem] text-muted-foreground">レッスン</p>
              <p className="mono mt-1 text-lg font-semibold">{snapshot.completedLessons}/{snapshot.lessonCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-3">
              <p className="text-[0.65rem] text-muted-foreground">用語</p>
              <p className="mono mt-1 text-lg font-semibold">{snapshot.learnedTermIds.length}/{snapshot.termCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-3">
              <p className="text-[0.65rem] text-muted-foreground">復習待ち</p>
              <p className="mono mt-1 text-lg font-semibold">{snapshot.reviewCounts.due}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-3">
              <p className="text-[0.65rem] text-muted-foreground">ブックマーク</p>
              <p className="mono mt-1 text-lg font-semibold">{snapshot.bookmarks.length}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {Object.entries(modes).map(([mode, count]) => (
              <Badge key={mode}>{mode}: {count}</Badge>
            ))}
          </div>
        </section>
      </div>

      <p className="mt-6 rounded-xl border border-border bg-muted p-4 text-[0.68rem] leading-6 text-muted-foreground">
        {snapshot.readiness.note} 準備度は、レッスン完了率25%、直近正答率35%、分野の広がり20%、模擬試験20%の独自加重です。データが少ないほど信頼度は低くなります。
      </p>
    </div>
  );
}
