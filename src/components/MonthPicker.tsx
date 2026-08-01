import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getCurrentYearMonth, formatMonthYear } from '../utils/formatters'

interface Props {
  value: string
  onChange: (value: string) => void
}

export function MonthPicker({ value, onChange }: Props) {
  const current = getCurrentYearMonth()
  const canGoForward = value < current

  function prev() {
    const [y, m] = value.split('-').map(Number)
    const d = new Date(y, m - 2, 1)
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  function next() {
    if (!canGoForward) return
    const [y, m] = value.split('-').map(Number)
    const d = new Date(y, m, 1)
    onChange(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  return (
    <div className="px-5 mb-4">
      <div
        className="flex items-center justify-between rounded-2xl px-4 py-3"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
      >
        <button
          onClick={prev}
          aria-label="Previous month"
          className="p-1 rounded-xl text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold text-zinc-100">{formatMonthYear(value)}</p>
          {value < current && (
            <button
              onClick={() => onChange(current)}
              className="text-[10px] text-accent font-medium cursor-pointer hover:opacity-80 transition-opacity"
            >
              back to now
            </button>
          )}
        </div>

        <button
          onClick={next}
          disabled={!canGoForward}
          aria-label="Next month"
          className={`p-1 rounded-xl transition-colors ${canGoForward ? 'text-zinc-400 hover:text-zinc-200 cursor-pointer' : 'text-zinc-700 cursor-default'}`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
