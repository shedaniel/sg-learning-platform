import { NextResponse } from "next/server";
import { ALL_QUESTIONS, QUESTION_BY_ID } from "@/content";
import { getProfileId } from "@/lib/session";
import {
  createMockAttempt,
  getMockAttempt,
  recordStudySession,
  saveMockState,
  submitMockAttempt,
} from "@/lib/db/store";
import { composeMockExam, scoreMock, type MockAnswer } from "@/lib/exam";

interface MockBody {
  action?: "start" | "save" | "submit";
  id?: string;
  answers?: Record<string, MockAnswer>;
  flags?: string[];
  currentIndex?: number;
}

const MOCK_DURATION_SEC = 120 * 60;

export async function GET(request: Request) {
  const profileId = await getProfileId();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id が必要です" }, { status: 400 });
  const attempt = await getMockAttempt(id, profileId);
  if (!attempt) return NextResponse.json({ error: "模擬試験が見つかりません" }, { status: 404 });
  return NextResponse.json(attempt);
}

export async function POST(request: Request) {
  const profileId = await getProfileId();
  const body = (await request.json().catch(() => null)) as MockBody | null;
  if (!body?.action) return NextResponse.json({ error: "action が必要です" }, { status: 400 });

  if (body.action === "start") {
    const questions = composeMockExam(ALL_QUESTIONS, { partA: 48, partB: 12 });
    if (questions.length < 60) {
      return NextResponse.json(
        { error: `模擬試験には60問必要です（現在 ${questions.length} 問）。コンテンツを追加してください。` },
        { status: 409 },
      );
    }
    const id = await createMockAttempt({
      profileId,
      questionIds: questions.map((question) => question.id),
      durationSec: MOCK_DURATION_SEC,
    });
    return NextResponse.json({ id });
  }

  if (!body.id) return NextResponse.json({ error: "id が必要です" }, { status: 400 });
  const attempt = await getMockAttempt(body.id, profileId);
  if (!attempt) return NextResponse.json({ error: "模擬試験が見つかりません" }, { status: 404 });

  const answers = body.answers ?? {};
  const flags = body.flags ?? [];
  const currentIndex = Math.max(0, Math.round(body.currentIndex ?? 0));

  if (attempt.submittedAt) {
    return NextResponse.json({ submitted: true, result: attempt.result });
  }

  if (body.action === "save") {
    await saveMockState(body.id, profileId, { answers, flags, currentIndex });
    return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
  }

  if (body.action === "submit") {
    const result = scoreMock(attempt.questionIds, answers, QUESTION_BY_ID);
    await submitMockAttempt(body.id, profileId, {
      answers,
      flags,
      currentIndex,
      correct: result.correct,
      result,
      attemptRecords: result.questions
        .filter((detail) => detail.selected !== null)
        .map((detail) => ({
          questionId: detail.questionId,
          selected: detail.selected as string,
          correct: detail.correct,
          elapsedMs: detail.elapsedMs,
        })),
    });
    const minutes = Math.max(
      1,
      Math.min(180, Math.round((Date.now() - new Date(attempt.startedAt).getTime()) / 60000)),
    );
    await recordStudySession({ profileId, minutes, source: "mock", startedAt: attempt.startedAt });
    return NextResponse.json({ submitted: true, result });
  }

  return NextResponse.json({ error: "action が不正です" }, { status: 400 });
}
