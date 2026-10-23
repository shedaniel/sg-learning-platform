"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, CheckCircle2, Circle, Play } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LessonActions({
  lessonId,
  completed,
  bookmarked,
  quizHref,
}: {
  lessonId: string;
  completed: boolean;
  bookmarked: boolean;
  quizHref: string;
}) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isBookmarked, setIsBookmarked] = useState(bookmarked);
  const [pending, setPending] = useState(false);

  async function toggleComplete() {
    setPending(true);
    try {
      const next = !isCompleted;
      const response = await fetch("/api/lesson-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: next }),
      });
      if (response.ok) {
        setIsCompleted(next);
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  async function toggleBookmark() {
    const response = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType: "lesson", itemId: lessonId }),
    });
    if (response.ok) {
      const data = (await response.json()) as { bookmarked: boolean };
      setIsBookmarked(data.bookmarked);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void toggleComplete()}
        disabled={pending}
        className={cn("btn", isCompleted && "border-success/40 bg-success/10 text-success")}
        aria-pressed={isCompleted}
      >
        {isCompleted ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
        {isCompleted ? "読了済み" : "読了にする"}
      </button>
      <Link href={quizHref} className="btn btn-primary">
        <Play className="size-4" />
        確認クイズ
      </Link>
      <button
        type="button"
        onClick={() => void toggleBookmark()}
        className={cn("btn btn-ghost size-9 rounded-full p-0", isBookmarked && "text-accent")}
        aria-label={isBookmarked ? "ブックマーク解除" : "ブックマーク"}
        aria-pressed={isBookmarked}
        title="ブックマーク"
      >
        <Bookmark className={cn("size-4", isBookmarked && "fill-current")} />
      </button>
    </div>
  );
}

export function LessonVisit({ lessonId }: { lessonId: string }) {
  useEffect(() => {
    const started = Date.now();
    void fetch("/api/lesson-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId }),
      keepalive: true,
    });

    function record() {
      if (document.visibilityState !== "hidden") return;
      const minutes = Math.round((Date.now() - started) / 60000);
      if (minutes < 1) return;
      const payload = JSON.stringify({ lessonId, minutes: Math.min(60, minutes) });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/lesson-progress",
          new Blob([payload], { type: "application/json" }),
        );
      }
    }
    document.addEventListener("visibilitychange", record);
    return () => document.removeEventListener("visibilitychange", record);
  }, [lessonId]);
  return null;
}
