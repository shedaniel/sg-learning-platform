import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";
import { lessons } from "./lessons";
import { terms } from "./terms";
import { questions } from "./questions";

const meta = AREA_META.find((m) => m.id === "ops")!;

export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons,
  terms,
  questions,
};
