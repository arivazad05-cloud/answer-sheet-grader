import { useEffect, useState } from 'react'
import { api } from '../api'
import { card, btnPrimary, input, linkAccent } from '../ui'

const emptyQuestion = (n) => ({
  question_number: n,
  max_marks: 5,
  model_answer: '',
  rubric_points: [{ point: '', marks: 1 }],
  acceptable_alternatives: '',
})

export default function Setup() {
  const [institution, setInstitution] = useState(null)
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [questions, setQuestions] = useState([])
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [error, setError] = useState(null)

  const instId = localStorage.getItem('institution_id') || 1

  useEffect(() => {
    api.getInstitution(instId)
      .then((inst) => {
        setInstitution(inst)
        setSubject(inst.rubric?.subject_name || inst.subject_default || '')
        setQuestions(inst.rubric?.question_list_json || [emptyQuestion(1)])
      })
      .catch(() => setQuestions([emptyQuestion(1)]))
  }, [instId])

  async function createInstitution(e) {
    e.preventDefault()
    setError(null)
    try {
      const inst = await api.createInstitution({ name, subject_default: subject })
      localStorage.setItem('institution_id', inst.id)
      setInstitution(inst)
      setQuestions([emptyQuestion(1)])
    } catch (err) {
      setError(err.message)
    }
  }

  function updateQuestion(i, patch) {
    setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)))
  }

  function updatePoint(qi, pi, patch) {
    setQuestions((qs) =>
      qs.map((q, j) =>
        j === qi
          ? { ...q, rubric_points: q.rubric_points.map((p, k) => (k === pi ? { ...p, ...patch } : p)) }
          : q,
      ),
    )
  }

  async function saveRubric() {
    setSaving(true)
    setError(null)
    try {
      await api.saveRubric(institution?.id || instId, {
        subject_name: subject,
        question_list_json: questions,
      })
      setSavedAt(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!institution) {
    return (
      <div className="max-w-md">
        <h2 className="mb-6 text-[28px] font-semibold leading-tight tracking-[-0.02em]">Create your institute</h2>
        <form onSubmit={createInstitution} className={`${card} space-y-4 p-5`}>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Institute name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} required
              className={`${input} w-full`} placeholder="Sunrise Coaching Institute" />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Default subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} required
              className={`${input} w-full`} placeholder="Physics" />
          </label>
          {error && <p className="text-sm text-bad">{error}</p>}
          <button className={btnPrimary}>Create</button>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">{institution.name}</h2>
          <p className="mt-1 text-[13px] text-ink-2">
            Marking scheme — answer keys uploaded on a test are parsed into these questions; fine-tune them here.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 pl-4">
          {savedAt && <span className="text-[12px] font-medium text-good">Saved {savedAt.toLocaleTimeString()}</span>}
          <button onClick={saveRubric} disabled={saving} className={btnPrimary}>
            {saving ? 'Saving…' : 'Save rubric'}
          </button>
        </div>
      </div>

      {error && <p className="mb-4 text-sm text-bad">{error}</p>}

      <label className="mb-6 block max-w-xs text-sm">
        <span className="mb-1.5 block font-medium">Subject</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)} className={`${input} w-full`} />
      </label>

      <div className="space-y-4">
        {questions.map((q, qi) => (
          <div key={qi} className={`${card} p-5`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold">Question {q.question_number}</h3>
              <div className="flex items-center gap-4">
                <label className="text-[13px] text-ink-2">
                  Max marks{' '}
                  <input type="number" min="1" value={q.max_marks}
                    onChange={(e) => updateQuestion(qi, { max_marks: Number(e.target.value) })}
                    className={`${input} w-16 py-1 text-center`} />
                </label>
                <button onClick={() => setQuestions((qs) => qs.filter((_, j) => j !== qi))}
                  className="cursor-pointer text-[13px] font-medium text-bad transition-colors duration-200 hover:text-bad">
                  Remove
                </button>
              </div>
            </div>

            <label className="mb-4 block text-sm">
              <span className="mb-1.5 block font-medium">Model answer</span>
              <textarea value={q.model_answer} rows={2}
                onChange={(e) => updateQuestion(qi, { model_answer: e.target.value })}
                className={`${input} w-full resize-y`} />
            </label>

            <div className="mb-4">
              <span className="mb-1.5 block text-sm font-medium">Rubric points</span>
              <div className="space-y-2">
                {q.rubric_points.map((p, pi) => (
                  <div key={pi} className="flex items-center gap-2">
                    <input value={p.point} placeholder="What earns these marks"
                      onChange={(e) => updatePoint(qi, pi, { point: e.target.value })}
                      className={`${input} flex-1 py-1.5`} />
                    <input type="number" min="0" value={p.marks}
                      onChange={(e) => updatePoint(qi, pi, { marks: Number(e.target.value) })}
                      className={`${input} w-16 py-1.5 text-center`} />
                    <button onClick={() => updateQuestion(qi, { rubric_points: q.rubric_points.filter((_, k) => k !== pi) })}
                      className="cursor-pointer text-ink-2 transition-colors duration-200 hover:text-bad"
                      aria-label="Remove rubric point">✕</button>
                  </div>
                ))}
              </div>
              <button onClick={() => updateQuestion(qi, { rubric_points: [...q.rubric_points, { point: '', marks: 1 }] })}
                className={`${linkAccent} mt-2.5 text-[13px]`}>
                Add point
              </button>
            </div>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Acceptable alternatives</span>
              <input value={q.acceptable_alternatives}
                onChange={(e) => updateQuestion(qi, { acceptable_alternatives: e.target.value })}
                className={`${input} w-full`}
                placeholder="e.g. vector form accepted" />
            </label>
          </div>
        ))}
      </div>

      <button onClick={() => setQuestions((qs) => [...qs, emptyQuestion(qs.length + 1)])}
        className="mt-4 cursor-pointer rounded-full border border-dashed border-hairline bg-white px-4 py-2 text-sm font-medium text-ink-2 transition-colors duration-200 hover:border-accent hover:text-accent">
        Add question
      </button>
    </div>
  )
}
