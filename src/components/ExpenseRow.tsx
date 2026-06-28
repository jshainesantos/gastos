import { Pencil, Trash2 } from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import { formatCurrency } from '../utils/formatters'
import type { Category, Expense } from '../types'

interface Props {
  expense: Expense
  category?: Category
  onEdit?: (expense: Expense) => void
  onDelete?: (expense: Expense) => void
}

export function ExpenseRow({ expense, category, onEdit, onDelete }: Props) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {category && <CategoryIcon icon={category.icon} color={category.color} size={15} />}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-100 truncate tracking-tight">
          {expense.note || category?.name || 'Expense'}
        </p>
        <p className="text-xs text-zinc-500 mt-0.5">{category?.name ?? ''}</p>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <p className="text-sm font-bold text-zinc-100 tabular-nums mr-1">{formatCurrency(expense.amount)}</p>
        {onEdit && (
          <button
            onClick={() => onEdit(expense)}
            aria-label="Edit expense"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 hover:text-accent hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Pencil size={13} aria-hidden="true" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(expense)}
            aria-label="Delete expense"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 size={13} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
