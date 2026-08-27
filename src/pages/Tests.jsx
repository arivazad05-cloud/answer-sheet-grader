import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api'
import { card, btnPrimary, input, th, linkAccent, Chip } from '../ui'

const KEY_LABELS = {
  ready: 'Key uploaded',
  parsing: 'Parsing…',
  missing: 'Key needed',
}

export default function Tests() {
  const [tests, setTests] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ subject_name: '', test_name: '', test_date: '' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const load = () => api.listTests().then(setTests).catch((e) => setError(e.message))
  useEffect(() => { load() }, [])

  async function createTest(e) {
    e.preventDefault()
    setError(null)
    try {
      const test = await api.createTest({
        institution_id: Number(localStorage.getItem('institution_id') || 1),
        ...form,
      })
      // land the teacher on the test page — step 1 is uploading the answer key
      navigate(`/tests/${test.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.02em]">Tests</h2>
        <button onClick={() => setShowForm((s) => !s)} className={btnPrimary}>
          {showForm ? 'Cancel' : 'New test'}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-bad">{error}</p>}

      {showForm && (
        <form onSubmit={createTest} className={`${card} mb-6 grid max-w-2xl grid-cols-3 gap-3 p-4`}>
          <input required placeholder="Test name" value={form.test_name}
            onChange={(e) => setForm({ ...form, test_name: e.target.value })}
            className={input} />
          <input required placeholder="Subject" value={form.subject_name}
            onChange={(e) => setForm({ ...form, subject_name: e.target.value })}
            className={input} />
          <input required type="date" value={form.test_date}
            onChange={(e) => setForm({ ...form, test_date: e.target.value })}
            className={input} />
          <button className={`${btnPrimary} col-span-3`}>Create test</button>
        </form>
      )}

      {tests.length === 0 ? (
        <p className="text-sm text-ink-2">No tests yet — create one to start uploading papers.</p>
      ) : (
        <div className={`${card} overflow-hidden`}>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-hairline">
              <tr>
                <th className={th}>Test</th>
                <th className={th}>Subject</th>
                <th className={th}>Date</th>
                <th className={th}>Answer key</th>
                <th className={th}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline/60">
              {tests.map((t) => (
                <tr key={t.id} className="transition-colors duration-150 hover:bg-[#FAFAFC]">
                  <td className="px-4 py-3.5 font-medium">{t.test_name}</td>
                  <td className="px-4 py-3.5 text-ink-2">{t.subject_name}</td>
                  <td className="px-4 py-3.5 text-ink-2">{t.test_date}</td>
                  <td className="px-4 py-3.5">
                    {KEY_LABELS[t.key_status] ? (
                      <Chip tone={t.key_status}>{KEY_LABELS[t.key_status]}</Chip>
                    ) : (
                      <span className="text-[12px] text-ink-2">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link to={`/tests/${t.id}`} className={linkAccent}>Open</Link>
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
