import type { Lesson } from "@/lib/content/types";
import { networkDbLesson } from "@/content/areas/it/network-db";
import { systemsLesson } from "@/content/areas/it/systems";
import { managementLesson } from "@/content/areas/it/management";
import { strategyLesson } from "@/content/areas/it/strategy";

export const IT_LESSONS: readonly Lesson[] = [
  networkDbLesson,
  systemsLesson,
  managementLesson,
  strategyLesson,
];
