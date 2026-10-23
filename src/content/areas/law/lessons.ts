import type { Lesson } from "@/lib/content/types";
import { cyberCriminalLesson } from "@/content/areas/law/lessons/cyber-criminal";
import { ipContractLesson } from "@/content/areas/law/lessons/ip-contract";
import { privacyLesson } from "@/content/areas/law/lessons/privacy";

export const lawLessons: Lesson[] = [
  privacyLesson,
  cyberCriminalLesson,
  ipContractLesson,
];
