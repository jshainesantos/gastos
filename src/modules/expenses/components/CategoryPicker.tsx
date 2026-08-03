import { getIconComponent } from '../../../components/CategoryIcon'
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
      <div className="flex flex-wrap gap-2">
        {sorted.map(cat => {
          const active = selected === cat.id
          const Icon = getIconComponent(cat.icon)
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              aria-pressed={active}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer"
              style={{
                background: active ? cat.color + '18' : 'var(--bg-surface)',
                border: `1px solid ${active ? cat.color + '44' : 'var(--border-md)'}`,
              }}
            >
              <Icon size={13} style={{ color: active ? cat.color : '#52525b' }} strokeWidth={2} aria-hidden="true" />
              <span
                className="text-xs font-medium"
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
