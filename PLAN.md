# Build a Complete Japanese SG Certification Learning Platform

You are a senior full-stack engineer, instructional designer, UI/UX designer, and Japanese IT certification subject-matter expert.

Build a complete, polished, production-quality web application to help me study for the Japanese **情報セキュリティマネジメント試験 (SG)** administered by IPA.

The product should be a comprehensive interactive textbook, learning platform, and examination practice system — not simply a flashcard app or question bank.

## 1. Learner Background and Product Goals

The primary user is:

- A final-year computer science student and working software engineer.
- Familiar with programming, databases, networking, backend systems, and basic cybersecurity.
- Has passed JLPT N2, but is not fully comfortable reading complex Japanese technical and business terminology.
- Wants to take the SG examination entirely in Japanese.
- Wants to learn the complete examination syllabus efficiently, understand the concepts properly, and become confident answering actual Japanese examination questions.

The application should help the learner progress through:

**Understand → Visualize → Practice → Review → Master → Pass**

The goal is mastery of the actual SG syllabus, not just memorizing answers.

## 2. Official Sources and Syllabus Coverage

Use the official IPA website as the primary source of truth:

- SG overview: https://www.ipa.go.jp/shiken/kubun/sg.html
- SG examination topics: https://www.ipa.go.jp/shiken/kubun/sg/outline.html
- Official past questions: https://www.ipa.go.jp/shiken/mondai-kaiotu/
- Examination syllabuses: https://www.ipa.go.jp/shiken/syllabus/
- Proposed new examination syllabus: https://www.ipa.go.jp/shiken/syllabus/henkou/2026/20260630.html

Retrieve and inspect the official examination syllabus, relevant published questions, and answer keys.

**Important:** The syllabus and examination structure may change. Check the latest official information rather than relying on assumptions. Distinguish currently effective syllabuses from proposed revisions. Record source URLs, versions, and verification dates.

Organize learning content according to the official syllabus, ensuring complete coverage of every examinable subtopic.

Suggested high-level curriculum:

1. Information Security Fundamentals
   - CIA triad
   - Information assets
   - Threats and vulnerabilities
   - Malware
   - Cyberattacks
   - Authentication and authorization
   - Cryptography and hashing

2. Security Risk Management
   - Risk identification and analysis
   - Risk assessment
   - Risk avoidance, reduction, transfer, acceptance
   - Risk matrices and evaluation
   - Security controls

3. Information Security Management
   - ISMS
   - ISO/IEC 27000 family
   - PDCA
   - Security policies
   - Information asset management
   - Security governance and compliance

4. Technical Security Measures
   - Firewalls
   - IDS/IPS
   - VPN
   - TLS
   - Authentication protocols
   - Access management
   - Endpoint security
   - Cloud security
   - Network security

5. Security Operations
   - Incident handling
   - CSIRT
   - Security monitoring
   - Logging
   - Vulnerability management
   - Business continuity
   - Backups, RPO and RTO

6. Japanese Laws, Standards and Guidelines
   - 個人情報保護法
   - 不正アクセス禁止法
   - サイバーセキュリティ基本法
   - Intellectual property
   - Relevant Japanese regulations and standards

7. Organizational Security
   - Employee education
   - Outsourcing and vendor management
   - Internal fraud prevention
   - Security audits
   - Human resources and physical security

8. Supporting IT Knowledge
   - Networking
   - Databases
   - System architectures
   - Project management
   - Service management
   - Business and IT strategy

These are initial planning categories, not a substitute for the official syllabus. Expand, reorganize, and subdivide them to match IPA precisely.

## 3. Complete Interactive Textbook

This is the most important feature.

Each topic should be a well-written, thorough chapter, similar to a high-quality textbook but much more interactive.

Every lesson should contain:

### A. Introduction

- Explain what the concept is.
- Explain why it exists and what problem it solves.
- Explain its practical significance.
- Show where it appears within the SG syllabus.
- Explain how it is tested in SG.

### B. Detailed Explanation

Provide comprehensive explanations structured into small, readable sections.

Use:

- Paragraph explanations
- Point-form summaries
- Comparison tables
- Real-world examples
- Technical demonstrations
- Relevant scenarios
- Common misconceptions
- Examination tips

Do not give only brief definitions. Teach concepts sufficiently for a learner to understand and apply them.

### C. Visual Learning

Use diagrams and visualizations whenever they materially improve understanding.

Examples:

- CIA triad diagram
- Risk matrix
- Network firewall architecture
- TLS connection flow
- Public/private key encryption
- Authentication flow
- Malware attack chain
- Incident response lifecycle
- ISMS PDCA cycle
- Backup architecture
- RPO/RTO timeline
- Security responsibility matrix

Use Mermaid, SVG, or interactive React components where appropriate.

Visualizations should be clear, accurate, responsive, and readable. Avoid decorative diagrams that do not teach anything.

### D. Japanese Terminology Support

Japanese must be the primary learning language, because the real examination is Japanese.

However, implement optional English learning assistance.

For every important concept, display:

- Japanese term
- Reading, where helpful
- English equivalent
- Japanese explanation
- Optional English explanation
- Example of examination usage

Example:

**可用性（かようせい） — Availability**

日本語: 必要なときに情報やシステムを利用できる性質。

English: The property of a system or information being accessible when needed.

Provide clickable inline term explanations and a searchable vocabulary dictionary.

Avoid translating every sentence automatically by default. The learner should gradually become comfortable with Japanese terminology.

### E. Interactive Examples

Where appropriate, allow the user to manipulate variables and see results.

Examples:

- Change probability and impact in a risk matrix.
- Simulate different backup intervals and resulting data loss.
- Compare different access control policies.
- Explore a simplified attack and defense scenario.
- Match security controls to corresponding risks.

### F. Lesson Summary

At the end of each lesson include:

- Key concepts to remember
- Important Japanese terminology
- Common examination traps
- Connections to related topics
- A short checklist of knowledge the learner should now understand

## 4. Topic-Level Quizzes

Every lesson and subtopic must include its own quiz.

Requirements:

- Questions written in natural Japanese.
- Realistic wording similar to IPA examinations.
- Four-option multiple-choice questions for appropriate 科目A content.
- Scenario-based questions for 科目B.
- Easy, medium, and hard difficulty levels.
- Randomized question ordering.
- Question counts configurable by the user.
- Immediate or end-of-quiz feedback modes.

After answering:

- Show whether the answer is correct.
- Explain why it is correct.
- Explain why each other option is incorrect.
- Provide optional English explanations.
- Link back to the relevant learning material.
- Explain the Japanese terminology involved.

Track question attempts and identify weak areas.

Do not generate trivially obvious distractors. Wrong options should be plausible enough to test understanding.

## 5. Comprehensive Question Bank

Create a structured question bank supporting:

- Questions organized by syllabus topic and subtopic
- Difficulty
- 科目A / 科目B
- Official versus original questions
- Source year
- Past-paper reference
- Question type
- Correct answer
- Detailed explanation
- Tags and knowledge requirements

The question bank must be persistent and expandable.

Original practice questions should be accurate, varied, and independently validated.

Avoid repetitive questions that test exactly the same concept with only minor wording changes.

## 6. Official Past Papers

Implement a dedicated past-paper section.

Retrieve all available official IPA SG past/publicly released questions from the authoritative source, including available question booklets and answer keys.

Critical requirements:

- Never fabricate official questions.
- Clearly identify officially published questions.
- Preserve original Japanese wording when reproducing a permitted official question.
- Preserve diagrams, tables, and answer choices accurately.
- Retain the publication year, question number, original document URL, and source attribution.
- Check IPA's reuse conditions and comply with them.
- Associate questions with the correct official answer key.
- Mark any unavailable questions as unavailable rather than inventing their contents.

The current CBT examination publishes only subsets of actual questions, rather than complete historical CBT exams. Do not represent those subsets as full official examinations.

Where a complete historical examination exists and its reuse is allowed, provide the complete original examination.

Allow:

- Practice by year
- Practice individual questions
- Review correct answers and explanations
- Browse questions by topic
- Identify repeated themes across years

## 7. Full Examination Simulator

Implement a realistic mock examination experience.

Reflect the actual IPA SG examination structure, currently:

- 120-minute time limit
- 60 questions
- 科目A and 科目B content
- Multiple-choice format

Validate these details against the latest official IPA information.

Features:

- Full-screen distraction-free exam mode
- Countdown timer
- Question navigation
- Flag questions for review
- Answer selection
- Unanswered question indicators
- Submit examination
- Auto-submit when time expires
- Confirmation before early submission
- Persist progress against accidental refresh

After submitting, show:

- Correct and incorrect answers
- Estimated raw accuracy
- Scores by topic
- Time spent per question
- Weak areas
- Detailed explanations
- Suggested revision topics

Do not misrepresent mock scores as official IPA scores. IPA uses IRT-based scaled scoring; without access to the official scoring model, report raw accuracy and clearly label any estimated readiness score as unofficial.

## 8. Adaptive Learning and Progress Tracking

Implement persistent learning progress.

Track:

- Lessons started
- Lessons completed
- Topic mastery
- Questions attempted
- Correct/incorrect history
- Response times
- Vocabulary learned
- Repeated mistakes
- Mock examination scores
- Study activity

A learner should be able to leave and return without losing progress.

Create a dashboard displaying:

- Overall syllabus completion
- Topic completion
- Strengths and weaknesses
- Recent quiz results
- Examination readiness estimate
- Recommended next lesson
- Suggested review questions

Implement spaced repetition for forgotten concepts and incorrectly answered questions.

Allow users to mark terms and lessons for later review.

Mastery should depend on demonstrated understanding over multiple attempts, rather than automatically marking a topic mastered after reading a page.

## 9. Personalized Study Plan

Provide a study-plan generator.

Allow users to configure:

- Target examination date
- Study time per day
- Days per week
- Current familiarity with IT
- Japanese reading confidence

Generate a realistic preparation schedule.

Adapt the schedule as the learner progresses.

Prioritize weak areas, while still revisiting previously mastered subjects.

## 10. Search and Glossary

Provide a global search system supporting:

- Japanese terms
- English terms
- Abbreviations
- Topics
- Lessons
- Questions
- Laws and standards

Example searches:

- 可用性
- Availability
- CIA
- ISMS
- リスク移転
- CSIRT

The glossary should link concepts directly to related lessons and questions.

## 11. User Interface and Experience

The product should feel like a modern, premium educational application rather than an ordinary administrative dashboard.

Design direction:

- Clean, modern, minimal
- Excellent typography, including Japanese text
- Clear content hierarchy
- Generous whitespace
- Comfortable reading width
- Dark and light themes
- Responsive design
- Smooth but restrained animations
- Accessible keyboard and screen-reader support

Suggested application sections:

**Dashboard**
Study overview, progress, learning recommendations, recent performance.

**Learn**
Structured curriculum and comprehensive lessons.

**Practice**
Topic quizzes, custom quizzes, weak-area practice.

**Past Papers**
Official question collections organized by year.

**Mock Exam**
Realistic timed exam simulation.

**Review**
Mistakes, bookmarked questions, spaced repetition.

**Glossary**
Japanese and English terminology dictionary.

**Statistics**
Mastery, accuracy, trends, and exam readiness.

Prefer visual progress indicators, charts and useful diagrams over dense text-only navigation.

Optimize the learning interface for extended reading sessions on desktop, while keeping mobile support functional.

## 12. Technical Implementation

Inspect the existing repository before selecting a stack. Reuse existing technologies and patterns where appropriate.

For a new project, a suggested stack is:

- Next.js
- TypeScript
- React
- Tailwind CSS
- https://coss.com/ui/llms.txt
- MDX for educational content
- Mermaid and SVG for diagrams
- SQLite with Turso with a suitable ORM, locally using Docker to test
- Recharts or similar for statistics
- A test runner such as Vitest
- Playwright for end-to-end testing

Prefer deterministic, version-controlled, human-reviewed lesson content and question records rather than generating the entire educational experience dynamically through an LLM.

The core application must work without paid AI services.

If AI-powered explanations or tutoring are introduced, make them optional, grounded in the course material, and clearly distinguish generated explanations from authoritative content.

Design the codebase to support additional IPA certifications such as FE and AP later, without including them in the initial curriculum.

## 13. Data Architecture

Use a maintainable content structure.

Suggested entities:

- Examination
- SyllabusVersion
- Topic
- Subtopic
- Lesson
- LessonSection
- GlossaryTerm
- Question
- QuestionOption
- QuestionSource
- QuestionExplanation
- QuizAttempt
- QuestionAttempt
- MockExamAttempt
- StudySession
- UserProgress
- TopicMastery
- ReviewSchedule

Questions should be traceable to topics and their sources.

Design a clean way to add or update lesson content without manually editing application UI code.

## 14. Content Quality Requirements

Educational content quality is as important as software quality.

Do not populate the application with empty chapters, superficial AI-generated paragraphs, or repeated generic explanations.

Each lesson should genuinely teach the subject.

For each chapter:

1. Research the relevant syllabus topic.
2. Gather authoritative reference material.
3. Write an accurate Japanese explanation.
4. Add meaningful English terminology support.
5. Create diagrams where appropriate.
6. Add realistic examples.
7. Create topic-specific practice questions.
8. Verify question answers and explanations.
9. Link the content to the relevant syllabus items.

Use authoritative sources, and include source references where appropriate.

Every intended syllabus topic must have a clear coverage status so missing material is visible.

## 15. Development and Verification

Build an actual working application, not just a mockup or design proposal.

Implement the complete learning and examination workflows.

Use real content wherever official materials are available and accurately sourced original material elsewhere.

Avoid nonfunctional buttons and fake statistics.

Include:

- Database schema and migrations
- Seed/import scripts
- Content validation
- Tests for exam logic
- Tests for scoring
- Tests for progress persistence
- Responsive UI verification
- Documentation for setup and running locally

Test critical flows:

1. Open a lesson and read its content.
2. Interact with diagrams and vocabulary explanations.
3. Complete a topic quiz.
4. Review detailed feedback.
5. Resume saved progress.
6. Take a timed mock exam.
7. Review results and weak topics.
8. Open an official past question and verify its source.

Do not claim completeness unless the relevant features and educational content actually exist.

## 16. Implementation Priorities

Work in this order:

**Phase 1 — Foundation**
Establish the syllabus structure, content models, design system, navigation, and database.

**Phase 2 — Learning Experience**
Implement the complete lesson renderer, glossary, diagrams, interactive examples, and the first substantive chapters.

**Phase 3 — Practice**
Implement topic quizzes, question bank, explanations, persistence, and mistake tracking.

**Phase 4 — Official Questions**
Implement IPA source ingestion, source verification, and past-paper browsing.

**Phase 5 — Mock Exam**
Implement the complete timed exam simulator and results reporting.

**Phase 6 — Progress and Adaptation**
Implement the dashboard, mastery tracking, spaced repetition, recommendations, and study plans.

**Phase 7 — Curriculum Completion**
Fill remaining syllabus gaps, validate content coverage, improve diagrams and explanations, and complete testing.

Prioritize fully working end-to-end features over unfinished scaffolding.

Keep a record of implemented features, coverage gaps, and any content that requires verification.

## Final Objective

Deliver a system that can genuinely replace the need for a conventional SG preparation textbook for the targeted syllabus, while adding interactive visualizations, practice, progress tracking, and Japanese language assistance.

The result should help a technically knowledgeable learner become comfortable with SG's Japanese security terminology and confidently solve both knowledge-based and scenario-based examination questions.

Start by researching the current official IPA SG syllabus, examining the repository, establishing the data and content architecture, and implementing the application. Do not stop at a proposal or UI mockup.
