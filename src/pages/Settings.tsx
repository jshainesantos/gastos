import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatCurrency, formatMonthYear } from '../utils/formatters'
import type { Category, MonthlyBudget } from '../types'

interface Props {
  categories: Category[]
  currentYearMonth: string
  currentBudget: number
  currentCategoryBudgets: MonthlyBudget[]
  onSetBudget: (yearMonth: string, amount: number, categoryId?: string) => void
}

const cardStyle = { background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }

export function Settings({ categories, currentYearMonth, currentBudget, currentCategoryBudgets, onSetBudget }: Props) {
  const [amount, setAmount] = useState(currentBudget > 0 ? String(currentBudget) : '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Category budget add form
  const [showAdd, setShowAdd] = useState(false)
  const [addCategoryId, setAddCategoryId] = useState('')
  const [addAmount, setAddAmount] = useState('')
  const [addError, setAddError] = useState('')

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // Empty = clear the budget
    if (!amount.trim()) {
      onSetBudget(currentYearMonth, 0)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed < 0) {
      setError('Please enter a valid number.')
      return
    }
    if (parsed > 10_000_000) {
      setError('Budget seems too large. Please double-check.')
      return
    }
    onSetBudget(currentYearMonth, parsed)
    setSaved(true)
    setError('')
    setTimeout(() => setSaved(false), 2000)
  }

  function handleAddCategoryBudget(e: React.FormEvent) {
    e.preventDefault()
    if (!addCategoryId) {
      setAddError('Please select a category.')
      return
    }
    const parsed = parseFloat(addAmount)
    if (!addAmount.trim() || isNaN(parsed) || parsed <= 0) {
      setAddError('Please enter a valid amount.')
      return
    }
    if (parsed > 10_000_000) {
      setAddError('Budget seems too large.')
      return
    }
    onSetBudget(currentYearMonth, parsed, addCategoryId)
    setShowAdd(false)
    setAddCategoryId('')
    setAddAmount('')
    setAddError('')
  }

  const parsedAmount = parseFloat(amount)
  const hasValidAmount = amount && !isNaN(parsedAmount) && parsedAmount > 0

  // Categories that don't already have a budget set
  const usedCategoryIds = new Set(currentCategoryBudgets.map(b => b.categoryId))
  const availableForBudget = categories.filter(c => !usedCategoryIds.has(c.id))

  return (
    <div className="pb-24">
      <Header title="Settings" />

      <div className="px-5 space-y-4">
        {/* Overall Budget */}
        <div className="rounded-3xl p-5" style={cardStyle}>
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1">Monthly Budget</p>
          <p className="text-xs text-zinc-600 font-medium mb-5">{formatMonthYear(currentYearMonth)} · optional</p>

          <form onSubmit={handleSave} noValidate className="space-y-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-zinc-500">₱</span>
                <input
                  id="budget"
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setError('') }}
                  min="0"
                  step="0.01"
                  aria-label="Monthly budget in PHP"
                  className="flex-1 bg-transparent text-4xl font-bold tracking-tighter text-zinc-50 placeholder:text-zinc-700 focus:outline-none min-w-0"
                />
              </div>
              {hasValidAmount && (
                <p className="text-sm text-zinc-500 mt-1.5 font-medium">{formatCurrency(parsedAmount)} / month</p>
              )}
              {error && <p className="text-red-400 text-xs mt-1.5 font-medium" role="alert">{error}</p>}
            </div>

            <div className="flex gap-2">
              {currentBudget > 0 && (
                <button
                  type="button"
                  onClick={() => { onSetBudget(currentYearMonth, 0); setAmount('') }}
                  className="py-3.5 px-5 rounded-2xl font-bold text-sm text-zinc-400 transition-colors cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  Remove
                </button>
              )}
              <button
                type="submit"
                disabled={!hasValidAmount}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: saved ? '#059669' : '#818CF8',
                  boxShadow: saved ? '0 0 20px rgba(5,150,105,0.25)' : hasValidAmount ? '0 0 20px rgba(129,140,248,0.2)' : 'none',
                  cursor: hasValidAmount ? 'pointer' : undefined,
                }}
              >
                {saved ? <><Check size={16} aria-hidden="true" /> Saved!</> : 'Save Budget'}
              </button>
            </div>
          </form>
        </div>

        {/* Category Budgets */}
        <div className="rounded-3xl p-5" style={cardStyle}>
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
                    <span className="flex-1 text-sm font-medium text-zinc-300 truncate">{cat.name}</span>
                    <span className="text-sm font-bold text-zinc-200 tabular-nums">{formatCurrency(b.amount)}</span>
                    <button
                      onClick={() => onSetBudget(currentYearMonth, 0, b.categoryId)}
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
            <form onSubmit={handleAddCategoryBudget} noValidate className="space-y-3">
              <select
                value={addCategoryId}
                onChange={e => { setAddCategoryId(e.target.value); setAddError('') }}
                className="w-full bg-zinc-900 text-zinc-200 text-sm font-medium rounded-2xl px-4 py-3 border border-white/10 focus:outline-none focus:border-white/20 cursor-pointer"
              >
                <option value="">Select category…</option>
                {availableForBudget.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

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
        </div>

      </div>
    </div>
  )
}
