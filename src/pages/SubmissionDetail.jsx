import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, pdfUrl } from '../api'
import { card, btnPrimary } from '../ui'

const TONES = {
  right: { label: 'What went right', color: 'text-good', bg: 'bg-[#F4FAF5]', border: 'border-[#DCEEDF]' },
  wrong: { label: 'What went wrong', color: 'text-bad', bg: 'bg-[#FDF4F4]', border: 'border-[#F4DCDC]' },
  change: { label: 'What to change', color: 'text-accent', bg: 'bg-[#F4F8FD]', border: 'border-[#DCE7F4]' },
}

function Remark({ tone, text }) {
  if (!text) return null
  const t = TONES[tone]
  return (
    <div className={`rounded-[12px] border p-3.5 text-[13px] leading-relaxed ${t.bg} ${t.border}`}>
      <span className={`font-semibold ${t.color}`}>{t.label}: </span>{text}
    </div>
  )
}

export default function SubmissionDetail() {
  const { id } = useParams()
  const [sub, setSub] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getSubmission(id).then(setSub).catch((e) => setError(e.message))
  }, [id])

  if (error) return <p className="text-sm text-bad">{error}</p>
  if (!sub) return <p className="text-sm text-ink-2">Loading…</p>

  const results = sub.question_results || []
  const total = results.reduce((a, r) => a + r.marks_awarded, 0)
  const max = results.reduce((a, r) => a + r.max_marks, 0)
  const pct = max ? Math.round((total / max) * 100) : 0

  return (
    <div className="max-w-3xl">
      <Link to={`/tests/${sub.test_id}`} className="text-[13px] text-ink-2 transition-colors duration-200 hover:text-ink">
        ← Back to submissions
      </Link>

      <div className="mb-8 mt-2 flex items-end justify-between">
        <div>
          <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">
            {sub.student?.name || `Student #${sub.student_id}`}
          </h2>
          <p className="mt-1 text-[13px] text-ink-2">
            {sub.test?.test_name || `Test #${sub.test_id}`}
            {sub.student?.roll_number && ` · Roll ${sub.student.roll_number}`}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
              {total}<span className="text-[18px] font-normal text-ink-2">/{max}</span>
            </div>
            <div className="mt-1 text-[12px] text-ink-2 tabular-nums">{pct}%</div>
          </div>
          {sub.status === 'graded' && (
            <a href={pdfUrl(sub.id)} target="_blank" rel="noreferrer" className={btnPrimary}>
              Annotated PDF
            </a>
          )}
        </div>
      </div>

      {sub.student && (
        <Link to={`/students/${sub.student.id}`}
          className="mb-6 inline-block cursor-pointer text-[13px] font-medium text-accent transition-colors duration-200 hover:text-accent-hover">
          View performance history
        </Link>
      )}

      <div className="space-y-4">
        {results.map((r) => (
          <div key={r.question_number} className={`${card} p-5`}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-semibold">Question {r.question_number}</h3>
              <div className="flex items-center gap-3">
                {r.topic_tag && (
                  <span className="rounded-full bg-surface px-2.5 py-1 text-[12px] font-medium text-ink-2">
                    {r.topic_tag}
                  </span>
                )}
                <span className="text-[12px] text-ink-2 tabular-nums">
                  confidence {Math.round(r.confidence_score * 100)}%
                </span>
                <span className={`text-[17px] font-semibold tabular-nums ${
                  r.marks_awarded === r.max_marks ? 'text-good' : r.marks_awarded === 0 ? 'text-bad' : 'text-warn'
                }`}>
                  {r.marks_awarded}/{r.max_marks}
                </span>
              </div>
            </div>
            <div className="space-y-2.5">
              <Remark tone="right" text={r.what_right} />
              <Remark tone="wrong" text={r.what_wrong} />
              <Remark tone="change" text={r.what_to_change} />
              {r.ideal_answer_brief && (
                <p className="pt-1 text-[12px] leading-relaxed text-ink-2">
                  <span className="font-medium text-ink">Ideal answer:</span> {r.ideal_answer_brief}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
