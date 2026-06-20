import { useState } from 'react'
import { Check } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { CategoryIcon } from '../components/CategoryIcon'
import { DatePicker } from '../components/DatePicker'
import { formatCurrency } from '../utils/formatters'
import type { Category, Expense } from '../types'

interface Props {
  categories: Category[]
  initialExpense?: Expense
  onAdd: (expense: Expense) => void
  onUpdate?: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void
  onBack?: () => void
}

const inputClass =
  'w-full rounded-2xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-accent transition-colors text-sm font-medium'
const inputStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }

export function AddExpense({ categories, initialExpense, onAdd, onUpdate, onBack }: Props) {
  const editing = !!initialExpense

  const [amount, setAmount] = useState(editing ? String(initialExpense!.amount) : '')
  const [categoryId, setCategoryId] = useState(editing ? initialExpense!.categoryId : (categories[0]?.id ?? ''))
  const [note, setNote] = useState(editing ? initialExpense!.note : '')
  const [date, setDate] = useState(editing ? initialExpense!.date : () => new Date().toISOString().slice(0, 10))
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)

    if (!amount.trim()) {
      setError('Amount is required.')
      return
    }
    if (isNaN(parsed) || parsed <= 0) {
      setError('Amount must be greater than zero.')
      return
    }
    if (parsed > 10_000_000) {
      setError('Amount seems too large. Please double-check.')
      return
    }
    if (!categoryId) {
      setError('Please select a category.')
      return
    }
    if (!date) {
      setError('Please pick a date.')
      return
    }

    if (editing && onUpdate) {
      onUpdate(initialExpense!.id, {
        amount: Math.round(parsed * 100) / 100,
        categoryId,
        note: note.trim(),
        date,
      })
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      amount: Math.round(parsed * 100) / 100,
      categoryId,
      note: note.trim(),
      date,
      createdAt: new Date().toISOString(),
    })

    setSubmitted(true)
    setAmount('')
    setNote('')
    setError('')
    setTimeout(() => setSubmitted(false), 2000)
  }

  const parsedAmount = parseFloat(amount)
  const hasValidAmount = amount && !isNaN(parsedAmount) && parsedAmount > 0

  return (
    <div className="pb-24">
      <Header
        title={editing ? 'Edit Expense' : 'Add Expense'}
        left={editing && onBack ? (
          <button
            onClick={onBack}
            className="text-sm font-semibold text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer px-1"
          >
            ← Back
          </button>
        ) : undefined}
      />

      <form onSubmit={handleSubmit} noValidate className="px-5 space-y-5">
        {/* Amount */}
        <div
          className="rounded-3xl p-5"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">Amount</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-zinc-500">₱</span>
            <input
              id="amount"
              type="number"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError('') }}
              className="flex-1 bg-transparent text-5xl font-bold tracking-tighter text-zinc-50 placeholder:text-zinc-700 focus:outline-none min-w-0"
              min="0"
              step="0.01"
              aria-label="Amount in PHP"
            />
          </div>
          {hasValidAmount && (
            <p className="text-sm text-zinc-500 mt-2 font-medium">{formatCurrency(parsedAmount)}</p>
          )}
          {error && <p className="text-red-400 text-xs mt-2 font-medium" role="alert">{error}</p>}
        </div>

        {/* Category */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">Category</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => {
              const active = categoryId === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  aria-pressed={active}
                  className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl transition-all duration-200 cursor-pointer"
                  style={{
                    background: active ? cat.color + '22' : 'var(--chip-bg)',
                    border: `1px solid ${active ? cat.color + '55' : 'var(--border-dim)'}`,
                  }}
                >
                  <CategoryIcon icon={cat.icon} color={cat.color} size={16} />
                  <span
                    className="text-xs font-semibold truncate"
                    style={{ color: active ? cat.color : '#71717a' }}
                  >{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Date + Note row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">Date</p>
            <DatePicker value={date} onChange={setDate} label="Date" />
          </div>
          <div>
            <label htmlFor="note" className="block text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">
              Note
            </label>
            <input
              id="note"
              type="text"
              placeholder="Optional"
              value={note}
              onChange={e => setNote(e.target.value)}
              maxLength={100}
              className={inputClass}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-bold text-base tracking-tight transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-white active:scale-[0.98]"
          style={{
            background: submitted ? '#059669' : '#818CF8',
            boxShadow: submitted ? '0 0 24px rgba(5,150,105,0.3)' : '0 0 24px rgba(129,140,248,0.25)',
          }}
        >
          {submitted
            ? <><Check size={18} aria-hidden="true" /> Saved!</>
            : editing ? 'Save Changes' : 'Add Expense'
          }
        </button>
      </form>
    </div>
  )
}
