import type { Question } from "@/lib/content/types";
import { ciaQuestions } from "./questions-cia";
import { threatQuestions } from "./questions-threats";
import { attackQuestions } from "./questions-attacks";
import { cryptoQuestions } from "./questions-crypto";

export const securityQuestions: Question[] = [
  ...ciaQuestions,
  ...threatQuestions,
  ...attackQuestions,
  ...cryptoQuestions,
];
