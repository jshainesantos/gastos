import { CategoryIcon } from '../../../components/CategoryIcon'
import { formatCurrency } from '../../../utils/formatters'
import type { Category } from '../../../types'

interface CategoryTotal extends Category {
  total: number
}

interface Props {
  categoryTotals: CategoryTotal[]
  total: number
}

export function CategoryBreakdownList({ categoryTotals, total }: Props) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">By Category</p>
      <div className="space-y-3">
        {categoryTotals.map(cat => (
          <div key={cat.id} className="flex items-center gap-3">
            <CategoryIcon icon={cat.icon} color={cat.color} size={14} />
            <span className="flex-1 text-sm font-medium text-zinc-100 truncate">{cat.name}</span>
            <span className="text-xs font-medium text-zinc-500 tabular-nums">
              {total > 0 ? Math.round((cat.total / total) * 100) : 0}%
            </span>
            <span className="text-sm font-bold text-zinc-100 tabular-nums tracking-tight w-24 text-right">
              {formatCurrency(cat.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
