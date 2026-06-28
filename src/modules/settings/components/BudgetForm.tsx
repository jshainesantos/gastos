import { useState } from 'react'
import { Check } from 'lucide-react'
import { formatCurrency, formatMonthYear } from '../../../utils/formatters'

interface Props {
  currentYearMonth: string
  currentBudget: number
  onSetBudget: (yearMonth: string, amount: number) => void
}

export function BudgetForm({ currentYearMonth, currentBudget, onSetBudget }: Props) {
  const [amount, setAmount] = useState(currentBudget > 0 ? String(currentBudget) : '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const parsedAmount = parseFloat(amount)
  const hasValidAmount = amount && !isNaN(parsedAmount) && parsedAmount > 0
  const hasChanged = parsedAmount !== currentBudget

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!amount.trim()) {
      onSetBudget(currentYearMonth, 0)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed < 0) { setError('Please enter a valid number.'); return }
    if (parsed > 10_000_000) { setError('Budget seems too large. Please double-check.'); return }
    onSetBudget(currentYearMonth, parsed)
    setSaved(true)
    setError('')
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
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
              style={{ background: 'var(--border-dim)' }}
            >
              Remove
            </button>
          )}
          <button
            type="submit"
            disabled={!hasValidAmount || !hasChanged}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: saved ? '#059669' : '#818CF8',
              boxShadow: saved ? '0 0 20px rgba(5,150,105,0.25)' : (hasValidAmount && hasChanged) ? '0 0 20px rgba(129,140,248,0.2)' : 'none',
              cursor: (hasValidAmount && hasChanged) ? 'pointer' : undefined,
            }}
          >
            {saved ? <><Check size={16} aria-hidden="true" /> Saved!</> : currentBudget > 0 ? 'Update Budget' : 'Save Budget'}
          </button>
        </div>
      </form>
    </div>
  )
}
