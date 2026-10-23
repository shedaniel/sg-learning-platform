import type { OfficialPaper, Question } from "@/lib/content/types";
import { paper as paper2026 } from "./2026";
import { paper as paper2025 } from "./2025";
import { paper as paper2024 } from "./2024";
import { paper as paper2023 } from "./2023";

export const OFFICIAL_PAPERS: OfficialPaper[] = [
  paper2026,
  paper2025,
  paper2024,
  paper2023,
].sort((a, b) => b.year - a.year);

export const OFFICIAL_QUESTIONS: Question[] = OFFICIAL_PAPERS.flatMap(
  (paper) => paper.questions,
);
