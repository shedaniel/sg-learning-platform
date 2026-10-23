import type { Question } from "@/lib/content/types";
import { cyberCriminalQuestions } from "@/content/areas/law/questions/cyber-criminal";
import { ipContractQuestions } from "@/content/areas/law/questions/ip-contract";
import { privacyQuestions } from "@/content/areas/law/questions/privacy";

export const lawQuestions: Question[] = [
  ...privacyQuestions,
  ...cyberCriminalQuestions,
  ...ipContractQuestions,
];
