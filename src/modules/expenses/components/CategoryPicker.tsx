import { CategoryIcon } from '../../../components/CategoryIcon'
import type { Category } from '../../../types'

interface Props {
  categories: Category[]
  selected: string
  onSelect: (id: string) => void
}

export function CategoryPicker({ categories, selected, onSelect }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">Category</p>
      <div className="grid grid-cols-2 gap-2">
        {categories.map(cat => {
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
    </div>
  )
}
