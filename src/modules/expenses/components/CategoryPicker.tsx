import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { CategoryIcon } from '../../../components/CategoryIcon'
import type { Category } from '../../../types'

const VISIBLE_COUNT = 6

interface Props {
  categories: Category[]
  selected: string
  onSelect: (id: string) => void
}

export function CategoryPicker({ categories, selected, onSelect }: Props) {
  const [expanded, setExpanded] = useState(false)
  const sorted = [...categories].sort((a, b) => Number(a.isDefault) - Number(b.isDefault))
  const visible = expanded ? sorted : sorted.slice(0, VISIBLE_COUNT)
  const hasMore = sorted.length > VISIBLE_COUNT

  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">Category</p>
      <div className="grid grid-cols-2 gap-2">
        {visible.map(cat => {
          const active = selected === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              aria-pressed={active}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl transition-all duration-200 cursor-pointer"
              style={{
                background: active ? cat.color + '22' : 'var(--chip-bg)',
                border: `1px solid ${active ? cat.color + '55' : 'var(--border-dim)'}`,
              }}
            >
              <CategoryIcon icon={cat.icon} color={cat.color} size={16} />
              <span
                className="text-xs font-semibold truncate"
                style={{ color: active ? cat.color : '#71717a' }}
              >
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="mt-2 w-full flex items-center justify-center gap-1 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          {expanded ? 'Show less' : `${sorted.length - VISIBLE_COUNT} more`}
          <ChevronDown size={13} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  )
}
