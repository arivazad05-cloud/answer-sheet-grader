import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { api } from '../api'
import { card, th } from '../ui'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-[10px] border border-hairline bg-white px-3 py-2 text-[12px] shadow-sm">
      <div className="font-semibold">{d.test_name}</div>
      <div className="text-ink-2">{d.test_date}</div>
      <div className="mt-1 font-medium tabular-nums">
        {d.total_marks}/{d.max_marks} · {d.percentage}%
      </div>
    </div>
  )
}

export default function StudentHistory() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.getStudentHistory(id).then(setData).catch((e) => setError(e.message))
  }, [id])

  if (error) return <p className="text-sm text-bad">{error}</p>
  if (!data) return <p className="text-sm text-ink-2">Loading…</p>

  const { student, results } = data

  return (
    <div className="max-w-3xl">
      <Link to="/students" className="text-[13px] text-ink-2 transition-colors duration-200 hover:text-ink">← All students</Link>
      <h2 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.02em]">{student?.name || `Student #${id}`}</h2>
      <p className="mb-8 mt-1 text-[13px] text-ink-2">
        Score percentage across tests{student?.roll_number && ` · Roll ${student.roll_number}`}
      </p>

      {results.length === 0 ? (
        <p className="text-sm text-ink-2">No graded tests yet.</p>
      ) : (
        <>
          <div className={`${card} p-5`}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={results} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid stroke="#F0F0F2" vertical={false} />
                <XAxis dataKey="test_name" tick={{ fontSize: 11, fill: '#6E6E73' }}
                  axisLine={{ stroke: '#D2D2D7' }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6E6E73' }}
                  axisLine={false} tickLine={false} unit="%" />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#D2D2D7' }} />
                <Line type="monotone" dataKey="percentage" stroke="#0071E3" strokeWidth={2}
                  dot={{ r: 4, fill: '#0071E3', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={`${card} mt-4 overflow-hidden`}>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-hairline">
                <tr>
                  <th className={th}>Test</th>
                  <th className={th}>Date</th>
                  <th className={`${th} text-right`}>Score</th>
                  <th className={`${th} text-right`}>%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/60">
                {results.map((r) => (
                  <tr key={r.test_id} className="transition-colors duration-150 hover:bg-[#FAFAFC]">
                    <td className="px-4 py-3 font-medium">{r.test_name}</td>
                    <td className="px-4 py-3 text-ink-2">{r.test_date}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-ink-2">{r.total_marks}/{r.max_marks}</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{r.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
