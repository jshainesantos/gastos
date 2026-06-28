import { useState } from 'react'
import { ConfirmModal } from '../../../components/ConfirmModal'
import { ExpenseRow } from '../../../components/ExpenseRow'
import { formatCurrency } from '../../../utils/formatters'
import { getCategoryById } from '../../../helpers/categories'
import type { Category, Expense } from '../../../types'

interface Props {
  expenses: Expense[]
  categories: Category[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function TransactionList({ expenses, categories, onEdit, onDelete }: Props) {
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)

  return (
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">Transactions</p>

      {expenses.length === 0 ? (
        <div
          className="rounded-3xl p-10 text-center"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-zinc-500 text-sm">No expenses for this month.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {expenses.map((expense, i) => {
            const cat = getCategoryById(categories, expense.categoryId)
            const day = expense.date.slice(0, 10)
            const prevDay = i > 0 ? expenses[i - 1].date.slice(0, 10) : null
            const showSeparator = day !== prevDay
            const [year, month, dayNum] = day.split('-')
            const label = new Date(Number(year), Number(month) - 1, Number(dayNum))
              .toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })

            return (
              <div key={expense.id}>
                {showSeparator && (
                  <p className="text-xs font-semibold text-zinc-500 px-1 pt-2 pb-1">{label}</p>
                )}
                <ExpenseRow
                  expense={expense}
                  category={cat}
                  onEdit={onEdit}
                  onDelete={() => setDeleteTarget(expense)}
                />
              </div>
            )
          })}
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Delete Expense?"
          message={`"${deleteTarget.note || getCategoryById(categories, deleteTarget.categoryId)?.name || 'Expense'}" — ${formatCurrency(deleteTarget.amount)}`}
          confirmLabel="Delete"
          onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
