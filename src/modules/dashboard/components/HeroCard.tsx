import { formatCurrency } from '../../../utils/formatters'
import { getBudgetBarColor } from '../../../helpers/budget'

interface Props {
  total: number
  budget: number
  onNavigateSettings: () => void
}

export function HeroCard({ total, budget, onNavigateSettings }: Props) {
  const budgetUsedPct = budget > 0 ? (total / budget) * 100 : 0
  const remaining = budget - total
  const barColor = getBudgetBarColor(budgetUsedPct)

  return (
    <div
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{ background: 'var(--bg-hero)', border: '1px solid var(--border-dim)' }}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div className="w-48 h-24 rounded-full opacity-10" style={{ background: '#818CF8', filter: 'blur(40px)' }} />
      </div>

      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2 text-center">Total Spent</p>
      <p className="text-5xl font-bold tracking-tighter text-zinc-50 mb-1 leading-none text-center">
        {formatCurrency(total)}
      </p>

      {budget > 0 ? (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-500 font-medium">
              of {formatCurrency(budget)} budget
            </span>
            <span className="text-xs font-semibold" style={{ color: barColor }}>
              {remaining < 0
                ? `₱${Math.abs(remaining).toLocaleString('en-PH', { minimumFractionDigits: 0 })} over`
                : `₱${remaining.toLocaleString('en-PH', { minimumFractionDigits: 0 })} left`}
            </span>
          </div>
          <div
            className="w-full bg-white/5 rounded-full h-1.5"
            role="progressbar"
            aria-valuenow={Math.min(budgetUsedPct, 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-1.5 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(budgetUsedPct, 100)}%`, background: barColor }}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={onNavigateSettings}
          className="mt-4 text-xs font-medium text-zinc-500 hover:text-accent transition-colors cursor-pointer w-full text-center"
        >
          Set a monthly budget →
        </button>
      )}
    </div>
  )
}
