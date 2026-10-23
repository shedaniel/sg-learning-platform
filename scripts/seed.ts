import { ALL_LESSONS, ALL_QUESTIONS, ALL_TERMS, AREAS, OFFICIAL_PAPERS } from "../src/content";
import { SYLLABUS_VERSION } from "../src/content/syllabus";
import { setMeta } from "../src/lib/db/store";

setMeta("content.seeded_at", new Date().toISOString());
setMeta("content.version", SYLLABUS_VERSION.current);
setMeta("content.areas", String(AREAS.length));
setMeta("content.lessons", String(ALL_LESSONS.length));
setMeta("content.terms", String(ALL_TERMS.length));
setMeta("content.questions", String(ALL_QUESTIONS.length));
setMeta("content.official_papers", String(OFFICIAL_PAPERS.length));
setMeta("syllabus.proposed", SYLLABUS_VERSION.proposed);
setMeta("syllabus.verified_at", SYLLABUS_VERSION.verifiedAt);

console.log(
  `seeded metadata: ${AREAS.length} areas, ${ALL_LESSONS.length} lessons, ${ALL_TERMS.length} terms, ${ALL_QUESTIONS.length} questions`,
);
