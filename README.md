# SG Learning Platform

A Japanese-first, interactive study platform for the IPA **情報セキュリティマネジメント試験 (SG)**. It combines a syllabus-mapped textbook, visual explanations, topic quizzes, official IPA public questions, spaced repetition, a 60-question timed mock exam, and progress analytics.

> This is an unofficial study site. It is not affiliated with IPA. Exam structure and syllabus information were verified against IPA sources on **2026-10-24**.

## What is implemented

- **Interactive textbook** — 27 lessons across 8 areas, with objectives, detailed Japanese explanations, comparison tables, worked numeric examples, inline glossary links, exam traps, key points, and cited sources.
- **Visual learning** — 22 hand-authored SVG diagrams (CIA, risk process/matrix, PDCA/ISMS, TLS, PKI, DMZ, kill chain, incident response, backup 3-2-1, RPO/RTO, access control, auth factors, cloud responsibility, supply chain, zero trust, hash/signature, data lifecycle, audit flow, BCP, network path), theme-aware and server-rendered.
- **Interactive examples** — 8 simulators: risk matrix, backup planner, access matrix, SHA-256 avalanche demo, incident triage, control matcher, CIA impact, subnet calculator.
- **Question bank** — 506 original questions (科目A/科目B, 4 options, plausible distractors, per-option explanations, English support) plus 60 official IPA public questions from 2023–2026, each with attribution and source URL (566 total).
- **Topic quizzes** — configurable range, count, part, difficulty, instant or end-of-quiz feedback, automatic mistake capture and SRS scheduling.
- **Official past papers** — year pages for 2023–2026, 15 public questions per year, clearly labelled as partial (actual exam: 60 questions), with links to the original IPA booklet and answer key.
- **Mock exam** — 48 科目A + 12 科目B, 120 minutes, timer, flags, unanswered indicators, full-screen mode, autosave every 15 seconds, refresh recovery, confirmation before submission, auto-submit on expiry, raw-score results, part/topic/difficulty breakdown, time per question, and revision suggestions.
- **Progress and adaptation** — server-persisted profile chosen by a sync code, lesson/term completion, attempt history, recency-weighted accuracy, topic mastery based on multiple attempts, review queue, bookmarks, a factual 14-day activity log, and a clearly labelled unofficial readiness estimate. There are no streaks, daily quotas, or paced plans; learners choose their own order and pace.
- **Spaced repetition** — SM-2-style intervals with lapse handling; wrong answers are scheduled immediately, correct review answers expand intervals, capped at 180 days.
- **Global search** — Japanese, English, abbreviations, lessons, terms, questions, and syllabus topics.
- **Glossary** — 363 terms with reading, English equivalent, Japanese/English explanations, exam usage, related terms, linked lessons and questions.
- **Syllabus coverage** — all 51 current Ver.4.1 topics are mapped; `/coverage` and `docs/COVERAGE.md` show lesson/question counts and status. The 2027 syllabus proposal is shown separately and is **not** treated as currently examinable.
- **Accessibility and UX** — keyboard focus styles, skip link, ARIA labels/live regions, reduced-motion support, light/dark themes, responsive layout, Japanese typography, print-friendly styles.

## Official exam facts used

- 60 questions, 120 minutes.
- 科目A: 48 four-choice questions; 科目B: 12 multiple-choice/scenario questions.
- IPA uses IRT scaled scoring (600/1000 overall). This app reports **raw accuracy only** and does not predict pass/fail.
- Current syllabus: **Ver.4.1** (published 2025-04-17).
- Proposed 2027 syllabus: **Ver.0.1** (published 2026-09-30), marked as a proposal.

Sources are recorded in `src/content/syllabus.ts` and shown in the UI. Official question reuse follows IPA's published terms; attribution, year, question number, booklet URL, and answer URL are stored per question.

## Stack

- Next.js 16 (App Router), React 19, TypeScript 5.9, Tailwind CSS 4.
- coss ui (Cal.com design system) components, tokens, Cal Sans 2.010, and Paper Mono, vendored under `src/coss/ui/`.
- libSQL (`@libsql/client`): a local SQLite file in development, or a remote [Turso](https://turso.tech) database in production. Same code, one environment variable.
- Vitest for unit/integration tests, Playwright for end-to-end tests.
- coss ui components for shared primitives and actions; custom SVG for diagrams and charts, with no runtime Mermaid/Recharts dependency.
- No paid AI service and no LLM generation at request time.

See `DECISIONS.md` for the reasoning and tradeoffs. coss ui components are vendored from the MIT-licensed `apps/ui/registry`; fonts are SIL OFL 1.1. See `THIRD_PARTY.md`.

## Run locally

Requirements: **Node.js 24+** (Node 26 recommended).

```bash
npm install
npm run dev
# http://127.0.0.1:3000
```

Production:

```bash
npm run build
npm start
```

Database:

```bash
npm run db:migrate   # apply migrations (also runs lazily on first request)
npm run db:seed      # record content metadata
```

By default the database is the local file `data/sg.db` (gitignored). Point the app somewhere else with environment variables (see `.env.example`):

| Variable | Meaning |
|---|---|
| `SG_DB_URL` | `libsql://…` (Turso), `https://…`, or `file:path/to.db`. Takes precedence. |
| `SG_DB_AUTH_TOKEN` | Auth token for a remote database. |
| `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | Accepted as aliases, so Turso's Vercel integration works unchanged. |
| `SG_DB_PATH` | Local file path. Kept for backwards compatibility. |

### Moving progress between databases

Progress is keyed by profile ID, so one learner can be copied from one database to another (for example from your local `data/sg.db` to Turso), renaming it to a readable sync code on the way:

```bash
SG_DB_URL=libsql://… SG_DB_AUTH_TOKEN=… \
  npm run db:import-profile -- --profile <id-in-source> --as <sync-code> [--from data/sg.db] [--dry-run]
```

It is idempotent (existing rows are left alone) and prints per-table counts. `npm run test:e2e` uses its own throwaway database (`test-results/e2e.db`), never `data/sg.db`.

### Deploying with Turso

```bash
turso db create sg-learning
turso db show sg-learning --url          # -> SG_DB_URL
turso db tokens create sg-learning       # -> SG_DB_AUTH_TOKEN
```

Set those two variables on the host (for example Vercel), deploy, and the schema is created on the first request. `npm run db:migrate` runs the same migrations ahead of time, for example from CI. Because pages query the database on every request, create the Turso database in the region closest to your server functions.

Migrations are tracked in a `schema_migrations` table. Databases created by earlier versions (which tracked the version in `PRAGMA user_version`) are adopted automatically without losing data.

## Verify

```bash
npm run validate:content   # schema, references, options, official sources, 51/51 coverage
npm test                   # Vitest: exam scoring, quiz selection, SRS, content integrity
npm run test:e2e           # Playwright: learn, quiz, past papers, mock, review
npm run lint               # TypeScript noEmit
npm run coverage:report    # regenerate docs/COVERAGE.md
```

## Project layout

```
src/
  app/                 routes: dashboard, learn, practice, past-papers, mock, review,
                       glossary, statistics, coverage, search, about, API
  components/          AppShell, lesson renderer, diagrams, widgets, quiz/mock runners
  coss/ui/             vendored coss ui components (MIT) + OFL fonts
  content/
    syllabus.ts        8 areas + 51 syllabus topics + official source metadata
    areas/<area>/      lessons, terms, questions, area index
    official/          2023–2026 IPA public questions with paper metadata
  lib/
    content/           content types, option labels
    db/                migrations, libSQL connection, repositories
    exam.ts            mock composition and scoring
    progress.ts        mastery, readiness, recommendations
    search.ts          cross-content search
scripts/               validation, migration, seed, coverage report
tests/                 Vitest and Playwright suites
docs/                  authoring contracts, coverage report
```

## Content authoring

Content is deterministic, version-controlled TypeScript. Add a lesson, terms, and questions under `src/content/areas/<area>/`, map them to `SyllabusTopic` IDs, and run `npm run validate:content`. See `docs/CONTENT_AUTHORING.md` and `src/content/examples/sample-area.ts`.

Rules enforced by validation include:

- unique IDs; valid topic/lesson/term references;
- 4-option original questions with the correct option and explanations for every distractor;
- ≥8 questions per lesson, ≥2 科目B scenario questions;
- official questions must carry IPA attribution, year, number, and source URL;
- all diagram/widget IDs must exist;
- no missing syllabus topics (threshold: ≥1 lesson and ≥4 questions per topic).

## Data model

`profiles`, `lesson_progress`, `term_progress`, `quiz_attempts`, `question_attempts`, `mock_attempts`, `bookmarks`, `review_items`, `study_sessions`, `content_meta`. Migrations are explicit and versioned in `src/lib/db/migrations.ts`.

Learning history is keyed to a **sync code** that the learner types (for example `taro-sg`); there are no accounts, passwords or emails. Entering the same code in any browser opens the same history, so progress follows you between devices. The `sg_profile` cookie only remembers which code was chosen on this device, and `src/proxy.ts` sends visitors without one to `/profile` (APIs answer 401). An unknown code is created only after an explicit confirmation, so a typo doesn't silently start an empty profile. There is no third-party analytics or ad tracking.

## Known limitations

- Official question figures are re-expressed as equivalent tables/lists, not pixel-identical images. Each question links to the authoritative IPA PDF.
- The public IPA sets contain only 15 of 60 questions per year; the app never presents them as full exams.
- Mock scoring is raw accuracy, not IPA IRT evaluation points. Readiness is an unofficial weighted heuristic, not a pass prediction.
- The 2027 syllabus proposal is informational only.
- Content is Japanese-primary with English terminology support, not full bilingual translation.
- A sync code is not a password: anyone who knows it can open that history. It is meant for a private deployment (for example behind Vercel Deployment Protection), so choose a code that is hard to guess.

## Attribution

- Exam structure, syllabus, and public questions: 独立行政法人情報処理推進機構 (IPA), https://www.ipa.go.jp/shiken/kubun/sg.html.
- Official questions are reproduced from IPA public question booklets with attribution; explanations are original to this project.
- All other lesson text, diagrams, questions, and software are original to this project.
