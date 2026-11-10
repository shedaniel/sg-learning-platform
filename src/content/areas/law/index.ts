import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";
import { lawLessons } from "@/content/areas/law/lessons";
import { lawQuestions } from "@/content/areas/law/questions";
import { questionsExtra } from "@/content/areas/law/questions-extra";
import { lawTerms } from "@/content/areas/law/terms";

const meta = AREA_META.find((m) => m.id === "law")!;

export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons: lawLessons,
  terms: lawTerms,
  questions: [...lawQuestions, ...questionsExtra],
};
