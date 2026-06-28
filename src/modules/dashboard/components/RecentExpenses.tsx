import { ArrowRight } from 'lucide-react'
import { ExpenseRow } from '../../../components/ExpenseRow'
import type { Category, Expense } from '../../../types'

interface Props {
  expenses: Expense[]
  categories: Category[]
  onNavigateAdd: () => void
  onNavigateHistory: () => void
}

export function RecentExpenses({ expenses, categories, onNavigateAdd, onNavigateHistory }: Props) {
  const recent = expenses.slice(0, 5)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Recent</p>
        {expenses.length > 0 && (
          <button onClick={onNavigateHistory} className="flex items-center gap-1 text-xs font-semibold text-accent cursor-pointer">
            View all <ArrowRight size={12} />
          </button>
        )}
      </div>

      {recent.length === 0 ? (
        <div
          className="rounded-3xl p-10 text-center"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-zinc-500 text-sm">No expenses yet this month.</p>
          <button
            onClick={onNavigateAdd}
            className="mt-3 text-accent text-sm font-semibold hover:text-accent-hover transition-colors cursor-pointer"
          >
            Add your first →
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {recent.map(expense => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              category={categories.find(c => c.id === expense.categoryId)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
