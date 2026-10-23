import Link from "next/link";
import { ArrowRight, Brain, FileText, Layers, ListChecks, Target, Timer } from "lucide-react";
import { AREAS, questionsForTopic, topicsForArea } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { PageHeader, Badge, LinkButton, ProgressBar } from "@/components/ui/primitives";
import { PracticeSetup } from "@/components/practice/PracticeSetup";
import { SYLLABUS_TOPICS } from "@/content/syllabus";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const topicOptions = SYLLABUS_TOPICS.map((topic) => {
    const area = AREAS.find((item) => item.id === topic.areaId);
    return {
      id: topic.id,
      title: topic.title,
      areaTitle: area?.shortTitle ?? topic.areaId,
      questionCount: questionsForTopic(topic.id).length,
    };
  }).filter((topic) => topic.questionCount > 0);

  const totalQuestions = snapshot.questionCount;
  const attemptedTopicIds = new Set(snapshot.topics.filter((topic) => topic.attempts > 0).map((topic) => topic.topic.id));

  return (
    <div className="animate-in">
      <PageHeader
        eyebrow="Practice"
        title="知識を、使える形へ。"
        description="レッスン単位の確認から、分野横断のカスタム演習、科目Bの事例問題まで。誤答は理由まで読み、間隔を空けて解き直します。"
        actions={
          <LinkButton href="/mock" variant="primary">
            <Timer className="size-4" />
            60問 模擬試験
          </LinkButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "問題バンク",
            value: `${totalQuestions}問`,
            sub: `科目A/B · 公式${snapshot.quizHistory.length ? "" : "問題も収録"}`,
            icon: ListChecks,
            href: "/practice/run?count=10",
          },
          {
            label: "演習済み",
            value: `${snapshot.uniqueQuestionsAttempted}`,
            sub: `全体の${Math.round((snapshot.uniqueQuestionsAttempted / Math.max(1, totalQuestions)) * 100)}%`,
            icon: Layers,
            href: "/statistics",
          },
          {
            label: "直近正答率",
            value: `${snapshot.recentAccuracy}%`,
            sub: `${snapshot.attemptCount}回の解答`,
            icon: Target,
            href: "/statistics",
          },
          {
            label: "復習待ち",
            value: `${snapshot.reviewCounts.due}`,
            sub: `誤答・期限到来 ${snapshot.reviewCounts.total}件`,
            icon: Brain,
            href: "/review",
          },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="card group p-4 transition-colors hover:border-accent/50">
            <div className="flex items-center justify-between">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">{item.label}</p>
              <item.icon className="size-4 text-accent" />
            </div>
            <p className="mono mt-2 text-2xl font-semibold">{item.value}</p>
            <p className="mt-0.5 text-[0.68rem] text-muted">{item.sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="eyebrow">Topics</p>
              <h2 className="display mt-1 text-2xl font-semibold">分野別に解く</h2>
            </div>
          </div>
          <div className="space-y-5">
            {AREAS.map((area) => {
              const topics = topicsForArea(area.id).filter((topic) => questionsForTopic(topic.id).length > 0);
              if (topics.length === 0) return null;
              const areaAttempts = snapshot.topics
                .filter((topic) => topic.topic.areaId === area.id)
                .reduce((total, topic) => total + topic.attempts, 0);
              return (
                <section key={area.id} className="card overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-border bg-surface-2/60 px-4 py-2.5">
                    <span className="size-2 rounded-full" style={{ background: area.color }} />
                    <h3 className="text-xs font-semibold">{area.title}</h3>
                    <span className="ml-auto text-[0.6rem] text-muted">
                      {areaAttempts ? `${areaAttempts}回解答` : "未演習"}
                    </span>
                  </div>
                  <ul className="divide-y divide-border">
                    {topics.map((topic) => {
                      const stat = snapshot.topics.find((row) => row.topic.id === topic.id);
                      const count = questionsForTopic(topic.id).length;
                      return (
                        <li key={topic.id}>
                          <Link
                            href={`/practice/${topic.id}`}
                            className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-2"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-medium group-hover:text-accent">{topic.title}</p>
                              <p className="mt-0.5 text-[0.6rem] text-muted">
                                {count}問 · {topic.examPart === "both" ? "A/B" : `科目${topic.examPart}`}
                                {attemptedTopicIds.has(topic.id) ? ` · 正答率 ${stat?.accuracy ?? 0}%` : ""}
                              </p>
                            </div>
                            <div className="w-20">
                              <ProgressBar value={stat?.accuracy ?? 0} height={4} />
                            </div>
                            <ArrowRight className="size-3.5 text-border-strong group-hover:text-accent" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>

        <aside className="space-y-4">
          <PracticeSetup
            topics={topicOptions}
            weakTopicIds={snapshot.weakTopics.map((topic) => topic.topic.id)}
          />
          <div className="card p-5">
            <p className="eyebrow">Quick start</p>
            <div className="mt-2 space-y-2">
              {[
                { label: "弱点だけ 10問", href: "/practice/run?count=10&weak=1" },
                { label: "科目B 事例 5問", href: "/practice/run?part=B&count=5" },
                { label: "公式過去問 2026", href: "/past-papers/2026" },
                { label: "ランダム 20問", href: "/practice/run?count=20" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs transition-colors hover:border-accent/50 hover:bg-surface-2"
                >
                  {item.label}
                  <ArrowRight className="size-3.5 text-muted" />
                </Link>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-accent" />
              <p className="text-xs font-semibold">解き方の推奨</p>
            </div>
            <ol className="mt-2 space-y-1.5 text-[0.7rem] leading-5 text-muted">
              <li>1. まずレッスン10問で概念の穴を見つける</li>
              <li>2. 誤答は選択肢ごとの理由を読む</li>
              <li>3. 翌日・3日後・1週間後に復習</li>
              <li>4. 科目Bは「誰が何を決めるか」を意識する</li>
            </ol>
            <Badge className="mt-3">正答率だけで習得を判定しません</Badge>
          </div>
        </aside>
      </div>
    </div>
  );
}
