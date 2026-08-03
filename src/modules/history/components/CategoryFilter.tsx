import { getIconComponent } from '../../../components/CategoryIcon'
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
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      <button
        onClick={() => onChange([])}
        className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer"
        style={{
          background: allActive ? '#818CF820' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${allActive ? '#818CF844' : 'rgba(255,255,255,0.06)'}`,
        }}
      >
        <span
          className="text-xs font-medium"
          style={{ color: allActive ? '#818CF8' : '#71717a' }}
        >
          All
        </span>
      </button>
      {categories.map(cat => {
        const active = selected.includes(cat.id)
        const Icon = getIconComponent(cat.icon)
        return (
          <button
            key={cat.id}
            onClick={() => toggle(cat.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer"
            style={{
              background: active ? cat.color + '18' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${active ? cat.color + '44' : 'rgba(255,255,255,0.06)'}`,
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
  )
}
