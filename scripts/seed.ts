import { ALL_LESSONS, ALL_QUESTIONS, ALL_TERMS, AREAS, OFFICIAL_PAPERS } from "../src/content";
import { SYLLABUS_VERSION } from "../src/content/syllabus";
import { setMeta } from "../src/lib/db/store";

async function main() {
  await setMeta("content.seeded_at", new Date().toISOString());
  await setMeta("content.version", SYLLABUS_VERSION.current);
  await setMeta("content.areas", String(AREAS.length));
  await setMeta("content.lessons", String(ALL_LESSONS.length));
  await setMeta("content.terms", String(ALL_TERMS.length));
  await setMeta("content.questions", String(ALL_QUESTIONS.length));
  await setMeta("content.official_papers", String(OFFICIAL_PAPERS.length));
  await setMeta("syllabus.proposed", SYLLABUS_VERSION.proposed);
  await setMeta("syllabus.verified_at", SYLLABUS_VERSION.verifiedAt);

  console.log(
    `seeded metadata: ${AREAS.length} areas, ${ALL_LESSONS.length} lessons, ${ALL_TERMS.length} terms, ${ALL_QUESTIONS.length} questions`,
  );

}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
