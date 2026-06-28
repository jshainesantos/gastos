import { useState } from 'react'
import { Check } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { DatePicker } from '../../components/DatePicker'
import { AmountInput } from './components/AmountInput'
import { CategoryPicker } from './components/CategoryPicker'
import type { Category, Expense } from '../../types'

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

    if (!amount.trim()) { setError('Amount is required.'); return }
    if (isNaN(parsed) || parsed <= 0) { setError('Amount must be greater than zero.'); return }
    if (parsed > 10_000_000) { setError('Amount seems too large. Please double-check.'); return }
    if (!categoryId) { setError('Please select a category.'); return }
    if (!date) { setError('Please pick a date.'); return }

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
        <AmountInput
          amount={amount}
          error={error}
          onChange={v => { setAmount(v); setError('') }}
        />

        <CategoryPicker
          categories={categories}
          selected={categoryId}
          onSelect={setCategoryId}
        />

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
