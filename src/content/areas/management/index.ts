import type { Area } from "@/lib/content/types";
import { AREA_META } from "@/content/syllabus";
import { policyIsmsLesson } from "./policy-isms";
import { governanceOrgLesson } from "./governance-org";
import { incidentLesson } from "./incident";
import { terms } from "./terms";
import { policyIsmsQuestions } from "./questions-policy-isms";
import { governanceOrgQuestions } from "./questions-governance-org";
import { incidentQuestions } from "./questions-incident";
import { questionsExtra } from "./questions-extra";

const meta = AREA_META.find((m) => m.id === "management")!;

export const area: Area = {
  id: meta.id,
  order: meta.order,
  title: meta.title,
  titleEn: meta.titleEn,
  shortTitle: meta.shortTitle,
  description: meta.description,
  color: meta.color,
  lessons: [policyIsmsLesson, governanceOrgLesson, incidentLesson],
  terms,
  questions: [
    ...policyIsmsQuestions,
    ...governanceOrgQuestions,
    ...incidentQuestions,
    ...questionsExtra,
  ],
};
