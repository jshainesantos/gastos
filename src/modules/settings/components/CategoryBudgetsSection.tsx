import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { CategoryIcon } from '../../../components/CategoryIcon'
import { ConfirmModal } from '../../../components/ConfirmModal'
import { Select } from '../../../components/Select'
import { formatCurrency } from '../../../utils/formatters'
import type { Category, MonthlyBudget } from '../../../types'

interface Props {
  categories: Category[]
  currentYearMonth: string
  currentCategoryBudgets: MonthlyBudget[]
  onSetBudget: (yearMonth: string, amount: number, categoryId: string) => void
}

export function CategoryBudgetsSection({ categories, currentYearMonth, currentCategoryBudgets, onSetBudget }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [addCategoryId, setAddCategoryId] = useState('')
  const [addAmount, setAddAmount] = useState('')
  const [addError, setAddError] = useState('')
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  const usedCategoryIds = new Set(currentCategoryBudgets.map(b => b.categoryId))
  const availableForBudget = categories.filter(c => !usedCategoryIds.has(c.id))

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!addCategoryId) { setAddError('Please select a category.'); return }
    const parsed = parseFloat(addAmount)
    if (!addAmount.trim() || isNaN(parsed) || parsed <= 0) { setAddError('Please enter a valid amount.'); return }
    if (parsed > 10_000_000) { setAddError('Budget seems too large.'); return }
    onSetBudget(currentYearMonth, parsed, addCategoryId)
    setShowAdd(false); setAddCategoryId(''); setAddAmount(''); setAddError('')
  }

  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">Category Budgets</p>

      {currentCategoryBudgets.length === 0 && !showAdd && (
        <p className="text-xs text-zinc-600 font-medium mb-4">No category budgets set.</p>
      )}

      {currentCategoryBudgets.length > 0 && (
        <div className="space-y-3 mb-4">
          {currentCategoryBudgets.map(b => {
            const cat = categories.find(c => c.id === b.categoryId)
            if (!cat) return null
            return (
              <div key={b.categoryId} className="flex items-center gap-3">
                <CategoryIcon icon={cat.icon} color={cat.color} size={14} />
                <span className="flex-1 text-sm font-medium text-zinc-100 truncate">{cat.name}</span>
                <span className="text-sm font-bold text-zinc-100 tabular-nums">{formatCurrency(b.amount)}</span>
                <button
                  onClick={() => setDeletingCategoryId(b.categoryId ?? null)}
                  aria-label={`Remove ${cat.name} budget`}
                  className="w-7 h-7 flex items-center justify-center rounded-xl text-zinc-600 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {showAdd ? (
        <form onSubmit={handleAdd} noValidate className="space-y-3">
          <Select
            value={addCategoryId}
            onChange={v => { setAddCategoryId(v); setAddError('') }}
            options={availableForBudget.map(c => ({ value: c.id, label: c.name }))}
            placeholder="Select category…"
            label="Category"
          />
          <div className="flex items-baseline gap-2 px-1">
            <span className="text-base font-bold text-zinc-500">₱</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={addAmount}
              onChange={e => { setAddAmount(e.target.value); setAddError('') }}
              min="0"
              step="0.01"
              className="flex-1 bg-transparent text-2xl font-bold tracking-tighter text-zinc-50 placeholder:text-zinc-700 focus:outline-none min-w-0"
            />
          </div>
          {addError && <p className="text-red-400 text-xs font-medium" role="alert">{addError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAddCategoryId(''); setAddAmount(''); setAddError('') }}
              className="flex-1 py-3 rounded-2xl font-bold text-sm text-zinc-400 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-colors cursor-pointer"
              style={{ background: '#818CF8' }}
            >
              Add
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          disabled={availableForBudget.length === 0}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-accent transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
          Add category budget
        </button>
      )}

      {deletingCategoryId && (() => {
        const cat = categories.find(c => c.id === deletingCategoryId)
        return (
          <ConfirmModal
            title="Remove category budget?"
            message={`This will remove the budget for ${cat?.name ?? 'this category'}.`}
            confirmLabel="Remove"
            onConfirm={() => { onSetBudget(currentYearMonth, 0, deletingCategoryId); setDeletingCategoryId(null) }}
            onCancel={() => setDeletingCategoryId(null)}
          />
        )
      })()}
    </div>
  )
}
