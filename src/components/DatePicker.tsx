import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface Props {
  value: string // YYYY-MM-DD
  onChange: (value: string) => void
  label?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatDisplay(value: string) {
  if (!value) return ''
  const [y, m, d] = value.split('-').map(Number)
  return `${String(m).padStart(2, '0')}/${String(d).padStart(2, '0')}/${y}`
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export function DatePicker({ value, onChange, label }: Props) {
  const [open, setOpen] = useState(false)

  const today = new Date()
  const initYear = value ? parseInt(value.slice(0, 4)) : today.getFullYear()
  const initMonth = value ? parseInt(value.slice(5, 7)) - 1 : today.getMonth()

  const [viewYear, setViewYear] = useState(initYear)
  const [viewMonth, setViewMonth] = useState(initMonth)

  useEffect(() => {
    if (open && value) {
      setViewYear(parseInt(value.slice(0, 4)))
      setViewMonth(parseInt(value.slice(5, 7)) - 1)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(day: number) {
    const mm = String(viewMonth + 1).padStart(2, '0')
    const dd = String(day).padStart(2, '0')
    onChange(`${viewYear}-${mm}-${dd}`)
    setOpen(false)
  }

  const totalDays = daysInMonth(viewYear, viewMonth)
  const startDay = firstDayOfMonth(viewYear, viewMonth)
  const todayStr = today.toISOString().slice(0, 10)

  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ]
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors cursor-pointer"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
        aria-label={label ?? 'Pick a date'}
        aria-haspopup="dialog"
      >
        <span className={value ? 'text-zinc-100' : 'text-zinc-500'}>
          {value ? formatDisplay(value) : 'Select date'}
        </span>
        <CalendarDays size={15} className="text-zinc-500 flex-shrink-0" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" aria-modal="true" role="dialog">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div
            className="relative rounded-t-3xl"
            style={{ background: '#18181b' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-9 h-1 rounded-full bg-zinc-700" />
            </div>

            <div className="px-5 pb-8">
              {/* Month nav */}
              <div className="flex items-center justify-between mb-5">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/8 transition-colors cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm font-bold text-zinc-100">
                  {MONTHS[viewMonth]} {viewYear}
                </span>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-white/8 transition-colors cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold text-zinc-600 py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <div className="grid grid-cols-7 gap-y-1">
                {cells.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />

                  const mm = String(viewMonth + 1).padStart(2, '0')
                  const dd = String(day).padStart(2, '0')
                  const dateStr = `${viewYear}-${mm}-${dd}`
                  const isSelected = dateStr === value
                  const isToday = dateStr === todayStr

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => selectDay(day)}
                      className="flex items-center justify-center aspect-square rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
                      style={{
                        background: isSelected ? 'var(--color-accent, #818CF8)' : isToday ? 'rgba(255,255,255,0.07)' : 'transparent',
                        color: isSelected ? '#fff' : isToday ? '#fff' : '#a1a1aa',
                        fontWeight: isSelected || isToday ? 700 : 500,
                      }}
                      aria-label={dateStr}
                      aria-pressed={isSelected}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
