import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { card, th, StepBadge } from '../ui'

const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)
const fmt = (n) => (n === null ? '—' : Math.round(n * 10) / 10)

// Class record for one test: every graded student × every question.
export default function ResultsMatrix({ subs, step }) {
  const graded = useMemo(() => subs.filter((s) => s.status === 'graded'), [subs])
  const [details, setDetails] = useState({})

  const gradedKey = graded.map((s) => s.id).join(',')
  useEffect(() => {
    for (const s of graded) {
      if (details[s.id]) continue
      api.getSubmission(s.id)
        .then((d) => setDetails((prev) => ({ ...prev, [s.id]: d })))
        .catch(() => {})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradedKey])

  const loaded = graded.filter((s) => details[s.id])
  if (loaded.length === 0) return null

  const questionNumbers = [...new Set(
    loaded.flatMap((s) => (details[s.id].question_results || []).map((q) => q.question_number)),
  )].sort((a, b) => a - b)

  const rows = loaded.map((s) => {
    const d = details[s.id]
    const byQ = {}
    for (const q of d.question_results || []) byQ[q.question_number] = q
    const total = (d.question_results || []).reduce((a, q) => a + q.marks_awarded, 0)
    const max = (d.question_results || []).reduce((a, q) => a + q.max_marks, 0)
    return {
      sub: s,
      name: s.student?.name || d.student?.name || `Student #${s.student_id}`,
      roll: s.student?.roll_number || d.student?.roll_number || '',
      byQ,
      total,
      max,
      pct: max ? Math.round((total / max) * 100) : 0,
    }
  })

  const qMax = {}
  for (const n of questionNumbers) {
    qMax[n] = rows.find((r) => r.byQ[n])?.byQ[n].max_marks ?? ''
  }

  return (
    <section className="mt-2">
      <h3 className="mb-4 flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.01em]">
        {step != null && <StepBadge n={step} />}
        Class record
      </h3>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline">
            <tr>
              <th className={th}>Student</th>
              {questionNumbers.map((n) => (
                <th key={n} className={`${th} text-right`}>
                  Q{n} <span className="font-normal text-ink-2">/{qMax[n]}</span>
                </th>
              ))}
              <th className={`${th} text-right`}>Total</th>
              <th className={`${th} text-right`}>%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline/60">
            {rows.map((r) => (
              <tr key={r.sub.id} className="transition-colors duration-150 hover:bg-[#FAFAFC]">
                <td className="px-4 py-3">
                  <Link to={`/submissions/${r.sub.id}`}
                    className="cursor-pointer font-medium text-accent transition-colors duration-200 hover:text-accent-hover">
                    {r.name}
                  </Link>
                  {r.roll && <span className="ml-1.5 text-[12px] text-ink-2">#{r.roll}</span>}
                </td>
                {questionNumbers.map((n) => (
                  <td key={n} className="px-4 py-3 text-right tabular-nums">
                    {r.byQ[n] ? r.byQ[n].marks_awarded : '—'}
                  </td>
                ))}
                <td className="px-4 py-3 text-right font-medium tabular-nums">{r.total}/{r.max}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">{r.pct}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-hairline bg-surface font-medium">
            <tr>
              <td className="px-4 py-3 text-ink-2">Class average</td>
              {questionNumbers.map((n) => (
                <td key={n} className="px-4 py-3 text-right tabular-nums text-ink-2">
                  {fmt(avg(rows.filter((r) => r.byQ[n]).map((r) => r.byQ[n].marks_awarded)))}
                </td>
              ))}
              <td className="px-4 py-3 text-right tabular-nums text-ink-2">
                {fmt(avg(rows.map((r) => r.total)))}
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-ink-2">
                {fmt(avg(rows.map((r) => r.pct)))}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {loaded.length < graded.length && (
        <p className="mt-2 text-[12px] text-ink-2">
          Loading {graded.length - loaded.length} more result{graded.length - loaded.length > 1 ? 's' : ''}…
        </p>
      )}
    </section>
  )
}
