# Decisions

## 2026-10-24 — Scope baseline

- **Current syllabus is Ver.4.1** (published 2025-04-17). The 2027 new-exam syllabus is Ver.0.1 (published 2026-09-30) and is shown only as a clearly labelled proposal. It is not treated as examinable today.
- **Exam structure**: 60 questions / 120 minutes; 科目A 48 four-choice, 科目B 12 multiple-choice. The mock exam mirrors this composition but reports raw accuracy only. IPA uses IRT; no attempt is made to reproduce scaled scores or pass/fail.
- **Official questions**: only the four IPA public sets (2023–2026, 15 questions each) are included. They are never presented as complete past exams. Attribution, year, question number, booklet URL, and answer-key URL are stored per question. Figures are re-expressed as equivalent tables/lists; original PDFs remain the authority.
- **Original questions** are labelled `本サイト独自問題`; official questions are never mixed silently.

## Stack

- Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 4.
- ~~SQLite via `node:sqlite`~~ — superseded by the libSQL decision below. Explicit SQL migrations and no ORM remain.
- Progress is server-persisted, keyed by a learner-chosen sync code (see the sync-code decision below). No account, email, or third-party analytics.
- Content is version-controlled TypeScript modules, validated by `scripts/validate-content.ts`, not generated at request time. No paid AI service is required.
- Diagrams are hand-authored inline SVG React components using theme CSS variables. No Mermaid runtime dependency, so diagrams render on the server with no client bundle or hydration cost.
- Charts are small custom SVG components. Recharts was optional in the plan; custom SVG keeps the client bundle lean and theme-aware.
- The official 2026 advanced questions have 8–10 options (ア〜コ). The shared `OptionId` type supports 4–10 options; original questions are still exactly four-choice.

## Content structure

- 8 areas, 27 lessons, each with ≥8 questions (≥2 科目B scenario questions). Lesson IDs are `<area>/<slug>` and URLs are `/learn/<area>/<slug>`.
- Glossary terms are area-prefixed (`sec-`, `risk-`, `mgmt-`, …) to prevent collisions. Cross-area references are allowed only to existing IDs.
- Every lesson maps to one or more syllabus topic IDs. `docs/COVERAGE.md` and `/coverage` are generated from those mappings. "Complete" means ≥1 lesson and ≥4 questions, not a claim of official endorsement.
- Mastery is attempt-based (multiple attempts, accuracy, breadth), never awarded for merely opening a lesson.

## Learner pace (supersedes PLAN.md §9)

- The user explicitly asked not to build a Duolingo-style daily plan or streak. The study-plan generator, daily quotas, streak counter, and "learn 30 minutes every day" language were removed.
- The dashboard now reports factual progress and optional 14-day activity, not targets. Lesson order is free; the only sequencing is the curriculum map and spaced-repetition reviews.
- `study_plans` is retired by migration v2. No gamification badges, streak counts, or daily goals remain.

## Visual direction (2026-10-24)

- Removed fade/stagger animations, backdrop blur, the serif display face, pill buttons, and most tinted accent panels.
- Headings now use the same system sans stack as body text. Green is limited to primary actions, links, focus rings, and data accents; cards and callouts are neutral.
- No streaks, daily goals, or gamified copy. The interface reports state and offers the next useful action.

## coss ui (`coss.com/ui/llms.txt`)

- Adopted as the UI system: token set, color semantics, radius/shadows, Cal Sans 2.010 + Paper Mono fonts, and coss components.
- Source is vendored under `src/coss/ui/` from the coss UI repository and exposed through the `@coss/ui/*` tsconfig alias. Shared primitives in `src/components/ui/primitives.tsx` wrap coss `Button`, `Badge`, `Card`, `Progress`, `Kbd`, and `Empty`. Key actions use coss `Button` directly.
- App-specific reading prose, diagram typography, and layout classes remain in `src/app/globals.css`, built on coss tokens (`bg-background`, `text-muted-foreground`, `bg-card`, `border-input`, `ring`).
- coss components are vendored from the **MIT** `apps/ui/registry/default` tree, not the AGPL `packages/ui` package. Style tokens are implemented locally from the documented token system. Fonts are SIL OFL 1.1. See `THIRD_PARTY.md`; the application itself remains private/unlicensed.

## Deliberate limits

- No AI tutor/chat. PLAN.md allows optional AI, but the core must work without paid AI; adding an ungrounded tutor would weaken trust.
- No accounts or passwords. Multi-device continuity comes from sync codes, which are identity without a secret.
- Official question diagrams are not pixel-identical; they are semantically equivalent tables/text. The IPA PDF link is shown on each source card.
- Raw mock scores are not converted into IPA evaluation points or pass probability.

## libSQL / Turso (2026-11-02)

- The database layer moved from synchronous `node:sqlite` to `@libsql/client` so the same code runs against a local file (development, tests) and a remote Turso database (serverless hosting). Selection is by `SG_DB_URL` (or `TURSO_DATABASE_URL`); `SG_DB_PATH` still works for local files.
- The client is async, so every store function and `getProgressSnapshot` is async. No ORM was added: the SQL strings are unchanged behind a small `Db` facade (`all` / `get` / `run` / `batch`) in `src/lib/db/index.ts`.
- Multi-statement writes (`submitMockAttempt`, `resetProgress`) use `batch`, which is atomic and one network round trip, instead of interactive transactions.
- Migration versions moved from `PRAGMA user_version` (not reliable on remote databases) to a `schema_migrations` table. Existing local databases are adopted from `user_version` on first open. Migration statements are idempotent and the version row is written in the same batch, so concurrent cold starts racing on a fresh database are safe.
- `getProgressSnapshot` issues its independent reads concurrently, and `ensureProfile` is memoised per server process, to keep per-request latency to roughly one round trip against a remote database.
- `question_attempts` queries now break `attempted_at` ties by `rowid`; two answers recorded in the same millisecond previously had undefined order, which affects the "last answer was wrong" logic.
- Tests use temporary file databases, not `:memory:`, because libSQL transactions can open a second connection and an in-memory database would not be shared.

## Sync codes instead of anonymous sessions (2026-11-02)

- Identity is now a sync code the learner types (3-40 chars, `a-z 0-9 _ -`, case-insensitive), not a UUID minted per browser. Entering the same code anywhere opens the same progress. This replaces the anonymous-cookie model and removes the "progress is stuck in one browser" limitation.
- A cookie is still needed because HTTP is stateless, but it only remembers the chosen code on this device. It never creates an identity, so merely visiting the site no longer writes profile rows (previously every cookie-less visit, including health checks and bots, created one).
- `src/proxy.ts` gates everything: pages redirect to `/profile?next=…`, APIs return 401. `next` is restricted to same-site paths. `/profile` and `/api/profile` are exempt.
- Codes are not secrets and there is no rate limiting. That is acceptable only because the deployment sits behind Vercel Deployment Protection; a public deployment would need real accounts. This is the explicit trade-off for the "no accounts" requirement.
- Unknown codes require confirmation before a profile is created, to stop typos from silently starting empty profiles. Old UUID cookies remain valid codes.
- `scripts/import-profile.ts` copies one learner between databases, renaming the profile ID. E2E tests get a unique code per test via a Playwright fixture and run on their own database, because the suite had been writing hundreds of junk profiles into `data/sg.db`.
