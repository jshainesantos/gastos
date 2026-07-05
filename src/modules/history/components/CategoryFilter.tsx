import type { Category } from '../../../types'

interface Props {
  categories: Category[]
  selected: string[]
  onChange: (selected: string[]) => void
}

export function CategoryFilter({ categories, selected, onChange }: Props) {
  if (categories.length <= 1) return null

  function toggle(id: string) {
    if (selected.includes(id)) {
      onChange(selected.filter(c => c !== id))
    } else {
      onChange([...selected, id])
    }
  }

  const allActive = selected.length === 0

  return (
    <div
      className="flex gap-2 overflow-x-auto"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <button
        onClick={() => onChange([])}
        className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
        style={
          allActive
            ? { background: '#818CF8', color: '#fff', boxShadow: '0 2px 8px rgba(129,140,248,0.35)' }
            : { background: 'var(--bg-surface-2)', color: '#71717a', border: '1px solid var(--border-dim)' }
        }
      >
        All
      </button>
      {categories.map(cat => {
        const isSelected = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            onClick={() => toggle(cat.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            style={
              isSelected
                ? { background: cat.color + '22', color: cat.color, border: `1px solid ${cat.color}55` }
                : { background: 'var(--bg-surface-2)', color: '#71717a', border: '1px solid var(--border-dim)' }
            }
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: cat.color }}
            />
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
