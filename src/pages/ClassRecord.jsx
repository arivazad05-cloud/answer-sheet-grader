import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { card, th } from '../ui'

const avg = (xs) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)

// Gradebook: every student's percentage on every test they've taken.
export default function ClassRecord() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const students = await api.listStudents()
        const withHistory = await Promise.all(
          students.map((s) =>
            api.getStudentHistory(s.id)
              .then((h) => ({ student: s, results: h.results || [] }))
              .catch(() => ({ student: s, results: [] })),
          ),
        )
        setRows(withHistory)
      } catch (e) {
        setError(e.message)
      }
    })()
  }, [])

  if (error) return <p className="text-sm text-bad">{error}</p>
  if (!rows) return <p className="text-sm text-ink-2">Loading…</p>
  if (rows.length === 0) {
    return (
      <div>
        <h2 className="mb-2 text-[28px] font-semibold leading-tight tracking-[-0.02em]">Class record</h2>
        <p className="text-sm text-ink-2">No students yet — they appear once their papers are uploaded and graded.</p>
      </div>
    )
  }

  const tests = [...new Map(
    rows.flatMap((r) => r.results).map((t) => [t.test_id, t]),
  ).values()].sort((a, b) => (a.test_date < b.test_date ? -1 : 1))

  const cell = (r, t) => r.results.find((x) => x.test_id === t.test_id)

  return (
    <div>
      <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">Class record</h2>
      <p className="mb-8 mt-1 text-[13px] text-ink-2">Score percentage for every student on every test.</p>

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline">
            <tr>
              <th className={th}>Student</th>
              {tests.map((t) => (
                <th key={t.test_id} className={`${th} text-right`}>
                  <div className="whitespace-nowrap">{t.test_name}</div>
                  <div className="font-normal text-ink-2">{t.test_date}</div>
                </th>
              ))}
              <th className={`${th} text-right`}>Average</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline/60">
            {rows.map((r) => {
              const pcts = r.results.map((x) => x.percentage)
              return (
                <tr key={r.student.id} className="transition-colors duration-150 hover:bg-[#FAFAFC]">
                  <td className="px-4 py-3.5">
                    <Link to={`/students/${r.student.id}`}
                      className="cursor-pointer font-medium text-accent transition-colors duration-200 hover:text-accent-hover">
                      {r.student.name}
                    </Link>
                    <span className="ml-1.5 text-[12px] text-ink-2">#{r.student.roll_number}</span>
                  </td>
                  {tests.map((t) => {
                    const res = cell(r, t)
                    return (
                      <td key={t.test_id} className="px-4 py-3.5 text-right tabular-nums">
                        {res ? (
                          <span title={`${res.total_marks}/${res.max_marks}`}>{res.percentage}%</span>
                        ) : (
                          <span className="text-ink-2">—</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="px-4 py-3.5 text-right font-semibold tabular-nums">
                    {pcts.length ? `${avg(pcts)}%` : <span className="font-normal text-ink-2">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="border-t border-hairline bg-surface font-medium">
            <tr>
              <td className="px-4 py-3.5 text-ink-2">Class average</td>
              {tests.map((t) => {
                const pcts = rows.map((r) => cell(r, t)?.percentage).filter((x) => x != null)
                return (
                  <td key={t.test_id} className="px-4 py-3.5 text-right tabular-nums text-ink-2">
                    {pcts.length ? `${avg(pcts)}%` : '—'}
                  </td>
                )
              })}
              <td className="px-4 py-3.5"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
