import Link from "next/link";
import { ArrowRight, Timer } from "lucide-react";
import { AREAS, questionsForTopic, topicsForArea } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { PageHeader, LinkButton } from "@/components/ui/primitives";
import { PracticeSetup } from "@/components/practice/PracticeSetup";
import { SYLLABUS_TOPICS } from "@/content/syllabus";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const { id } = await getLearner();
  const snapshot = await getProgressSnapshot(id);
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
    <div>
      <PageHeader
        title="演習"
        description="分野ごとの演習、レッスン単位の確認、科目Bの事例問題まで。誤答は選択肢ごとの理由を読み、間隔を空けて解き直します。"
        actions={
          <LinkButton href="/mock" className="h-10 px-4">
            <Timer className="size-4" />
            60問 模擬試験
          </LinkButton>
        }
      />

      <p className="-mt-4 mb-10 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem] text-muted-foreground">
        <span>
          問題 <span className="mono font-semibold text-foreground">{totalQuestions}</span> 問
        </span>
        <Link href="/statistics" className="hover:text-foreground">
          解いた問題 <span className="mono font-semibold text-foreground">{snapshot.uniqueQuestionsAttempted}</span>
        </Link>
        <Link href="/statistics" className="hover:text-foreground">
          直近の正答率{" "}
          <span className="mono font-semibold text-foreground">
            {snapshot.attemptCount > 0 ? `${snapshot.recentAccuracy}%` : "—"}
          </span>
        </Link>
        <Link href="/review" className="hover:text-foreground">
          復習待ち <span className="mono font-semibold text-foreground">{snapshot.reviewCounts.due}</span> 件
        </Link>
      </p>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 lg:order-1">
          <h2 className="text-lg font-semibold">分野別に解く</h2>
          <div className="mt-4 space-y-9">
            {AREAS.map((area) => {
              const topics = topicsForArea(area.id).filter((topic) => questionsForTopic(topic.id).length > 0);
              if (topics.length === 0) return null;
              const areaAttempts = snapshot.topics
                .filter((topic) => topic.topic.areaId === area.id)
                .reduce((total, topic) => total + topic.attempts, 0);
              return (
                <section key={area.id} aria-labelledby={`area-${area.id}`}>
                  <div className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
                    <h3 id={`area-${area.id}`} className="text-[0.9375rem] font-semibold">
                      {area.title}
                    </h3>
                    <span className="text-[0.8125rem] text-muted-foreground">
                      {areaAttempts ? `${areaAttempts}回解答` : "未演習"}
                    </span>
                  </div>
                  <ul className="divide-y divide-border">
                    {topics.map((topic) => {
                      const stat = snapshot.topics.find((row) => row.topic.id === topic.id);
                      const count = questionsForTopic(topic.id).length;
                      const attempted = attemptedTopicIds.has(topic.id);
                      return (
                        <li key={topic.id}>
                          <Link
                            href={`/practice/${topic.id}`}
                            className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block text-[0.9375rem] font-medium group-hover:text-info-foreground">
                                {topic.title}
                              </span>
                              <span className="text-[0.8125rem] text-muted-foreground">
                                {count}問 · {topic.examPart === "both" ? "科目A/B" : `科目${topic.examPart}`}
                              </span>
                            </span>
                            {attempted ? (
                              <span className="mono text-[0.9375rem] font-semibold">{stat?.accuracy ?? 0}%</span>
                            ) : null}
                            <ArrowRight className="size-4 text-muted-foreground/60 group-hover:text-info-foreground" />
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

        <aside className="order-1 space-y-8 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <PracticeSetup
            topics={topicOptions}
            weakTopicIds={snapshot.weakTopics.map((topic) => topic.topic.id)}
            totalCount={totalQuestions}
          />
          <section aria-labelledby="quick-heading">
            <h2 id="quick-heading" className="text-[0.9375rem] font-semibold">
              すぐに始める
            </h2>
            <ul className="mt-1 divide-y divide-border">
              {[
                { label: "弱点だけ 10問", href: "/practice/run?count=10&weak=1" },
                { label: "科目B 事例 5問", href: "/practice/run?part=B&count=5" },
                { label: "公式過去問 2026", href: "/past-papers/2026" },
                { label: "ランダム 20問", href: "/practice/run?count=20" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="-mx-2 flex items-center justify-between rounded-lg px-2 py-2.5 text-[0.9375rem] transition-colors hover:bg-muted"
                  >
                    {item.label}
                    <ArrowRight className="size-4 text-muted-foreground/60" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
