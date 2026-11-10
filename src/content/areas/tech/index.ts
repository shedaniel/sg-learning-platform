import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";
import { techLessons } from "./lessons";
import { techTerms } from "./terms";
import { techQuestions } from "./questions";
import { questionsExtra } from "./questions-extra";

const meta = AREA_META.find((m) => m.id === "tech")!;

export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons: techLessons,
  terms: techTerms,
  questions: [...techQuestions, ...questionsExtra],
};
