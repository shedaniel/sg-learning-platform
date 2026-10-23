"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export interface PracticeTopicOption {
  id: string;
  title: string;
  areaTitle: string;
  questionCount: number;
}

export function PracticeSetup({
  topics,
  defaultTopic,
  weakTopicIds = [],
}: {
  topics: PracticeTopicOption[];
  defaultTopic?: string;
  weakTopicIds?: string[];
}) {
  const router = useRouter();
  const [topicId, setTopicId] = useState(defaultTopic ?? "all");
  const [count, setCount] = useState(10);
  const [part, setPart] = useState("both");
  const [difficulty, setDifficulty] = useState("mixed");
  const [feedback, setFeedback] = useState("instant");

  function start() {
    const params = new URLSearchParams();
    if (topicId !== "all") params.set("topicId", topicId);
    params.set("count", String(count));
    params.set("part", part);
    params.set("difficulty", difficulty);
    params.set("feedback", feedback);
    router.push(`/practice/run?${params.toString()}`);
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-accent" />
        <h2 className="text-sm font-semibold">カスタム演習</h2>
      </div>
      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-[0.7rem] font-semibold text-muted">出題範囲</span>
          <select
            value={topicId}
            onChange={(event) => setTopicId(event.target.value)}
            className="field mt-1"
          >
            <option value="all">全範囲（{topics.reduce((total, topic) => total + topic.questionCount, 0)}問）</option>
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.areaTitle} / {topic.title}（{topic.questionCount}問）
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[0.7rem] font-semibold text-muted">問題数</span>
            <select
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="field mt-1"
            >
              {[5, 10, 15, 20, 30].map((value) => (
                <option key={value} value={value}>
                  {value}問
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[0.7rem] font-semibold text-muted">科目</span>
            <select
              value={part}
              onChange={(event) => setPart(event.target.value)}
              className="field mt-1"
            >
              <option value="both">A + B</option>
              <option value="A">科目A</option>
              <option value="B">科目B</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[0.7rem] font-semibold text-muted">難易度</span>
            <select
              value={difficulty}
              onChange={(event) => setDifficulty(event.target.value)}
              className="field mt-1"
            >
              <option value="mixed">混合</option>
              <option value="easy">基礎</option>
              <option value="medium">標準</option>
              <option value="hard">応用</option>
            </select>
          </label>
          <label className="block">
            <span className="text-[0.7rem] font-semibold text-muted">答え合わせ</span>
            <select
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              className="field mt-1"
            >
              <option value="instant">1問ごと</option>
              <option value="end">最後にまとめて</option>
            </select>
          </label>
        </div>

        <button type="button" className="btn btn-primary w-full" onClick={start}>
          演習を開始
        </button>
        {weakTopicIds.length > 0 ? (
          <div>
            <p className="mb-1.5 text-[0.65rem] text-muted">直近の誤答が多い分野</p>
            <div className="flex flex-wrap gap-1.5">
              {weakTopicIds.slice(0, 4).map((id) => {
                const topic = topics.find((item) => item.id === id);
                if (!topic) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTopicId(id);
                      setCount(10);
                    }}
                    className="chip border-warning/30 bg-warning/10 text-warning"
                  >
                    {topic.title}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}
        <p className="text-[0.65rem] leading-5 text-muted">
          正答率と誤答履歴は保存されます。誤答は間隔反復の復習キューへ自動登録されます。
        </p>
      </div>
    </div>
  );
}
