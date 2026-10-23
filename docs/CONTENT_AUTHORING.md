# Content authoring contract

Every area is a folder `src/content/areas/<area>/` with:

- `index.ts` — replaces the placeholder and exports `area: Area`.
- `lessons.ts` — all lessons for the area (or split into one file per lesson and import them).
- `terms.ts` — glossary terms for the area.
- `questions.ts` — original practice questions for the area.

`src/content/examples/sample-area.ts` is a complete, valid example. Follow its shape.

## Hard rules

1. Primary language is Japanese. English appears in `titleEn`, glossary `en`/`explanationEn`, and question `explanation.english`.
2. Do not fabricate official IPA questions. All area questions are `source.kind: "original"` with attribution `"本サイト独自問題"`.
3. Every question has exactly 4 options with ids `a`, `i`, `u`, `e`; `correctOptionId` exists.
4. Wrong options must be plausible. No joke options, no "all of the above".
5. Every lesson has at least 8 questions, including at least 2 `part: "B"` scenario questions. Questions must cover all `topicIds` of the lesson.
6. Every lesson has 5–8 sections. Each section has at least two substantive blocks. Total Japanese prose per lesson should be roughly 2,500–5,000 characters, not padding.
7. Every lesson includes: objectives, a table or comparison, at least one diagram, at least one callout (`tip`/`trap`/`info`/`example`), keyPoints, examTraps, termIds, and sources.
8. Glossary terms referenced by `{{term:id}}` or `terms` blocks MUST exist in the same area's `terms.ts` and have `lessonIds` containing that lesson.
9. Topic IDs and area IDs must come from `src/content/syllabus.ts`.
10. IDs are globally unique. Prefix terms with the area (e.g. `risk-…`), questions with `q-<area>-…`, lessons with `<area>/…`.
11. Use only diagram IDs and widget IDs declared in `src/lib/content/types.ts`.
12. No HTML. Inline markup allowed in `p`, `lead`, `callout.text`, `list.items`, table cells:
    - `**bold**`
    - `` `code` ``
    - `{{term:term-id}}` or `{{term:term-id|表示文字}}`
13. Sources must be real, stable URLs. Prefer IPA syllabus, IPA guides, JIS/ISO overview pages, and official Japanese agencies. Do not cite invented pages.
14. Never claim a 2027 syllabus item is currently examinable. If mentioning the 2027 proposal, label it as a proposal.

## Required diagram/widget IDs

Diagrams: see `DiagramId` in `src/lib/content/types.ts`.

Widgets: `risk-matrix`, `backup-planner`, `access-matrix`, `hash-demo`, `incident-triage`, `control-matcher`, `cia-impact`, `subnet-calculator`.

## Area lesson plan (must be followed exactly)

### security (4 lessons)
- `security/cia-and-design` — sec-cia
- `security/threats-and-malware` — sec-threats, sec-malware, sec-fraud
- `security/attacks` — sec-attacks-web, sec-attacks-auth, sec-attacks-network
- `security/crypto-auth` — sec-crypto, sec-auth, sec-evaluation

### risk (3)
- `risk/fundamentals` — risk-basics
- `risk/assessment` — risk-assessment
- `risk/response-continuity` — risk-response, risk-continuity

### management (3)
- `management/policy-isms` — mgmt-policy, mgmt-isms
- `management/governance-org` — mgmt-governance, mgmt-bodies
- `management/incident` — mgmt-incident

### tech (4)
- `tech/access-control` — tech-access
- `tech/network` — tech-network, tech-protocols
- `tech/endpoint-cloud` — tech-endpoint, tech-cloud
- `tech/app-logging` — tech-appsec, tech-logging

### ops (3)
- `ops/monitoring-vuln` — ops-monitoring, ops-vuln
- `ops/incident-response` — ops-incident-response, ops-insurance
- `ops/backup-bcp` — ops-backup, ops-bcp

### law (3)
- `law/privacy` — law-privacy, law-privacy-ops
- `law/cyber-criminal` — law-unauthorized, law-cyber
- `law/ip-contract` — law-ip, law-contract, law-standards-ethics

### org (3)
- `org/human` — org-human, org-hr
- `org/vendor` — org-vendor
- `org/audit-physical` — org-audit, org-physical

### it (4)
- `it/network-db` — it-network, it-db
- `it/systems` — it-system
- `it/management` — it-pm, it-service
- `it/strategy` — it-strategy

## Quality bar

A lesson must teach, not summarize. Concretely:

- Start from a real failure mode or decision a security leader faces.
- Explain mechanisms (why the control works), not just definitions.
- Use SG-style Japanese: 〜である, 〜する, 〜場合がある. Avoid casual speech and marketing language.
- Include at least one numeric/worked example where relevant (risk score, RPO/RTO, availability, subnet, backup window).
- Include exam traps that reflect actual IPA wording confusions.
- Questions should require reasoning; at least 40% medium/hard.

## Validation

Run `npm run validate:content` after writing. It checks types, references, coverage, option integrity, and ID uniqueness. Do not edit files outside your assigned area.
