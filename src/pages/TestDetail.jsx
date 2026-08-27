import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import ResultsMatrix from '../components/ResultsMatrix'
import { card, btnPrimary, btnSecondary, input, th, linkAccent, Chip, StepBadge, UploadIcon, CheckIcon } from '../ui'

// "priya_sharma_101.pdf" → { student_name: "Priya Sharma", roll_number: "101" }
function guessFromFilename(filename) {
  const base = filename.replace(/\.[^.]+$/, '')
  const tokens = base.split(/[_\-\s]+/).filter(Boolean)
  let roll_number = ''
  if (tokens.length > 1 && /^\d+$/.test(tokens[tokens.length - 1])) {
    roll_number = tokens.pop()
  }
  const student_name = tokens
    .map((t) => (t[0] ? t[0].toUpperCase() + t.slice(1).toLowerCase() : t))
    .join(' ')
  return { student_name, roll_number }
}

let rowId = 0

function StepHeading({ n, children }) {
  return (
    <h3 className="mb-4 flex items-center gap-2.5 text-[19px] font-semibold tracking-[-0.01em]">
      <StepBadge n={n} />
      {children}
    </h3>
  )
}

function FileSlot({ label, required, file, onChange, disabled }) {
  const inputRef = useRef(null)
  return (
    <div className="flex-1 rounded-[14px] border border-hairline bg-surface p-3.5">
      <div className="mb-2 text-[12px] font-medium text-ink-2">
        {label}{required ? '' : ' (optional)'}
      </div>
      <div className="flex items-center gap-2.5">
        <button type="button" onClick={() => inputRef.current?.click()} disabled={disabled}
          className={`${btnSecondary} px-3.5 py-1.5 text-[13px]`}>
          Choose file
        </button>
        <span className="min-w-0 truncate text-[13px] text-ink-2">{file ? file.name : 'No file chosen'}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/*"
        className="hidden"
        onChange={(e) => { onChange(e.target.files[0] || null); e.target.value = '' }}
      />
    </div>
  )
}

// Step 1: the teacher takes the test in class, then uploads the question
// paper + answer key here. The backend parses the key into a marking scheme.
function MaterialsStep({ test, onUploaded, setError }) {
  const [qpFile, setQpFile] = useState(null)
  const [keyFile, setKeyFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const [replacing, setReplacing] = useState(false)

  const status = test?.key_status
  const questions = test?.question_list || []
  const totalMarks = questions.reduce((a, q) => a + q.max_marks, 0)

  async function upload() {
    setBusy(true)
    setError(null)
    try {
      await api.uploadTestMaterials(test.id, { question_paper: qpFile, answer_key: keyFile })
      setQpFile(null)
      setKeyFile(null)
      setReplacing(false)
      onUploaded()
    } catch (err) {
      setError(`Answer key upload failed: ${err.message}`)
    } finally {
      setBusy(false)
    }
  }

  if (status === 'parsing') {
    return (
      <div className={`${card} p-5`}>
        <p className="flex items-center gap-2.5 font-medium">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-accent" aria-hidden="true" />
          Reading the answer key and building the marking scheme…
        </p>
        <p className="mt-1.5 pl-[26px] text-[13px] text-ink-2">
          This takes a few seconds. The answer-sheet upload opens once it&apos;s done.
        </p>
      </div>
    )
  }

  if (status === 'ready' && !replacing) {
    return (
      <div className={`${card} p-5`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-medium">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-good text-white">
                <CheckIcon className="h-3 w-3" />
              </span>
              Answer key parsed — {questions.length} question{questions.length === 1 ? '' : 's'}, {totalMarks} marks total
            </p>
            <p className="mt-1.5 pl-7 text-[13px] text-ink-2">
              {test.answer_key_path && <>Key: {test.answer_key_path}</>}
              {test.question_paper_path && <> · Paper: {test.question_paper_path}</>}
            </p>
          </div>
          <div className="flex shrink-0 gap-4 text-[13px] font-medium">
            <Link to="/setup" className={linkAccent}>Fine-tune marking</Link>
            <button onClick={() => setReplacing(true)}
              className="cursor-pointer text-ink-2 transition-colors duration-200 hover:text-ink">
              Replace key
            </button>
          </div>
        </div>
        {questions.length > 0 && (
          <details className="mt-3 pl-7">
            <summary className="cursor-pointer text-[13px] font-medium text-accent">Show parsed questions</summary>
            <ul className="mt-2.5 space-y-2 text-[13px]">
              {questions.map((q) => (
                <li key={q.question_number} className="flex gap-2.5">
                  <span className="shrink-0 font-semibold tabular-nums">Q{q.question_number} · {q.max_marks} marks</span>
                  <span className="truncate text-ink-2">{q.model_answer}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    )
  }

  // status 'missing', unknown (real mode without the endpoint), or replacing
  return (
    <div className={`${card} p-5`}>
      <p className="mb-4 text-[13px] leading-relaxed text-ink-2">
        Took the test in class? Upload the answer key (and question paper) — the AI turns it
        into the marking scheme it grades against.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <FileSlot label="Answer key" required file={keyFile} onChange={setKeyFile} disabled={busy} />
        <FileSlot label="Question paper" file={qpFile} onChange={setQpFile} disabled={busy} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button onClick={upload} disabled={busy || !keyFile} className={btnPrimary}>
          {busy ? 'Uploading…' : 'Upload & parse answer key'}
        </button>
        {replacing && (
          <button onClick={() => setReplacing(false)}
            className="cursor-pointer text-[13px] font-medium text-ink-2 transition-colors duration-200 hover:text-ink">
            Cancel
          </button>
        )}
        {!keyFile && !replacing && (
          <span className="text-[12px] text-ink-2">The answer key is required before grading.</span>
        )}
      </div>
    </div>
  )
}

export default function TestDetail() {
  const { id } = useParams()
  const [test, setTest] = useState(null)
  const [testMissing, setTestMissing] = useState(false)
  const [subs, setSubs] = useState([])
  const [rows, setRows] = useState([])
  const rowsRef = useRef(rows)
  useEffect(() => { rowsRef.current = rows }, [rows])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState(null)
  const fileInput = useRef(null)

  const loadTest = useCallback(
    () => api.getTest(id)
      .then((t) => { setTest(t); setTestMissing(!t) })
      .catch(() => { setTest(null); setTestMissing(true) }),
    [id],
  )
  const load = useCallback(
    () => api.listSubmissions(id).then(setSubs).catch((e) => setError(e.message)),
    [id],
  )

  useEffect(() => { loadTest(); load() }, [loadTest, load])

  // poll while the key parses or sheets grade
  const parsing = test?.key_status === 'parsing'
  useEffect(() => {
    if (!parsing) return
    const t = setInterval(loadTest, 2000)
    return () => clearInterval(t)
  }, [parsing, loadTest])

  const pending = subs.some((s) => s.status === 'uploaded' || s.status === 'processing')
  useEffect(() => {
    if (!pending) return
    const t = setInterval(load, 2000)
    return () => clearInterval(t)
  }, [pending, load])

  // Sheets stay locked until the key is parsed. Unknown status (real mode
  // before the backend endpoint exists) doesn't block.
  const sheetsLocked = test?.key_status === 'missing' || test?.key_status === 'parsing'

  function addFiles(fileList) {
    const accepted = [...fileList].filter(
      (f) => f.type === 'application/pdf' || f.type.startsWith('image/'),
    )
    setRows((rs) => [
      ...rs,
      ...accepted.map((file) => ({
        id: ++rowId,
        file,
        ...guessFromFilename(file.name),
        status: 'ready',
        error: null,
      })),
    ])
    if (accepted.length < fileList.length) {
      setError('Some files were skipped — only PDFs and photos are accepted.')
    }
  }

  function updateRow(id, patch) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  async function uploadAll() {
    setUploading(true)
    setError(null)
    for (const { id: rid } of rows) {
      // re-read from the ref so edits made while earlier files upload aren't lost
      const row = rowsRef.current.find((r) => r.id === rid)
      if (!row || row.status === 'done') continue
      updateRow(row.id, { status: 'uploading', error: null })
      try {
        await api.uploadSubmission(id, {
          student_name: row.student_name,
          roll_number: row.roll_number,
          file: row.file,
        })
        updateRow(row.id, { status: 'done' })
      } catch (err) {
        updateRow(row.id, { status: 'error', error: err.message })
      }
    }
    setUploading(false)
    setRows((rs) => rs.filter((r) => r.status !== 'done'))
    load()
  }

  const readyRows = rows.filter((r) => r.status !== 'done')
  const allNamed = readyRows.every((r) => r.student_name.trim() && r.roll_number.trim())

  // A confirmed-missing test must not render a working upload flow.
  if (testMissing) {
    return (
      <div>
        <Link to="/tests" className="text-[13px] text-ink-2 transition-colors duration-200 hover:text-ink">← All tests</Link>
        <div className={`${card} mt-4 p-5`}>
          <p className="font-medium">Test not found</p>
          <p className="mt-1 text-[13px] text-ink-2">
            It may have been cleared when the page reloaded — demo data lives in memory.
            Head back to the tests list and create it again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link to="/tests" className="text-[13px] text-ink-2 transition-colors duration-200 hover:text-ink">← All tests</Link>
        <Link to="/setup" className={`${linkAccent} text-[13px]`}>Edit questions &amp; rubric</Link>
      </div>
      <h2 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.02em]">{test?.test_name || 'Test'}</h2>
      <p className="mb-8 mt-1 text-[13px] text-ink-2">
        {test?.subject_name}{test?.test_date && ` · ${test.test_date}`}
      </p>

      {error && <p className="mb-4 text-sm text-bad">{error}</p>}

      <section className="mb-10">
        <StepHeading n={1}>Question paper &amp; answer key</StepHeading>
        {test ? (
          <MaterialsStep test={test} onUploaded={loadTest} setError={setError} />
        ) : (
          <p className="text-sm text-ink-2">Loading…</p>
        )}
      </section>

      <section className="mb-10">
        <StepHeading n={2}>Student answer sheets</StepHeading>

        {sheetsLocked && (
          <p className="mb-3 text-[13px] font-medium text-warn">
            {test?.key_status === 'parsing'
              ? 'One moment — the answer key is still being parsed.'
              : 'Upload the answer key first so the AI knows how to mark.'}
          </p>
        )}

        <div className={sheetsLocked ? 'pointer-events-none opacity-40' : ''}>
          {/* Upload zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
            onClick={() => fileInput.current?.click()}
            role="button"
            tabIndex={sheetsLocked ? -1 : 0}
            aria-disabled={sheetsLocked}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.current?.click() }}
            className={`mb-4 cursor-pointer rounded-[18px] border-2 border-dashed p-10 text-center transition-colors duration-200 ${
              dragOver ? 'border-accent bg-accent/5' : 'border-hairline bg-white hover:border-ink-2'
            }`}
          >
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-ink-2">
              <UploadIcon className="h-5 w-5" />
            </span>
            <p className="mt-3 font-medium">
              Drag &amp; drop answer sheets here, or <span className="text-accent">browse</span>
            </p>
            <p className="mx-auto mt-1.5 max-w-md text-[12px] leading-relaxed text-ink-2">
              PDFs or photos, one file per student. Name it like{' '}
              <code className="rounded-[5px] bg-surface px-1.5 py-0.5 font-medium">priya_sharma_101.pdf</code>{' '}
              and we&apos;ll fill in the name and roll number for you.
            </p>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept=".pdf,image/*"
              className="hidden"
              onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
            />
          </div>

          {/* Pending upload rows */}
          {readyRows.length > 0 && (
            <div className={`${card} mb-6 overflow-hidden`}>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-hairline">
                  <tr>
                    <th className={th}>File</th>
                    <th className={th}>Student name</th>
                    <th className={th}>Roll no.</th>
                    <th className={th}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/60">
                  {readyRows.map((r) => (
                    <tr key={r.id}>
                      <td className="max-w-40 truncate px-4 py-2.5 text-[13px] text-ink-2" title={r.file.name}>{r.file.name}</td>
                      <td className="px-4 py-2.5">
                        <input
                          value={r.student_name}
                          onChange={(e) => updateRow(r.id, { student_name: e.target.value })}
                          disabled={r.status === 'uploading'}
                          placeholder="Student name"
                          aria-label={`Student name for ${r.file.name}`}
                          className={`${input} w-full py-1.5`}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <input
                          value={r.roll_number}
                          onChange={(e) => updateRow(r.id, { roll_number: e.target.value })}
                          disabled={r.status === 'uploading'}
                          placeholder="Roll no."
                          aria-label={`Roll number for ${r.file.name}`}
                          className={`${input} w-24 py-1.5`}
                        />
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {r.status === 'uploading' && <span className="text-[12px] font-medium text-warn">uploading…</span>}
                        {r.status === 'error' && <span className="text-[12px] font-medium text-bad" title={r.error}>failed</span>}
                        {(r.status === 'ready' || r.status === 'error') && (
                          <button
                            onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                            className="ml-3 cursor-pointer text-ink-2 transition-colors duration-200 hover:text-bad"
                            aria-label={`Remove ${r.file.name}`}
                          >✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between border-t border-hairline bg-surface px-4 py-3">
                {!allNamed && <p className="text-[12px] text-ink-2">Fill in every name and roll number to upload.</p>}
                <button onClick={uploadAll} disabled={uploading || !allNamed} className={`${btnPrimary} ml-auto`}>
                  {uploading ? 'Uploading…' : `Upload ${readyRows.length} paper${readyRows.length > 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          )}

          {/* Submissions status table */}
          {subs.length === 0 ? (
            <p className="text-sm text-ink-2">No answer sheets yet.</p>
          ) : (
            <div className={`${card} overflow-hidden`}>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-hairline">
                  <tr>
                    <th className={th}>Student</th>
                    <th className={th}>Roll no.</th>
                    <th className={th}>File</th>
                    <th className={th}>Status</th>
                    <th className={th}></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/60">
                  {subs.map((s) => (
                    <tr key={s.id} className="transition-colors duration-150 hover:bg-[#FAFAFC]">
                      <td className="px-4 py-3.5 font-medium">{s.student?.name || `Student #${s.student_id}`}</td>
                      <td className="px-4 py-3.5 text-ink-2">{s.student?.roll_number || '—'}</td>
                      <td className="px-4 py-3.5 text-ink-2">{s.original_file_path}</td>
                      <td className="px-4 py-3.5">
                        <Chip tone={s.status}>{s.status}</Chip>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {s.status === 'graded' && (
                          <Link to={`/submissions/${s.id}`} className={linkAccent}>View result</Link>
                        )}
                        {s.status === 'uploaded' && (
                          <button
                            onClick={() => api.triggerGrade(s.id).then(load).catch((e) => setError(e.message))}
                            className={linkAccent}
                          >
                            Grade now
                          </button>
                        )}
                        {s.status === 'processing' && <span className="text-[12px] text-ink-2">grading…</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <ResultsMatrix subs={subs} step={3} />
    </div>
  )
}
