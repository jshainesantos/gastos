import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatCurrency, getCurrentYearMonth } from '../utils/formatters'

interface Props {
  onComplete: (budget?: number) => void
}

const STEPS = 3

const PREVIEWS = [
  { icon: 'utensils', color: '#F97316', label: 'Food' },
  { icon: 'car',      color: '#3B82F6', label: 'Transport' },
  { icon: 'film',     color: '#EC4899', label: 'Fun' },
  { icon: 'zap',      color: '#EAB308', label: 'Bills' },
]

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const parsedAmount = parseFloat(amount)
  const hasValidAmount = amount.trim() && !isNaN(parsedAmount) && parsedAmount > 0

  function handleBudgetNext() {
    if (amount.trim()) {
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Please enter a valid amount.')
        return
      }
      if (parsedAmount > 10_000_000) {
        setError('Amount seems too large.')
        return
      }
    }
    setError('')
    setStep(2)
  }

  function handleComplete() {
    onComplete(hasValidAmount ? parsedAmount : undefined)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-6 pt-20 pb-14 max-w-[430px] mx-auto">

      {/* Step indicators */}
      <div className="flex gap-1.5 self-center">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div
            key={i}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === step ? 20 : 6,
              background: i === step ? '#818CF8' : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full text-center">

        {step === 0 && (
          <div className="space-y-6 w-full">
            {/* Icon preview */}
            <div className="flex items-center justify-center gap-3 mb-2">
              {PREVIEWS.map(p => (
                <div
                  key={p.icon}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ background: p.color + '18', border: `1px solid ${p.color}33` }}
                >
                  <CategoryIcon icon={p.icon} color={p.color} size={20} />
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tighter text-zinc-50">Gastos</h1>
              <p className="text-base text-zinc-500 font-medium leading-relaxed max-w-xs mx-auto">
                Track your daily spending, set budgets, and stay on top of your finances.
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 w-full">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-zinc-50">Set a budget</h2>
              <p className="text-sm text-zinc-500 font-medium">
                How much do you want to spend this month? You can skip this and set it later.
              </p>
            </div>

            <div
              className="rounded-3xl p-5"
              style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-zinc-500">₱</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setError('') }}
                  min="0"
                  step="0.01"
                  autoFocus
                  className="flex-1 bg-transparent text-4xl font-bold tracking-tighter text-zinc-50 placeholder:text-zinc-700 focus:outline-none min-w-0"
                />
              </div>
              {hasValidAmount && (
                <p className="text-sm text-zinc-500 mt-2 font-medium">{formatCurrency(parsedAmount)} / month</p>
              )}
              {error && <p className="text-red-400 text-xs mt-2 font-medium" role="alert">{error}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 w-full">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
              style={{ background: '#818CF818', border: '1px solid #818CF833' }}
            >
              <Check size={28} className="text-accent" strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-zinc-50">You're all set</h2>
              <p className="text-sm text-zinc-500 font-medium">
                {hasValidAmount
                  ? `Your ${formatCurrency(parsedAmount)} budget for ${new Date().toLocaleString('en-PH', { month: 'long' })} is ready.`
                  : 'Start adding your expenses whenever you\'re ready.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="w-full space-y-3">
        {step === 0 && (
          <button
            onClick={() => setStep(1)}
            className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: '#818CF8', boxShadow: '0 0 24px rgba(129,140,248,0.25)' }}
          >
            Get Started <ArrowRight size={18} />
          </button>
        )}

        {step === 1 && (
          <>
            <button
              onClick={handleBudgetNext}
              className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
              style={{ background: '#818CF8', boxShadow: '0 0 24px rgba(129,140,248,0.25)' }}
            >
              {hasValidAmount ? 'Set Budget' : 'Continue'} <ArrowRight size={18} />
            </button>
            <button
              onClick={() => { setAmount(''); setError(''); setStep(2) }}
              className="w-full py-3 text-sm font-semibold text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer"
            >
              Skip for now
            </button>
          </>
        )}

        {step === 2 && (
          <button
            onClick={handleComplete}
            className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
            style={{ background: '#818CF8', boxShadow: '0 0 24px rgba(129,140,248,0.25)' }}
          >
            Start Tracking <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
