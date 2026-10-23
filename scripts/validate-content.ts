import { ALL_LESSONS, ALL_QUESTIONS, ALL_TERMS, AREAS, coverageStats, OFFICIAL_PAPERS, OFFICIAL_QUESTIONS } from "../src/content";
import { AREA_META, SYLLABUS_TOPICS } from "../src/content/syllabus";
import type { Block, DiagramId, Question, WidgetId } from "../src/lib/content/types";

const DIAGRAMS: Record<DiagramId, true> = {
  "cia-triad": true,
  "risk-process": true,
  "risk-matrix": true,
  pdca: true,
  "isms-landscape": true,
  "tls-handshake": true,
  "pki-chain": true,
  "dmz-firewall": true,
  "kill-chain": true,
  "incident-response": true,
  "backup-321": true,
  "rpo-rto": true,
  "access-control": true,
  "auth-factors": true,
  "cloud-responsibility": true,
  "supply-chain": true,
  "zero-trust": true,
  "hash-signature": true,
  "data-protection": true,
  "audit-flow": true,
  "bcp-timeline": true,
  "network-path": true,
};
const WIDGETS: Record<WidgetId, true> = {
  "risk-matrix": true,
  "backup-planner": true,
  "access-matrix": true,
  "hash-demo": true,
  "incident-triage": true,
  "control-matcher": true,
  "cia-impact": true,
  "subnet-calculator": true,
};
const errors: string[] = [];
const warnings: string[] = [];

function fail(message: string) {
  errors.push(message);
}

function warn(message: string) {
  warnings.push(message);
}

function checkUnique(kind: string, ids: string[]) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) fail(`${kind} のIDが重複: ${id}`);
    seen.add(id);
  }
}

checkUnique("レッスン", ALL_LESSONS.map((lesson) => lesson.id));
checkUnique("用語", ALL_TERMS.map((term) => term.id));
checkUnique("問題", ALL_QUESTIONS.map((question) => question.id));

if (AREAS.length !== AREA_META.length) fail("エリア数がメタデータと一致しません");

const termIds = new Set(ALL_TERMS.map((term) => term.id));
const lessonIds = new Set(ALL_LESSONS.map((lesson) => lesson.id));
const topicIds = new Set(SYLLABUS_TOPICS.map((topic) => topic.id));

function checkInlineTerms(text: string, context: string) {
  const matches = text.matchAll(/\{\{term:([^}|]+)(?:\|[^}]+)?\}\}/g);
  for (const match of matches) {
    if (!termIds.has(match[1])) fail(`${context}: 未定義の用語参照 {{term:${match[1]}}}`);
  }
}

function checkBlock(block: Block, context: string) {
  if (block.type === "diagram" && !DIAGRAMS[block.diagram]) {
    fail(`${context}: 未知の図 ${block.diagram}`);
  }
  if (block.type === "interactive" && !WIDGETS[block.widget]) {
    fail(`${context}: 未知のウィジェット ${block.widget}`);
  }
  if (block.type === "p" || block.type === "lead") checkInlineTerms(block.text, context);
  if (block.type === "callout") checkInlineTerms(block.text, context);
  if (block.type === "list") for (const item of block.items) checkInlineTerms(item, context);
  if (block.type === "table") {
    for (const row of block.rows) for (const cell of row) checkInlineTerms(cell, context);
  }
  if (block.type === "terms") {
    for (const id of block.termIds) {
      if (!termIds.has(id)) fail(`${context}: terms ブロックの未定義用語 ${id}`);
    }
  }
}

for (const area of AREAS) {
  const meta = AREA_META.find((item) => item.id === area.id);
  if (!meta) fail(`未知のエリア ${area.id}`);
  if (area.lessons.length === 0) fail(`エリア ${area.id} にレッスンがありません`);
  if (area.terms.length < 10) warn(`エリア ${area.id} の用語が ${area.terms.length} 件と少なめです`);
  if (area.questions.length < 20) warn(`エリア ${area.id} の問題が ${area.questions.length} 件と少なめです`);

  for (const lesson of area.lessons) {
    if (lesson.areaId !== area.id) fail(`${lesson.id}: areaId が ${lesson.areaId} になっています`);
    if (!lesson.title || !lesson.summary) fail(`${lesson.id}: title/summary が空です`);
    if (lesson.sections.length < 5) fail(`${lesson.id}: セクションが5未満 (${lesson.sections.length})`);
    if (lesson.objectives.length < 3) warn(`${lesson.id}: objectives が3未満`);
    if (lesson.keyPoints.length < 3) warn(`${lesson.id}: keyPoints が3未満`);
    if (lesson.examTraps.length < 2) warn(`${lesson.id}: examTraps が2未満`);
    if (lesson.sources.length === 0) fail(`${lesson.id}: sources がありません`);
    for (const topicId of lesson.topicIds) {
      if (!topicIds.has(topicId)) fail(`${lesson.id}: 未知のトピック ${topicId}`);
    }
    for (const termId of lesson.termIds) {
      if (!termIds.has(termId)) fail(`${lesson.id}: 未知の用語 ${termId}`);
    }
    for (const relatedId of lesson.relatedLessonIds) {
      if (!lessonIds.has(relatedId)) fail(`${lesson.id}: 未知の関連レッスン ${relatedId}`);
    }
    for (const section of lesson.sections) {
      if (section.blocks.length < 2) warn(`${lesson.id}/${section.id}: ブロックが2未満`);
      for (const block of section.blocks) checkBlock(block, `${lesson.id}/${section.id}`);
    }
    const lessonQuestions = area.questions.filter((question) => question.lessonIds.includes(lesson.id));
    if (lessonQuestions.length < 8) fail(`${lesson.id}: 問題が8未満 (${lessonQuestions.length})`);
    const partB = lessonQuestions.filter((question) => question.part === "B").length;
    if (partB < 2) fail(`${lesson.id}: 科目Bシナリオ問題が2未満 (${partB})`);
  }

  for (const term of area.terms) {
    if (!term.ja || !term.en || !term.shortJa || !term.shortEn) fail(`${term.id}: 必須項目が空です`);
    if (!term.explanationJa || !term.explanationEn) fail(`${term.id}: 解説が空です`);
    for (const id of term.lessonIds) {
      if (!lessonIds.has(id)) fail(`${term.id}: 未知のレッスン ${id}`);
    }
    for (const id of term.relatedTermIds) {
      if (!termIds.has(id)) fail(`${term.id}: 未知の関連用語 ${id}`);
    }
  }
}

function validateQuestion(question: Question, context: string) {
  if (!question.stem) fail(`${context}: stem が空です`);
  if (question.options.length !== 4) fail(`${context}: 選択肢が4つではありません`);
  const ids = question.options.map((option) => option.id);
  checkUnique(`${context} 選択肢`, ids);
  if (!ids.every((id) => ["a", "i", "u", "e"].includes(id))) fail(`${context}: 選択肢IDが不正`);
  if (!ids.includes(question.correctOptionId)) fail(`${context}: 正解IDが選択肢にありません`);
  if (!question.topicIds.every((id) => topicIds.has(id))) fail(`${context}: 未知のトピック`);
  if (!question.lessonIds.every((id) => lessonIds.has(id))) fail(`${context}: 未知のレッスン`);
  const wrong = ids.filter((id) => id !== question.correctOptionId);
  for (const id of wrong) {
    if (!question.explanation.optionNotes[id]) fail(`${context}: 誤答肢 ${id} の解説がありません`);
  }
  if (question.explanation.why.length === 0) fail(`${context}: why が空です`);
  if (question.part === "B" && question.type !== "scenario") {
    warn(`${context}: 科目Bですが type が scenario ではありません`);
  }
  if (question.source.kind === "official") {
    if (!question.source.url || !question.source.year || !question.source.questionNo) {
      fail(`${context}: 公式問題の出典情報が不足しています`);
    }
    if (!question.source.attribution.includes("IPA")) {
      fail(`${context}: 公式問題の帰属に IPA がありません`);
    }
  }
}

for (const area of AREAS) {
  for (const question of area.questions) {
    validateQuestion(question, question.id);
    if (question.source.kind !== "original") fail(`${question.id}: エリア問題は original である必要があります`);
  }
}

for (const question of OFFICIAL_QUESTIONS) {
  validateQuestion(question, question.id);
  if (question.source.kind !== "official") fail(`${question.id}: official ではありません`);
}
for (const paper of OFFICIAL_PAPERS) {
  if (paper.questions.length > paper.publishedCount) {
    fail(`official/${paper.year}: 問題数が公開数 ${paper.publishedCount} を超えています`);
  }
  for (const question of paper.questions) {
    if (question.source.year !== paper.year) fail(`${question.id}: 年度が論文メタデータと不一致`);
  }
  if (paper.questions.length < paper.questionNumbers.length) {
    warn(`official/${paper.year}: ${paper.questionNumbers.length - paper.questions.length} 問が未収録`);
  }
}

const stats = coverageStats();
if (stats.missing > 0) {
  fail(`未カバーのシラバストピックが ${stats.missing} 件あります`);
}
for (const row of stats.rows) {
  if (row.status === "partial") {
    warn(`トピック ${row.topic.id} が partial（レッスン ${row.lessons.length} / 問題 ${row.questionCount}）`);
  }
}

const partA = ALL_QUESTIONS.filter((question) => question.part === "A").length;
const partB = ALL_QUESTIONS.filter((question) => question.part === "B").length;
if (partA < 48) fail(`科目Aの問題が48未満 (${partA})`);
if (partB < 12) fail(`科目Bの問題が12未満 (${partB})`);

console.log(`エリア: ${AREAS.length}`);
console.log(`レッスン: ${ALL_LESSONS.length}`);
console.log(`用語: ${ALL_TERMS.length}`);
console.log(`問題: ${ALL_QUESTIONS.length} (科目A ${partA} / 科目B ${partB})`);
console.log(`公式問題: ${OFFICIAL_QUESTIONS.length} / ${OFFICIAL_PAPERS.length} 年分`);
console.log(`シラバス: ${stats.complete}/${stats.total} complete, ${stats.partial} partial, ${stats.missing} missing`);
if (warnings.length) {
  console.log(`\n⚠ 警告 ${warnings.length} 件`);
  for (const warning of warnings) console.log(`  - ${warning}`);
}
if (errors.length) {
  console.error(`\n✖ エラー ${errors.length} 件`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}
console.log("\n✓ コンテンツ検証に合格しました");
