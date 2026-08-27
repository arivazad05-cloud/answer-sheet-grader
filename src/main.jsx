import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './Layout'
import Setup from './pages/Setup'
import Tests from './pages/Tests'
import ClassRecord from './pages/ClassRecord'
import TestDetail from './pages/TestDetail'
import SubmissionDetail from './pages/SubmissionDetail'
import Students from './pages/Students'
import StudentHistory from './pages/StudentHistory'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/tests" replace />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/record" element={<ClassRecord />} />
          <Route path="/tests/:id" element={<TestDetail />} />
          <Route path="/submissions/:id" element={<SubmissionDetail />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
