import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { card, th, linkAccent } from '../ui'

export default function Students() {
  const [students, setStudents] = useState(null)

  useEffect(() => {
    api.listStudents().then(setStudents).catch(() => setStudents([]))
  }, [])

  if (!students) return <p className="text-sm text-ink-2">Loading…</p>

  return (
    <div>
      <h2 className="mb-8 text-[28px] font-semibold leading-tight tracking-[-0.02em]">Students</h2>
      {students.length === 0 ? (
        <p className="text-sm text-ink-2">No students yet — they appear once their papers are uploaded.</p>
      ) : (
        <div className={`${card} overflow-hidden`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Roll no.</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {students.map((s) => (
                <tr key={s.id} className="transition-colors duration-150 hover:bg-[#FAFAFC]">
                  <td className="px-4 py-3.5 font-medium">{s.name}</td>
                  <td className="px-4 py-3.5 text-ink-2">{s.roll_number}</td>
                  <td className="px-4 py-3.5 text-right">
                    <Link to={`/students/${s.id}`} className={linkAccent}>History</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
