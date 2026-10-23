import { ALL_LESSONS } from "@/content";
import type {
  Lesson,
  StudyPlan,
  StudyPlanDay,
  StudyPlanInput,
} from "@/lib/content/types";

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

export interface PlanOptions {
  weakTopicIds?: string[];
  completedLessonIds?: string[];
  startDate?: Date;
}

export function generateStudyPlan(
  input: StudyPlanInput,
  options: PlanOptions = {},
): StudyPlan {
  const daysPerWeek = Math.min(7, Math.max(1, Math.round(input.daysPerWeek)));
  const minutesPerDay = Math.min(240, Math.max(20, Math.round(input.minutesPerDay)));
  const start = options.startDate ?? startOfToday();
  const exam = new Date(`${input.examDate}T00:00:00`);
  const completed = new Set(options.completedLessonIds ?? []);
  const weak = new Set(options.weakTopicIds ?? []);

  const totalDays = Math.max(
    0,
    Math.ceil((exam.getTime() - start.getTime()) / 86_400_000),
  );
  const horizon = Math.min(totalDays, 180);
  const pace =
    input.familiarity === "confident" ? 1.25 : input.familiarity === "basic" ? 1 : 0.8;

  const remaining = ALL_LESSONS.filter((lesson) => !completed.has(lesson.id));
  const ordered = [...remaining].sort((a, b) => {
    const aWeak = a.topicIds.some((id) => weak.has(id)) ? 0 : 1;
    const bWeak = b.topicIds.some((id) => weak.has(id)) ? 0 : 1;
    if (aWeak !== bWeak) return aWeak - bWeak;
    return a.areaId.localeCompare(b.areaId) || a.id.localeCompare(b.id);
  });

  // Keep the last 2 days for final review; reserve a mock in the final week.
  const studyHorizon = Math.max(1, horizon - 2);
  const template: Array<Omit<StudyPlanDay, "date">> = [];
  const minutesPerLesson = input.japaneseConfidence === "low" ? 40 : 30;
  let lessonCursor = 0;
  let dayNumber = 0;
  let lastMockAt = -1;

  while (lessonCursor < ordered.length) {
    if (dayNumber >= studyHorizon) break;
    const lessonsToday: Lesson[] = [];
    let minuteBudget = minutesPerDay;
    while (
      lessonCursor < ordered.length &&
      lessonsToday.length < 2 &&
      minuteBudget >= minutesPerLesson
    ) {
      lessonsToday.push(ordered[lessonCursor]);
      lessonCursor += 1;
      minuteBudget -= minutesPerLesson;
    }
    const isReview = dayNumber > 0 && dayNumber % 5 === 4;
    const isMock =
      dayNumber > 0 &&
      dayNumber % 12 === 11 &&
      dayNumber !== lastMockAt &&
      dayNumber < studyHorizon - 1;
    if (isMock) {
      lastMockAt = dayNumber;
      template.push({
        kind: "mock",
        minutes: 120,
        title: "模擬試験（60問・120分）",
        href: "/mock",
      });
    } else if (isReview) {
      template.push({
        kind: "review",
        minutes: Math.min(minutesPerDay, 25),
        title: "間隔反復レビューと誤答の解き直し",
        href: "/review",
        lessonIds: lessonsToday.map((lesson) => lesson.id),
      });
      if (lessonsToday.length > 0 && minuteBudget > 0) {
        template.push({
          kind: "lesson",
          minutes: Math.min(minuteBudget, minutesPerDay - 25),
          title: lessonsToday.map((lesson) => lesson.title).join(" / "),
          href: `/learn/${lessonsToday[0].id}`,
          lessonIds: lessonsToday.map((lesson) => lesson.id),
        });
      }
    } else if (lessonsToday.length > 0) {
      template.push({
        kind: "lesson",
        minutes: Math.min(minutesPerDay, lessonsToday.length * minutesPerLesson),
        title: lessonsToday.map((lesson) => lesson.title).join(" / "),
        href: `/learn/${lessonsToday[0].id}`,
        lessonIds: lessonsToday.map((lesson) => lesson.id),
      });
      if (minutesPerDay - lessonsToday.length * minutesPerLesson >= 10) {
        template.push({
          kind: "quiz",
          minutes: 10,
          title: `確認クイズ: ${lessonsToday[0].title}`,
          href: `/practice/${lessonsToday[0].topicIds[0] ?? ""}`,
        });
      }
    } else {
      break;
    }
    dayNumber += 1;
  }

  if (lessonCursor < ordered.length) {
    // Content does not fit before the exam: append a warning day at the end.
    template.push({
      kind: "review",
      minutes: minutesPerDay,
      title: `未消化のレッスンが ${ordered.length - lessonCursor} 件あります。1日の学習時間を増やすか、応用度の低い章から優先してください。`,
      href: "/plan",
    });
  }

  template.push({
    kind: "review",
    minutes: Math.min(minutesPerDay, 45),
    title: "最終確認: 誤答ノート・用語・頻出トラップ",
    href: "/review",
  });
  template.push({
    kind: "review",
    minutes: Math.min(minutesPerDay, 30),
    title: "試験前日: 軽い復習と睡眠優先（新しい教材は開かない）",
    href: "/statistics",
  });

  const days: StudyPlanDay[] = [];
  let cursor = startOfToday();
  let templateIndex = 0;
  for (let i = 0; i < horizon; i += 1) {
    const weekday = cursor.getDay();
    const isStudyDay = weekday % 7 < daysPerWeek || i >= studyHorizon;
    const date = isoDate(cursor);
    if (!isStudyDay || templateIndex >= template.length) {
      days.push({
        date,
        kind: "rest",
        minutes: 0,
        title: i === horizon - 1 ? "試験前日" : "休息日（軽い用語確認のみ）",
      });
    } else {
      const task = template[templateIndex];
      templateIndex += 1;
      days.push({ date, ...task });
    }
    cursor = new Date(cursor.getTime() + 86_400_000);
  }

  if (totalDays <= 0) {
    days.push({
      date: input.examDate,
      kind: "review",
      minutes: minutesPerDay,
      title: "試験日が過去または当日です。日付を確認してください。",
    });
  } else if (days.length > 0) {
    days.push({
      date: input.examDate,
      kind: "review",
      minutes: 0,
      title: "試験当日。落ち着いて、問題文の主語と目的語を確認する。",
    });
  }

  const notes = [
    `1日 ${minutesPerDay} 分 × 週 ${daysPerWeek} 日で設計しました。`,
    `未完了レッスン ${ordered.length} 件を、弱点分野を先に置いて配分しています。`,
    "模擬試験は 120 分確保できる日に配置してください。予定がずれたら、完了済みレッスンを除外して再生成できます。",
    "このプランは学習順序の提案であり、合格を保証するものではありません。",
  ];
  if (input.japaneseConfidence === "low") {
    notes.push(
      "日本語の読解負荷を考慮し、1レッスン40分として計算しています。用語集の英語対訳を併用してください。",
    );
  }
  if (weak.size > 0) {
    notes.push("直近の誤答が多いトピックを優先的に前倒ししています。");
  }

  return {
    input,
    generatedAt: new Date().toISOString(),
    days,
    notes,
  };
}

export function planSummary(plan: StudyPlan) {
  const studyDays = plan.days.filter((day) => day.kind !== "rest");
  const totalMinutes = studyDays.reduce((total, day) => total + day.minutes, 0);
  return {
    days: plan.days.length,
    studyDays: studyDays.length,
    totalMinutes,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    mocks: plan.days.filter((day) => day.kind === "mock").length,
  };
}

export const DEFAULT_PLAN_INPUT: StudyPlanInput = {
  examDate: new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10),
  minutesPerDay: 60,
  daysPerWeek: 5,
  familiarity: "basic",
  japaneseConfidence: "medium",
};
