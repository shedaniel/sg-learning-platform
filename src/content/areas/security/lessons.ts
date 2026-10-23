import type { Lesson } from "@/lib/content/types";
import { ciaAndDesignLesson } from "./cia-and-design";
import { threatsAndMalwareLesson } from "./threats-and-malware";
import { attacksLesson } from "./attacks";
import { cryptoAuthLesson } from "./crypto-auth";

export const securityLessons: Lesson[] = [
  ciaAndDesignLesson,
  threatsAndMalwareLesson,
  attacksLesson,
  cryptoAuthLesson,
];
