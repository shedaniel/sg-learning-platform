import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";
import { fundamentalsLesson } from "./lessons/fundamentals";
import { assessmentLesson } from "./lessons/assessment";
import { responseContinuityLesson } from "./lessons/response-continuity";
import { terms } from "./terms";
import { questions } from "./questions";

const meta = AREA_META.find((m) => m.id === "risk")!;

export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons: [fundamentalsLesson, assessmentLesson, responseContinuityLesson],
  terms,
  questions,
};
