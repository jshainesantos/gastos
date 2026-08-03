import { CategoryIcon } from '../../../components/CategoryIcon'
import type { Category } from '../../../types'

interface Props {
  categories: Category[]
  selected: string
  onSelect: (id: string) => void
}

export function CategoryPicker({ categories, selected, onSelect }: Props) {
  const sorted = [...categories].sort((a, b) => Number(a.isDefault) - Number(b.isDefault))

  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">Category</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {sorted.map(cat => {
          const active = selected === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              aria-pressed={active}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0"
              style={{
                background: active ? cat.color + '22' : 'var(--chip-bg)',
                border: `1px solid ${active ? cat.color + '55' : 'var(--border-dim)'}`,
              }}
            >
              <CategoryIcon icon={cat.icon} color={cat.color} size={14} />
              <span
                className="text-xs font-semibold"
                style={{ color: active ? cat.color : '#71717a' }}
              >
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
