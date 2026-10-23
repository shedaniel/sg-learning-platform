import fs from "node:fs";
import path from "node:path";
import { coverageStats, lessonsForTopic, questionsForTopic } from "../src/content";
import { SYLLABUS_VERSION } from "../src/content/syllabus";

const stats = coverageStats();
const lines = [
  "# Syllabus coverage",
  "",
  `Generated: ${new Date().toISOString().slice(0, 10)}`,
  "",
  `Current syllabus: **${SYLLABUS_VERSION.current}** (published ${SYLLABUS_VERSION.currentPublished})`,
  `Proposed syllabus: ${SYLLABUS_VERSION.proposed} (published ${SYLLABUS_VERSION.proposedPublished})`,
  "",
  `Status: **${stats.complete} complete**, ${stats.partial} partial, ${stats.missing} missing of ${stats.total} topics.`,
  "",
  "A topic is *complete* when at least one lesson and at least four practice questions map to it.",
  "",
  "| Topic | Area | Status | Lessons | Questions | Reference |",
  "|---|---|---|---:|---:|---|",
];
for (const row of stats.rows) {
  lines.push(
    `| ${row.topic.title} (\`${row.topic.id}\`) | ${row.topic.areaId} | ${row.status} | ${lessonsForTopic(row.topic.id).length} | ${questionsForTopic(row.topic.id).length} | ${row.topic.reference} |`,
  );
}
lines.push(
  "",
  "## Source verification",
  "",
  `- IPA SG exam overview: ${SYLLABUS_VERSION.sources[0].url}`,
  `- Current syllabus: ${SYLLABUS_VERSION.sources[2].url}`,
  `- Proposed 2027 syllabus: ${SYLLABUS_VERSION.sources[3].url}`,
  `- Public questions: ${SYLLABUS_VERSION.sources[4].url}`,
  `- Verified at: ${SYLLABUS_VERSION.verifiedAt}`,
  "",
  "Coverage is computed from content mappings; it is not a claim of official endorsement.",
);
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync(path.join("docs", "COVERAGE.md"), lines.join("\n"));
console.log(`wrote docs/COVERAGE.md (${stats.complete}/${stats.total} complete)`);
