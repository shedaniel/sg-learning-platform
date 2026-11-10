# Verification record

Verified: **2026-10-24** (local, macOS arm64, Node 26.7.0, Next 16.4.3)

## Source verification

| Item | Source | Result |
|---|---|---|
| Exam structure (60Q / 120min; A48/B12) | https://www.ipa.go.jp/shiken/kubun/sg.html and `/sg/outline.html` | Confirmed |
| Current syllabus Ver.4.1 | https://www.ipa.go.jp/shiken/syllabus/nl10bi0000007tch-att/syllabus_sg_ver4_1.pdf | Confirmed, published 2025-04-17 |
| Proposed 2027 syllabus Ver.0.1 | https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html | Confirmed, published 2026-09-30; labelled proposal only |
| CBT public questions 2023–2026 | https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/index.html | 4 sets × 15 questions ingested |
| Answer keys 2023–2026 | IPA answer-key PDFs per year | Correct ids checked against official keys |
| Paper exams 2016–2019 | IPA year pages (`2016h28` … `2019h31`) | 8 complete exam PDFs indexed; scanned, no text layer, so linked rather than transcribed |
| 2020–2022 CBT questions | IPA notice | Non-public; not represented as available |

Official question counts: **60** (48 A + 12 B), from four public sets. Each carries `source.attribution`, year, question number, and page/booklet URL.

Historical archive: 8 paper exams (2016 spring/autumn, 2017 spring/autumn, 2018 spring/autumn, 2019 spring/autumn), each with 午前 and 午後 booklets + answer PDFs. These are **not** transcribed into the app because the PDFs are image-based; the UI explicitly marks this.

## Content validation

`npm run validate:content`:

```
エリア: 8
レッスン: 27
用語: 363
問題: 566 (科目A 400 / 科目B 166)
公式問題: 60 / 4 年分
シラバス: 51/51 complete, 0 partial, 0 missing
✓ コンテンツ検証に合格しました
```

Validated: unique IDs, topic/lesson/term references, four-option original questions, correct option membership, all distractor explanations, ≥8 questions and ≥2 科目B questions per lesson, official source metadata, diagram/widget registry, required sources, coverage thresholds.

## Automated tests

`npm test` — **27 tests passed** across 4 files:

- mock composition (48 A + 12 B, uniqueness, deterministic seed, short bank);
- scoring (correct/unanswered/time/part/topic/difficulty);
- readiness weighting;
- quiz filtering/grading;
- SRS intervals and lapse behavior;
- migrations and schema uniqueness;
- content integrity, official papers and answer keys, 51/51 coverage, historical archive.

`npm run test:e2e` — **11 Playwright tests passed** (final production build):

1. dashboard + learning map;
2. lesson read, completion persistence after reload;
3. glossary search + term detail;
4. global search;
5. topic quiz instant feedback;
6. end-of-quiz result;
7. official past-paper source verification;
8. mock exam start, answer, submit, results;
9. mock answer survives refresh (autosave);
10. review/coverage pages;
11. wrong answer enters spaced-repetition queue.

## Manual/visual checks

- Desktop 1440px light and dark; mobile 390px.
- coss ui visual system: Cal Sans 2.010 + Paper Mono, coss tokens, neutral primary actions, coss Button/Badge/Card/Progress/Empty/Kbd primitives, no green panels or decorative animations. Vendor source is the MIT `apps/ui` registry; fonts are OFL.
- Sidebar, header, search, theme toggle, mobile menu.
- Lesson rendering, sticky TOC, terms, callouts, tables.
- SVG diagrams (22) and interactive widgets (8): risk matrix, backup planner, hash demo, subnet calculator exercised in browser; widget renderer maps all IDs.
- Official question source card and IPA links.
- Production build (`npm run build`) succeeded: 30 routes, static `/about`, `/coverage`, `/past-papers`; dynamic DB-backed routes.

## Known gaps / not claimed

- Official question diagrams are semantically equivalent tables/lists, not pixel-identical.
- Historical 2016–2019 PDFs are image-only; questions are not searchable in-app.
- Mock scores are raw accuracy; no IRT evaluation or pass prediction.
- Readiness is a heuristic; confidence is low under 40 attempts.
- No accounts/multi-device sync; profile is tied to an anonymous local cookie.
- 2027 proposal items are not treated as current examinable content.
- AI explanations/tutoring are intentionally not included.
