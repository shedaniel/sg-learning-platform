# Decisions

## 2026-10-24 — Scope baseline

- **Current syllabus is Ver.4.1** (published 2025-04-17). The 2027 new-exam syllabus is Ver.0.1 (published 2026-09-30) and is shown only as a clearly labelled proposal. It is not treated as examinable today.
- **Exam structure**: 60 questions / 120 minutes; 科目A 48 four-choice, 科目B 12 multiple-choice. The mock exam mirrors this composition but reports raw accuracy only. IPA uses IRT; no attempt is made to reproduce scaled scores or pass/fail.
- **Official questions**: only the four IPA public sets (2023–2026, 15 questions each) are included. They are never presented as complete past exams. Attribution, year, question number, booklet URL, and answer-key URL are stored per question. Figures are re-expressed as equivalent tables/lists; original PDFs remain the authority.
- **Original questions** are labelled `本サイト独自問題`; official questions are never mixed silently.

## Stack

- Next.js 16 App Router, React 19, TypeScript 5.9, Tailwind CSS 4.
- SQLite via Node's built-in `node:sqlite` (`DatabaseSync`) instead of an external ORM/native module. Rationale: zero native build friction on Node 26, one dependency less, explicit SQL migrations. Drizzle/Turso was suggested in PLAN.md, not mandatory; the data model is portable.
- Progress is server-persisted in `data/sg.db` keyed by an anonymous HttpOnly cookie (`sg_profile`), set in middleware. No account, email, or third-party analytics.
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

- coss ui was reviewed as the suggested component source in PLAN.md. It is a shadcn/Base UI copy-paste registry, not a runtime dependency.
- It was not adopted wholesale because its style preset installs Inter/Geist fonts and its own color tokens, which conflicts with the later requirement to avoid special fonts and reduce decorative/green styling. The app already has accessible Tailwind primitives tuned to the Japanese textbook layout.
- If coss components are wanted later, migrate individual primitives (Button, Field, Select, Dialog, Tabs) without importing `@coss/style` or its fonts. This is a UI refactor, not a correctness gap.

## Deliberate limits

- No AI tutor/chat. PLAN.md allows optional AI, but the core must work without paid AI; adding an ungrounded tutor would weaken trust.
- No user login/multi-device sync in this version. The anonymous profile is local to the deployment.
- Official question diagrams are not pixel-identical; they are semantically equivalent tables/text. The IPA PDF link is shown on each source card.
- Raw mock scores are not converted into IPA evaluation points or pass probability.
