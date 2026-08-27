import { useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { MOCK_MODE } from './api'
import { DocIcon, ChartIcon, PeopleIcon, GearIcon } from './ui'

const NAV = [
  { to: '/tests', label: 'Tests', Icon: DocIcon, tile: 'bg-accent' },
  { to: '/record', label: 'Class Record', Icon: ChartIcon, tile: 'bg-[#248A3D]' },
  { to: '/students', label: 'Students', Icon: PeopleIcon, tile: 'bg-[#FF9500]' },
  { to: '/setup', label: 'Institute', Icon: GearIcon, tile: 'bg-[#6E6E73]' },
]

export default function Layout() {
  // A drop that misses the upload zone must not navigate the tab to the file.
  useEffect(() => {
    const prevent = (e) => e.preventDefault()
    window.addEventListener('dragover', prevent)
    window.addEventListener('drop', prevent)
    return () => {
      window.removeEventListener('dragover', prevent)
      window.removeEventListener('drop', prevent)
    }
  }, [])

  return (
    <div className="min-h-screen bg-surface font-sans text-ink">
      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-8">
        <aside className="flex min-h-[calc(100vh-4rem)] w-52 shrink-0 flex-col">
          <h1 className="mb-8 px-3 text-[17px] font-semibold tracking-tight">
            GradeSheet<span className="text-ink-2">.ai</span>
          </h1>
          <nav className="space-y-0.5">
            {NAV.map(({ to, label, Icon, tile }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex cursor-pointer items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-[13px] font-medium transition-colors duration-200 ${
                    isActive ? 'bg-accent text-white' : 'text-ink hover:bg-black/[0.04]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-[6px] text-white ${
                        isActive ? 'bg-white/25' : tile
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                    </span>
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          {MOCK_MODE && (
            <div className="mt-auto pt-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF6E9] px-2.5 py-1 text-[11px] font-medium text-warn">
                <span className="h-1.5 w-1.5 rounded-full bg-warn" aria-hidden="true" />
                Demo data — backend not connected
              </span>
            </div>
          )}
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
