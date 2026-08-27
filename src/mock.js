const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

const db = {
  institution: {
    id: 1,
    name: 'Sunrise Coaching Institute',
    subject_default: 'Physics',
    strictness_default: 'moderate',
    branding_json: {},
    pricing_tier: 'demo',
  },
  rubric: {
    subject_name: 'Physics',
    question_list_json: [
      {
        question_number: 1,
        max_marks: 5,
        model_answer: "State Newton's second law and derive F = ma from momentum.",
        rubric_points: [
          { point: 'States law correctly', marks: 2 },
          { point: 'Derivation from dp/dt', marks: 2 },
          { point: 'Correct units/notation', marks: 1 },
        ],
        acceptable_alternatives: 'Vector form accepted',
      },
      {
        question_number: 2,
        max_marks: 5,
        model_answer: 'Define work-energy theorem with one worked example.',
        rubric_points: [
          { point: 'Correct statement', marks: 2 },
          { point: 'Valid example with numbers', marks: 3 },
        ],
        acceptable_alternatives: '',
      },
      {
        question_number: 3,
        max_marks: 10,
        model_answer: 'Projectile motion: derive range formula and compute for given values.',
        rubric_points: [
          { point: 'Resolves components', marks: 3 },
          { point: 'Derives R = u²sin2θ/g', marks: 4 },
          { point: 'Correct numerical answer', marks: 3 },
        ],
        acceptable_alternatives: 'Alternative derivation via time of flight accepted',
      },
    ],
  },
  tests: [
    {
      id: 1, institution_id: 1, subject_name: 'Physics', test_name: 'Unit Test 3 — Mechanics', test_date: '2026-08-20',
      question_paper_path: 'ut3_question_paper.pdf', answer_key_path: 'ut3_answer_key.pdf', key_status: 'ready',
    },
    {
      id: 2, institution_id: 1, subject_name: 'Physics', test_name: 'Weekly Quiz 12', test_date: '2026-08-25',
      question_paper_path: null, answer_key_path: null, key_status: 'missing',
    },
  ],
  students: [
    { id: 1, institution_id: 1, name: 'Priya Sharma', roll_number: '101' },
    { id: 2, institution_id: 1, name: 'Rahul Verma', roll_number: '102' },
    { id: 3, institution_id: 1, name: 'Ananya Iyer', roll_number: '103' },
  ],
  submissions: [
    { id: 1, test_id: 1, student_id: 1, original_file_path: 'priya_ut3.pdf', status: 'graded' },
    { id: 2, test_id: 1, student_id: 2, original_file_path: 'rahul_ut3.pdf', status: 'graded' },
    { id: 3, test_id: 1, student_id: 3, original_file_path: 'ananya_ut3.pdf', status: 'uploaded' },
  ],
  question_results: {
    1: [
      {
        question_number: 1, marks_awarded: 4, max_marks: 5,
        what_right: 'Law stated correctly with the momentum derivation.',
        what_wrong: 'Units dropped in the final step.',
        what_to_change: 'Always carry units through every line of a derivation.',
        ideal_answer_brief: 'F = dp/dt = ma with consistent SI units.',
        confidence_score: 0.92, topic_tag: 'newtons-laws',
      },
      {
        question_number: 2, marks_awarded: 3, max_marks: 5,
        what_right: 'Theorem stated correctly.',
        what_wrong: 'Example used inconsistent mass values midway.',
        what_to_change: 'Fix the givens before substituting; re-check arithmetic.',
        ideal_answer_brief: 'W_net = ΔKE with a numerically consistent example.',
        confidence_score: 0.85, topic_tag: 'work-energy',
      },
      {
        question_number: 3, marks_awarded: 7, max_marks: 10,
        what_right: 'Component resolution and range derivation both correct.',
        what_wrong: 'Numerical answer off — used g = 10 where the paper specified 9.8.',
        what_to_change: 'Read the constants given in the question before computing.',
        ideal_answer_brief: 'R = u²sin2θ/g ≈ 39.2 m with g = 9.8.',
        confidence_score: 0.88, topic_tag: 'projectile-motion',
      },
    ],
    2: [
      {
        question_number: 1, marks_awarded: 2, max_marks: 5,
        what_right: 'Law stated in words.',
        what_wrong: 'No derivation attempted.',
        what_to_change: 'Practice the dp/dt derivation — it is a standard 2-mark step.',
        ideal_answer_brief: 'F = dp/dt = ma.',
        confidence_score: 0.95, topic_tag: 'newtons-laws',
      },
      {
        question_number: 2, marks_awarded: 5, max_marks: 5,
        what_right: 'Complete statement and a clean worked example.',
        what_wrong: '',
        what_to_change: '',
        ideal_answer_brief: 'W_net = ΔKE with example.',
        confidence_score: 0.97, topic_tag: 'work-energy',
      },
      {
        question_number: 3, marks_awarded: 4, max_marks: 10,
        what_right: 'Components resolved correctly.',
        what_wrong: 'Range formula misremembered (sinθ instead of sin2θ), wrong final answer.',
        what_to_change: 'Re-derive rather than recall — the derivation was worth more than the formula.',
        ideal_answer_brief: 'R = u²sin2θ/g.',
        confidence_score: 0.9, topic_tag: 'projectile-motion',
      },
    ],
  },
  history: {
    1: [
      { test_id: 3, test_name: 'Unit Test 1', test_date: '2026-07-10', total_marks: 14, max_marks: 20, percentage: 70 },
      { test_id: 4, test_name: 'Unit Test 2', test_date: '2026-07-28', total_marks: 15, max_marks: 20, percentage: 75 },
      { test_id: 1, test_name: 'Unit Test 3 — Mechanics', test_date: '2026-08-20', total_marks: 14, max_marks: 20, percentage: 70 },
    ],
    2: [
      { test_id: 3, test_name: 'Unit Test 1', test_date: '2026-07-10', total_marks: 9, max_marks: 20, percentage: 45 },
      { test_id: 4, test_name: 'Unit Test 2', test_date: '2026-07-28', total_marks: 12, max_marks: 20, percentage: 60 },
      { test_id: 1, test_name: 'Unit Test 3 — Mechanics', test_date: '2026-08-20', total_marks: 11, max_marks: 20, percentage: 55 },
    ],
    3: [
      { test_id: 3, test_name: 'Unit Test 1', test_date: '2026-07-10', total_marks: 16, max_marks: 20, percentage: 80 },
      { test_id: 4, test_name: 'Unit Test 2', test_date: '2026-07-28', total_marks: 17, max_marks: 20, percentage: 85 },
    ],
  },
}

let nextId = 100

// Keep the gradebook honest: when a submission finishes grading, upsert the
// score into that student's history so ClassRecord/StudentHistory reflect it.
function recordHistory(sub) {
  const test = db.tests.find((t) => t.id === sub.test_id)
  const results = db.question_results[sub.id] || []
  const total_marks = results.reduce((a, q) => a + q.marks_awarded, 0)
  const max_marks = results.reduce((a, q) => a + q.max_marks, 0)
  const entry = {
    test_id: sub.test_id,
    test_name: test?.test_name || `Test #${sub.test_id}`,
    test_date: test?.test_date || '',
    total_marks,
    max_marks,
    percentage: max_marks ? Math.round((total_marks / max_marks) * 100) : 0,
  }
  const hist = (db.history[sub.student_id] ||= [])
  const i = hist.findIndex((h) => h.test_id === sub.test_id)
  if (i >= 0) hist[i] = entry
  else hist.push(entry)
}

export const mockApi = {
  async createInstitution(body) {
    await delay()
    db.institution = { ...db.institution, ...body, id: 1 }
    return db.institution
  },
  async getInstitution() {
    await delay()
    return { ...db.institution, rubric: db.rubric }
  },
  async saveRubric(_id, body) {
    await delay()
    db.rubric = body
    return { ok: true }
  },
  async createTest(body) {
    await delay()
    const test = {
      id: nextId++,
      question_paper_path: null,
      answer_key_path: null,
      key_status: 'missing',
      ...body,
    }
    db.tests.push(test)
    return test
  },
  async listTests() {
    await delay()
    return db.tests
  },
  async getTest(id) {
    await delay()
    const test = db.tests.find((t) => t.id === Number(id))
    if (!test) throw new Error('Test not found')
    return {
      ...test,
      question_list: test.key_status === 'ready'
        ? test.question_list || db.rubric.question_list_json
        : null,
    }
  },
  async uploadTestMaterials(testId, { question_paper, answer_key }) {
    await delay(400)
    const test = db.tests.find((t) => t.id === Number(testId))
    if (!test) throw new Error('Test not found')
    if (question_paper) test.question_paper_path = question_paper.name
    if (answer_key) test.answer_key_path = answer_key.name
    test.key_status = 'parsing'
    setTimeout(() => {
      test.key_status = 'ready'
      test.question_list = db.rubric.question_list_json.map((q) => ({ ...q }))
    }, 3500)
    return { ...test }
  },
  async uploadSubmission(testId, { student_name, roll_number, file }) {
    await delay(500)
    let student = db.students.find((s) => s.roll_number === roll_number)
    if (!student) {
      student = { id: nextId++, institution_id: 1, name: student_name, roll_number }
      db.students.push(student)
    }
    const sub = {
      id: nextId++,
      test_id: Number(testId),
      student_id: student.id,
      original_file_path: file?.name || 'upload.pdf',
      status: 'uploaded',
    }
    db.submissions.push(sub)
    setTimeout(() => { sub.status = 'processing' }, 1500)
    setTimeout(() => {
      sub.status = 'graded'
      db.question_results[sub.id] = db.question_results[1].map((q) => ({ ...q }))
      recordHistory(sub)
    }, 5000)
    return sub
  },
  async listSubmissions(testId) {
    await delay()
    return db.submissions
      .filter((s) => s.test_id === Number(testId))
      .map((s) => ({ ...s, student: db.students.find((st) => st.id === s.student_id) }))
  },
  async triggerGrade(id) {
    await delay()
    const sub = db.submissions.find((s) => s.id === Number(id))
    if (sub) sub.status = 'processing'
    setTimeout(() => {
      if (sub) {
        sub.status = 'graded'
        db.question_results[sub.id] ||= db.question_results[1].map((q) => ({ ...q }))
        recordHistory(sub)
      }
    }, 3000)
    return { ok: true }
  },
  async getSubmission(id) {
    await delay()
    const sub = db.submissions.find((s) => s.id === Number(id))
    if (!sub) throw new Error('Submission not found')
    return {
      ...sub,
      student: db.students.find((st) => st.id === sub.student_id),
      test: db.tests.find((t) => t.id === sub.test_id),
      question_results: db.question_results[sub.id] || [],
      annotated_pdf_url: sub.status === 'graded' ? '#mock-pdf' : null,
    }
  },
  async getStudentHistory(id) {
    await delay()
    const student = db.students.find((s) => s.id === Number(id))
    return { student, results: db.history[id] || [] }
  },
  async listStudents() {
    await delay()
    return db.students
  },
}
