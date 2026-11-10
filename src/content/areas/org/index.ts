import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";
import { humanLesson } from "./lessons/human";
import { vendorLesson } from "./lessons/vendor";
import { auditPhysicalLesson } from "./lessons/audit-physical";
import { orgTerms } from "./terms";
import { humanQuestions } from "./questions/human";
import { vendorQuestions } from "./questions/vendor";
import { auditPhysicalQuestions } from "./questions/audit-physical";
import { questionsExtra } from "./questions-extra";

const meta = AREA_META.find((m) => m.id === "org")!;

export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons: [humanLesson, vendorLesson, auditPhysicalLesson],
  terms: orgTerms,
  questions: [
    ...humanQuestions,
    ...vendorQuestions,
    ...auditPhysicalQuestions,
    ...questionsExtra,
  ],
};
