import { mockApi } from './mock'

const BASE = import.meta.env.VITE_API_URL
export const MOCK_MODE = !BASE

async function http(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(`${opts.method || 'GET'} ${path} → ${res.status}`)
  return res.json()
}

const json = (body) => ({
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
})

// The contract has no list-tests/list-students endpoints yet (flagged for the
// evening sync). Until then, real mode remembers what this browser created.
const cache = {
  get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || [] } catch { return [] }
  },
  add(key, item) {
    const items = cache.get(key)
    items.push(item)
    localStorage.setItem(key, JSON.stringify(items))
  },
}

const realApi = {
  createInstitution: (body) => http('/institutions', { method: 'POST', ...json(body) }),
  getInstitution: (id) => http(`/institutions/${id}`),
  saveRubric: (id, body) => http(`/institutions/${id}/rubric`, { method: 'PUT', ...json(body) }),

  async createTest(body) {
    const test = await http('/tests', { method: 'POST', ...json(body) })
    cache.add('tests', test)
    return test
  },
  listTests: async () => cache.get('tests'),

  // GET /tests/:id and POST /tests/:id/materials are PROPOSED endpoints
  // (needed for the upload-answer-key-per-test flow) — flag at the evening
  // sync. Until the backend has them, getTest falls back to the local cache.
  async getTest(id) {
    try {
      return await http(`/tests/${id}`)
    } catch {
      return cache.get('tests').find((t) => t.id === Number(id)) || null
    }
  },
  uploadTestMaterials(testId, { question_paper, answer_key }) {
    const form = new FormData()
    if (question_paper) form.append('question_paper', question_paper)
    if (answer_key) form.append('answer_key', answer_key)
    return http(`/tests/${testId}/materials`, { method: 'POST', body: form })
  },

  uploadSubmission(testId, { student_name, roll_number, file }) {
    const form = new FormData()
    form.append('file', file)
    form.append('student_name', student_name)
    form.append('roll_number', roll_number)
    return http(`/tests/${testId}/submissions`, { method: 'POST', body: form })
  },
  listSubmissions: (testId) => http(`/tests/${testId}/submissions`),

  triggerGrade: (id) => http(`/submissions/${id}/grade`, { method: 'POST' }),
  getSubmission: (id) => http(`/submissions/${id}`),
  getStudentHistory: (id) => http(`/students/${id}/history`),

  async listStudents() {
    const seen = new Map()
    for (const test of cache.get('tests')) {
      try {
        const subs = await realApi.listSubmissions(test.id)
        for (const s of subs) if (s.student) seen.set(s.student.id, s.student)
      } catch { /* test may not exist server-side yet */ }
    }
    return [...seen.values()]
  },
}

export const api = MOCK_MODE ? mockApi : realApi

export const pdfUrl = (submissionId) =>
  MOCK_MODE ? '#mock-pdf' : `${BASE}/submissions/${submissionId}/pdf`
