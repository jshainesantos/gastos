import { useState } from 'react'
import { Check, Plus, X, Sun, Moon, User } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { CategoryIcon } from '../components/CategoryIcon'
import { Select } from '../components/Select'
import { formatCurrency, formatMonthYear } from '../utils/formatters'
import { loadTheme, saveTheme, loadName, saveName, type Theme } from '../utils/storage'
import type { Category, MonthlyBudget } from '../types'

interface Props {
  categories: Category[]
  currentYearMonth: string
  currentBudget: number
  currentCategoryBudgets: MonthlyBudget[]
  onSetBudget: (yearMonth: string, amount: number, categoryId?: string) => void
  onNameChange: (name: string) => void
}

const cardStyle = { background: 'var(--bg-surface)', border: '1px solid var(--border)' }

export function Settings({ categories, currentYearMonth, currentBudget, currentCategoryBudgets, onSetBudget, onNameChange }: Props) {
  // Budget
  const [amount, setAmount] = useState(currentBudget > 0 ? String(currentBudget) : '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addCategoryId, setAddCategoryId] = useState('')
  const [addAmount, setAddAmount] = useState('')
  const [addError, setAddError] = useState('')

  // Theme
  const [theme, setTheme] = useState<Theme>(() => loadTheme())

  // Name
  const [savedName] = useState(() => loadName())
  const [name, setName] = useState(() => loadName())
  const [nameSaved, setNameSaved] = useState(false)
  const nameChanged = name.trim() !== savedName.trim()

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

  function handleAddCategoryBudget(e: React.FormEvent) {
    e.preventDefault()
    if (!addCategoryId) { setAddError('Please select a category.'); return }
    const parsed = parseFloat(addAmount)
    if (!addAmount.trim() || isNaN(parsed) || parsed <= 0) { setAddError('Please enter a valid amount.'); return }
    if (parsed > 10_000_000) { setAddError('Budget seems too large.'); return }
    onSetBudget(currentYearMonth, parsed, addCategoryId)
    setShowAdd(false); setAddCategoryId(''); setAddAmount(''); setAddError('')
  }

  function handleThemeToggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
  }

  function handleNameSave(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    saveName(trimmed)
    onNameChange(trimmed)
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
  }

  const parsedAmount = parseFloat(amount)
  const hasValidAmount = amount && !isNaN(parsedAmount) && parsedAmount > 0
  const hasChanged = parsedAmount !== currentBudget
  const usedCategoryIds = new Set(currentCategoryBudgets.map(b => b.categoryId))
  const availableForBudget = categories.filter(c => !usedCategoryIds.has(c.id))

  return (
    <div className="pb-24">
      <Header
        title="Settings"
        right={
          <button onClick={handleThemeToggle} className="p-2 rounded-full cursor-pointer transition-colors" style={{ color: 'var(--text-secondary)' }}>
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        }
      />

      <div className="px-5 space-y-4">

        {/* Name */}
        <div className="rounded-3xl p-5" style={cardStyle}>
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">Your Name</p>
          <form onSubmit={handleNameSave} noValidate className="space-y-3">
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-dim)' }}>
              <User size={15} className="text-zinc-500 flex-shrink-0" />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={40}
                className="flex-1 bg-transparent text-sm font-medium text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!nameChanged && !nameSaved}
              className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                background: nameSaved ? '#059669' : '#818CF8',
                boxShadow: nameSaved ? '0 0 16px rgba(5,150,105,0.2)' : nameChanged ? '0 0 16px rgba(129,140,248,0.2)' : 'none',
              }}
            >
              {nameSaved ? <><Check size={14} /> Updated</> : savedName ? 'Update' : 'Save'}
            </button>
          </form>
        </div>


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
                    <span className="flex-1 text-sm font-medium text-zinc-100 truncate">{cat.name}</span>
                    <span className="text-sm font-bold text-zinc-100 tabular-nums">{formatCurrency(b.amount)}</span>
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
        </div>

      </div>
    </div>
  )
}
