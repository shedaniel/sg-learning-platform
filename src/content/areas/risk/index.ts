import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";

const meta = AREA_META.find((m) => m.id === "risk")!;

// Placeholder replaced by the content author for this area.
export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons: [],
  terms: [],
  questions: [],
};
