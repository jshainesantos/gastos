import { useState } from 'react'
import { Trash2, Pencil } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { CategoryIcon } from '../components/CategoryIcon'
import { ConfirmModal } from '../components/ConfirmModal'
import { MultiSelect } from '../components/MultiSelect'
import { formatCurrency, formatMonthYear, getCurrentYearMonth, toYearMonth } from '../utils/formatters'
import type { Category, Expense } from '../types'

interface Props {
  categories: Category[]
  expenses: Expense[]
  availableMonths: string[]
  onDelete: (id: string) => void
  onEdit: (expense: Expense) => void
}

export function History({ categories, expenses, availableMonths, onDelete, onEdit }: Props) {
  const allMonths = availableMonths.length > 0 ? availableMonths : [getCurrentYearMonth()]
  const [selectedMonths, setSelectedMonths] = useState([allMonths[0]])
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)

  const monthExpenses = expenses
    .filter(e => selectedMonths.includes(toYearMonth(e.date)))
    .sort((a, b) => b.date.localeCompare(a.date))

  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const getCategoryById = (id: string) => categories.find(c => c.id === id)

  const categoryTotals = categories
    .map(cat => ({
      ...cat,
      total: monthExpenses.filter(e => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0),
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)

  const heroLabel =
    selectedMonths.length === 1
      ? formatMonthYear(selectedMonths[0])
      : `${selectedMonths.length} months`


  return (
    <div className="pb-24">
      <Header title="History" />

      {/* Month picker */}
      <div className="px-5 mb-5">
        <MultiSelect
          values={selectedMonths}
          onChange={setSelectedMonths}
          options={allMonths.map(m => ({ value: m, label: formatMonthYear(m) }))}
          label="Months"
        />
      </div>

      {/* Total hero */}
      <div className="px-5 mb-5">
        <div
          className="rounded-3xl px-5 py-5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1 text-center">
            {heroLabel}
          </p>
          <p className="text-4xl font-bold tracking-tighter text-zinc-50 text-center">{formatCurrency(total)}</p>
          <p className="text-xs text-zinc-500 mt-1 font-medium text-center">{monthExpenses.length} transaction{monthExpenses.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* By Category */}
      {categoryTotals.length > 0 && (
        <div className="px-5 mb-5">
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
        </div>
      )}

      {/* Transactions */}
      <div className="px-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">Transactions</p>
        {monthExpenses.length === 0 ? (
          <div
            className="rounded-3xl p-10 text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-zinc-500 text-sm">No expenses for this month.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {monthExpenses.map((expense, i) => {
              const cat = getCategoryById(expense.categoryId)
              const day = expense.date.slice(0, 10)
              const prevDay = i > 0 ? monthExpenses[i - 1].date.slice(0, 10) : null
              const showSeparator = day !== prevDay
              const [year, month, dayNum] = day.split('-')
              const label = new Date(Number(year), Number(month) - 1, Number(dayNum)).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
              return (
                <div key={expense.id}>
                  {showSeparator && (
                    <p className="text-xs font-semibold text-zinc-500 px-1 pt-2 pb-1">{label}</p>
                  )}
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                  >
                    {cat && <CategoryIcon icon={cat.icon} color={cat.color} size={15} />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100 truncate tracking-tight">
                        {expense.note || cat?.name || 'Expense'}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">{cat?.name ?? ''}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <p className="text-sm font-bold text-zinc-100 tabular-nums mr-1">{formatCurrency(expense.amount)}</p>
                      <button
                        onClick={() => onEdit(expense)}
                        aria-label="Edit expense"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 hover:text-accent hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <Pencil size={13} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(expense)}
                        aria-label="Delete expense"
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete Expense?"
          message={`"${deleteTarget.note || getCategoryById(deleteTarget.categoryId)?.name || 'Expense'}" — ${formatCurrency(deleteTarget.amount)}`}
          confirmLabel="Delete"
          onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

    </div>
  )
}
