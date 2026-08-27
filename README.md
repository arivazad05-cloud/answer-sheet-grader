# GradeSheet.ai — frontend (Ariv's half)

React + Vite + Tailwind frontend for the answer-sheet grading prototype. Built
against the shared API contract.

## Run

```bash
npm install
npm run dev
```

With no `.env` it runs in **mock mode** (banner at the top) — fully demoable
standalone with seeded data. To connect to Arav's FastAPI backend:

```bash
cp .env.example .env   # sets VITE_API_URL=http://localhost:8000
```

## Pages

- `/tests` — create tests (lands on the test page), answer-key status per test
- `/tests/:id` — the teacher flow, in order: **1)** upload question paper + answer key
  (AI parses the key into the marking scheme; sheets stay locked until it's ready),
  **2)** drag-and-drop bulk upload of answer sheets (name/roll auto-guessed from
  filenames like `priya_sharma_101.pdf`), status auto-polls, **3)** per-question
  class record with averages
- `/record` — gradebook: every student's % on every test, class averages
- `/submissions/:id` — per-question marks, remarks, annotated PDF link
- `/students/:id` — score history graph + table
- `/setup` — institute creation + rubric editor (questions, rubric points, alternatives)

## Contract notes for the evening sync

The contract has **no list endpoints for tests or students**. Until that's
agreed, the frontend caches tests it created in `localStorage` and derives the
student list from submissions ([src/api.js](src/api.js)). Proposed additions:

- `GET /institutions/:id/tests`
- `GET /institutions/:id/students`

The classroom flow (test on paper → upload answer key → upload sheets) also
needs **per-test materials endpoints** the contract doesn't have yet:

- `POST /tests/:id/materials` — multipart `answer_key` (+ optional
  `question_paper`); backend parses the key into the subject rubric
  (`question_list_json`) and tracks a `key_status` of
  `missing | parsing | ready` on the test
- `GET /tests/:id` — test + `key_status` + parsed `question_list`

The frontend already calls both (mock mode simulates them); until Arav adds
them, real mode falls back gracefully (no key gate, cache-based test lookup).

Everything else follows the contract as written. All endpoint calls live in
[src/api.js](src/api.js) — nothing else touches the network.
