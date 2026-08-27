// Shared Apple-style primitives: class recipes, status chips, SVG icons.

export const card = 'rounded-[18px] border border-hairline bg-white'

export const btnPrimary =
  'cursor-pointer rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-accent-hover disabled:cursor-default disabled:opacity-40'

export const btnSecondary =
  'cursor-pointer rounded-full border border-hairline bg-white px-4 py-2 text-sm font-medium text-ink transition-colors duration-200 hover:bg-surface'

export const input =
  'rounded-[10px] border border-hairline bg-white px-3 py-2 text-sm text-ink transition placeholder:text-ink-2 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 disabled:bg-surface'

export const th = 'px-4 py-3 text-left text-[12px] font-medium text-ink-2'
export const linkAccent =
  'cursor-pointer font-medium text-accent transition-colors duration-200 hover:text-accent-hover'

const CHIP_TONES = {
  uploaded: ['bg-ink/5 text-ink-2', 'bg-ink-2'],
  processing: ['bg-[#FFF6E9] text-warn', 'bg-warn'],
  graded: ['bg-[#EDF7EF] text-good', 'bg-good'],
  failed: ['bg-[#FCEEEE] text-bad', 'bg-bad'],
  ready: ['bg-[#EDF7EF] text-good', 'bg-good'],
  parsing: ['bg-[#FFF6E9] text-warn', 'bg-warn'],
  missing: ['bg-ink/5 text-ink-2', 'bg-ink-2'],
}

export function Chip({ tone, children }) {
  const [box, dot] = CHIP_TONES[tone] || CHIP_TONES.uploaded
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${box}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </span>
  )
}

export function StepBadge({ n }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[13px] font-semibold text-white">
      {n}
    </span>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const UploadIcon = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <path d="M12 16V5m0 0l-4 4m4-4l4 4" />
    <path d="M4 16.5V18a2 2 0 002 2h12a2 2 0 002-2v-1.5" />
  </svg>
)

export const CheckIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke} strokeWidth={2.2}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

export const DocIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <path d="M7 3.5h7L18.5 8v12a1.5 1.5 0 01-1.5 1.5H7A1.5 1.5 0 015.5 20V5A1.5 1.5 0 017 3.5z" />
    <path d="M13.5 3.5V8H18" />
  </svg>
)

export const ChartIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <path d="M5 19.5V13m7 6.5V8m7 11.5V4.5" />
  </svg>
)

export const PeopleIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
    <path d="M15.5 5.4a3.2 3.2 0 010 5.9M17.5 14.9c1.7.7 2.8 2.3 3.2 4.6" />
  </svg>
)

export const GearIcon = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...stroke}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3.5v2.2m0 12.6v2.2M3.5 12h2.2m12.6 0h2.2M6 6l1.6 1.6M16.4 16.4L18 18M18 6l-1.6 1.6M7.6 16.4L6 18" />
  </svg>
)
