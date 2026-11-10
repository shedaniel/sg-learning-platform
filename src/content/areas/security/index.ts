import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";
import { securityLessons } from "./lessons";
import { securityTerms } from "./terms";
import { securityQuestions } from "./questions";
import { questionsExtra } from "./questions-extra";

const meta = AREA_META.find((m) => m.id === "security")!;

export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons: securityLessons,
  terms: securityTerms,
  questions: [...securityQuestions, ...questionsExtra],
};
