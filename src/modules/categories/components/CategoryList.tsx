import { X } from 'lucide-react'
import { CategoryIcon } from '../../../components/CategoryIcon'
import type { Category } from '../../../types'

interface Props {
  categories: Category[]
  onDeleteRequest: (category: Category) => void
}

export function CategoryList({ categories, onDeleteRequest }: Props) {
  return (
    <div className="px-5 space-y-2">
      {[...categories].sort((a, b) => Number(a.isDefault) - Number(b.isDefault)).map(cat => (
        <div
          key={cat.id}
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <CategoryIcon icon={cat.icon} color={cat.color} size={15} />
          <span className="flex-1 text-sm font-medium text-zinc-100 tracking-tight">{cat.name}</span>
          {cat.isDefault
            ? <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-700 px-2">Default</span>
            : (
              <button
                onClick={() => onDeleteRequest(cat)}
                aria-label={`Delete ${cat.name}`}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )
          }
        </div>
      ))}
    </div>
  )
}
