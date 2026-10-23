import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";
import { IT_LESSONS } from "@/content/areas/it/lessons";
import { IT_TERMS } from "@/content/areas/it/terms";
import { IT_QUESTIONS } from "@/content/areas/it/questions";

const meta = AREA_META.find((m) => m.id === "it")!;

export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons: IT_LESSONS,
  terms: IT_TERMS,
  questions: IT_QUESTIONS,
};
