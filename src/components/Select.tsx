import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  label?: string
}

export function Select({ value, onChange, options, placeholder = 'Select…', label }: Props) {
  const [open, setOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // scroll selected into view
  useEffect(() => {
    if (!open || !sheetRef.current) return
    const el = sheetRef.current.querySelector('[data-selected="true"]') as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors cursor-pointer"
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
      >
        <span className={selected ? 'text-zinc-100' : 'text-zinc-500'}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown size={15} className="text-zinc-500 flex-shrink-0" aria-hidden="true" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:justify-center lg:items-center" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sheet / Modal */}
          <div
            ref={sheetRef}
            className="relative rounded-t-3xl lg:rounded-3xl overflow-hidden flex flex-col lg:w-[320px] lg:shadow-2xl"
            style={{ background: '#18181b', maxHeight: '70vh' }}
          >
            {/* Handle — mobile only */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0 lg:hidden">
              <div className="w-9 h-1 rounded-full bg-zinc-700" />
            </div>

            {label && (
              <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 px-5 pt-2 pb-3 flex-shrink-0">
                {label}
              </p>
            )}

            <ul role="listbox" className="overflow-y-auto pb-safe-or-6">
              {options.map((opt, i) => {
                const isSelected = opt.value === value
                return (
                  <li key={opt.value} role="option" aria-selected={isSelected} data-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => { onChange(opt.value); setOpen(false) }}
                      className="w-full flex items-center justify-between gap-3 px-5 py-4 text-sm font-medium transition-colors cursor-pointer text-left"
                      style={{
                        color: isSelected ? 'var(--color-accent, #818CF8)' : '#d4d4d8',
                        borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      {opt.label}
                      {isSelected && <Check size={15} aria-hidden="true" style={{ color: 'var(--color-accent, #818CF8)', flexShrink: 0 }} />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
