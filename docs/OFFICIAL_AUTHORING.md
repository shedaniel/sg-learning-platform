# Official past-paper ingestion

## Sources

- Index: https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/index.html
- 2026: https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/2026r08.html
- 2025: https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/2025r07.html
- 2024: https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/2024r06.html
- 2023: https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/2023r05.html

Each published set contains 15 of the 60 questions. Never present a set as a complete exam.

## Required output

One file `src/content/official/<year>.ts` exporting:

```ts
import type { OfficialPaper } from "@/lib/content/types";
export const paper: OfficialPaper = { ... };
```

`OFFICIAL_QUESTIONS` and `OFFICIAL_PAPERS` are assembled in `index.ts` by the integrator. Do not edit `index.ts`.

Question shape follows `Question`, with:

- `id`: `official-<year>-<2-digit question number>`.
- `part`: `"A"` for standard four-choice, `"B"` for case-study/combination questions.
- `type`: `"knowledge"` or `"scenario"`.
- `source.kind`: `"official"`.
- `source.attribution`: `出典：IPA 情報セキュリティマネジメント試験 令和X年度 公開問題 問N`.
- `source.url`: the year page URL.
- `source.year`, `source.questionNo`.
- `source.note`: `"IPA公開問題（実際の試験は60問）"`.
- `presentation`: tables, lists, and case text as `Block[]` when needed. Do not paraphrase official question text.
- `options`: ids `a`,`i`,`u`,`e` for ア〜エ; `o`,`ka`,`ki`,`ku`,`ke`,`ko` for オ〜コ.
- `explanation`: original educational explanation. The correct answer MUST match the official answer key; never infer it independently.
- `lessonIds` / `topicIds`: map to existing IDs in `src/content/syllabus.ts` and `src/content/areas/*`. If uncertain, use the closest topic.

## Answer keys (verified from IPA PDFs)

- 2026: 1ウ 2ア 3ア 4エ 5ウ 6ア 7エ 8イ 9イ 10イ 11ア 12ウ 13エ 14ク 15エ
- 2025: 1エ 2ア 3イ 4ア 5イ 6ア 7エ 8ア 9エ 10ア 11イ 12ウ 13ク 14ウ 15キ
- 2024: 1イ 2エ 3エ 4ウ 5イ 6ウ 7ウ 8ウ 9ウ 10エ 11ア 12ア 13ア 14エ 15イ
- 2023: 1イ 2イ 3ウ 4エ 5エ 6ア 7イ 8イ 9ウ 10ア 11イ 12イ 13エ 14オ 15ウ

Kana → id: ア=a, イ=i, ウ=u, エ=e, オ=o, カ=ka, キ=ki, ク=ku, ケ=ke, コ=ko.

## Fidelity rules

- Use `pdftotext -layout` on the official PDF. Repair only line-break artefacts and obvious OCR spacing.
- Preserve tables as `table` blocks. Preserve case-study labels (a1, a2, …).
- If a diagram is essential and cannot be represented faithfully as text/table, omit the question and list it in `note` as 未収録（図表のみPDF参照）. Never invent a diagram.
- The paper's `publishedCount` must be 15, `actualCount` 60, `questionNumbers` the numbers present, `questions` the ingested ones.
- Add a note that reuse is permitted by IPA with attribution.

## Quality

Explanations must teach the concept, not just restate the key. For each question:

- Explain why the correct answer is correct.
- Explain the key traps in the most plausible distractors.
- Add English support only where it clarifies a term.
- Link relevant glossary term IDs only if they exist; check `src/content/areas/*/terms.ts`.
