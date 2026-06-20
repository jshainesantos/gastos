import { useState } from 'react'
import { Check } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { formatCurrency, formatMonthYear } from '../utils/formatters'

interface Props {
  currentYearMonth: string
  currentBudget: number
  onSetBudget: (yearMonth: string, amount: number) => void
}

const cardStyle = { background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }

export function Settings({ currentYearMonth, currentBudget, onSetBudget }: Props) {
  const [amount, setAmount] = useState(currentBudget > 0 ? String(currentBudget) : '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!amount.trim()) {
      setError('Budget amount is required.')
      return
    }
    const parsed = parseFloat(amount)
    if (isNaN(parsed)) {
      setError('Please enter a valid number.')
      return
    }
    if (parsed <= 0) {
      setError('Budget must be greater than zero.')
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

  const parsedAmount = parseFloat(amount)
  const hasValidAmount = amount && !isNaN(parsedAmount) && parsedAmount > 0

  return (
    <div className="pb-24">
      <Header title="Settings" />

      <div className="px-5 space-y-4">
        {/* Budget */}
        <div className="rounded-3xl p-5" style={cardStyle}>
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1">Monthly Budget</p>
          <p className="text-xs text-zinc-600 font-medium mb-5">{formatMonthYear(currentYearMonth)}</p>

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

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
              style={{
                background: saved ? '#059669' : '#818CF8',
                boxShadow: saved ? '0 0 20px rgba(5,150,105,0.25)' : '0 0 20px rgba(129,140,248,0.2)',
              }}
            >
              {saved ? <><Check size={16} aria-hidden="true" /> Saved!</> : 'Save Budget'}
            </button>
          </form>
        </div>

        {/* About */}
        <div className="rounded-3xl p-5" style={cardStyle}>
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">About</p>
          <div className="space-y-3">
            {[
              ['App', 'Gastos'],
              ['Version', '1.0.0'],
              ['Storage', 'Local only'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">{label}</span>
                <span className="text-sm font-semibold text-zinc-200 tracking-tight">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
