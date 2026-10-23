export type ExamPart = "A" | "B";
export type Difficulty = "easy" | "medium" | "hard";
export type SourceKind = "original" | "official";
export type OptionId = "a" | "i" | "u" | "e" | "o" | "ka" | "ki" | "ku" | "ke" | "ko";

export type DiagramId =
  | "cia-triad"
  | "risk-process"
  | "risk-matrix"
  | "pdca"
  | "isms-landscape"
  | "tls-handshake"
  | "pki-chain"
  | "dmz-firewall"
  | "kill-chain"
  | "incident-response"
  | "backup-321"
  | "rpo-rto"
  | "access-control"
  | "auth-factors"
  | "cloud-responsibility"
  | "supply-chain"
  | "zero-trust"
  | "hash-signature"
  | "data-protection"
  | "audit-flow"
  | "bcp-timeline"
  | "network-path";

export type WidgetId =
  | "risk-matrix"
  | "backup-planner"
  | "access-matrix"
  | "hash-demo"
  | "incident-triage"
  | "control-matcher"
  | "cia-impact"
  | "subnet-calculator";

export type Block =
  | { type: "lead"; text: string }
  | { type: "p"; text: string }
  | { type: "list"; ordered?: boolean; items: readonly string[] }
  | {
      type: "table";
      caption?: string;
      headers: readonly string[];
      rows: readonly (readonly string[])[];
      note?: string;
    }
  | {
      type: "callout";
      tone: "tip" | "trap" | "info" | "example";
      title: string;
      text: string;
    }
  | { type: "terms"; termIds: readonly string[] }
  | {
      type: "diagram";
      diagram: DiagramId;
      caption?: string;
      props?: Record<string, string | number | boolean>;
    }
  | {
      type: "interactive";
      widget: WidgetId;
      title?: string;
      props?: Record<string, string | number | boolean>;
    }
  | {
      type: "comparison";
      left: { title: string; items: readonly string[] };
      right: { title: string; items: readonly string[] };
    }
  | { type: "steps"; items: readonly { title: string; text: string }[] };

export interface LessonSection {
  id: string;
  title: string;
  blocks: readonly Block[];
}

export interface SourceRef {
  label: string;
  url: string;
  note?: string;
}

export interface Lesson {
  id: string;
  areaId: string;
  topicIds: readonly string[];
  title: string;
  titleEn: string;
  summary: string;
  readingMinutes: number;
  difficulty: Difficulty;
  prerequisites: readonly string[];
  objectives: readonly string[];
  sections: readonly LessonSection[];
  keyPoints: readonly string[];
  examTraps: readonly string[];
  relatedLessonIds: readonly string[];
  termIds: readonly string[];
  sources: readonly SourceRef[];
}

export interface GlossaryTerm {
  id: string;
  ja: string;
  reading?: string;
  en: string;
  abbr?: string;
  shortJa: string;
  shortEn: string;
  explanationJa: string;
  explanationEn: string;
  examUsage?: string;
  lessonIds: readonly string[];
  relatedTermIds: readonly string[];
  tags: readonly string[];
}

export interface QuestionOption {
  id: OptionId;
  text: string;
}

export interface QuestionExplanation {
  correct: string;
  why: readonly string[];
  optionNotes: Partial<Record<OptionId, string>>;
  english?: string;
  termIds: readonly string[];
}

export interface QuestionSource {
  kind: SourceKind;
  attribution: string;
  url?: string;
  year?: number;
  questionNo?: number;
  note?: string;
}

export interface Question {
  id: string;
  part: ExamPart;
  topicIds: readonly string[];
  lessonIds: readonly string[];
  difficulty: Difficulty;
  type: "knowledge" | "scenario";
  stem: string;
  presentation?: Block[];
  options: readonly QuestionOption[];
  correctOptionId: OptionId;
  explanation: QuestionExplanation;
  source: QuestionSource;
  tags: readonly string[];
}

export interface Area {
  id: string;
  order: number;
  title: string;
  titleEn: string;
  shortTitle: string;
  description: string;
  color: string;
  lessons: readonly Lesson[];
  terms: readonly GlossaryTerm[];
  questions: readonly Question[];
}

export interface SyllabusTopic {
  id: string;
  areaId: string;
  title: string;
  titleEn: string;
  reference: string;
  summary: string;
  examPart: ExamPart | "both";
}

export interface StudyPlanInput {
  examDate: string;
  minutesPerDay: number;
  daysPerWeek: number;
  familiarity: "beginner" | "basic" | "confident";
  japaneseConfidence: "low" | "medium" | "high";
}

export interface StudyPlanDay {
  date: string;
  kind: "lesson" | "quiz" | "review" | "mock" | "rest";
  minutes: number;
  title: string;
  href?: string;
  lessonIds?: string[];
}

export interface StudyPlan {
  input: StudyPlanInput;
  generatedAt: string;
  days: StudyPlanDay[];
  notes: string[];
}

export type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "term"; termId: string; label: string };

export interface OfficialPaper {
  year: number;
  reiwa: number;
  label: string;
  publishedAt: string;
  pageUrl: string;
  bookletUrl: string;
  answerUrl: string;
  questionNumbers: readonly number[];
  publishedCount: number;
  actualCount: number;
  note: string;
  questions: readonly Question[];
}
