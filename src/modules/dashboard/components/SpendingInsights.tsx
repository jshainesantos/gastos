import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { formatCurrency } from '../../../utils/formatters'
import type { Category, Expense } from '../../../types'

interface Props {
  currentExpenses: Expense[]
  prevExpenses: Expense[]
  currentTotal: number
  prevTotal: number
  categories: Category[]
  prevMonthLabel: string
}

export function SpendingInsights({ currentExpenses, prevExpenses, currentTotal, prevTotal, categories, prevMonthLabel }: Props) {
  if (currentExpenses.length === 0 && prevExpenses.length === 0) return null

  const diff = currentTotal - prevTotal
  const pctChange = prevTotal > 0 ? Math.round((diff / prevTotal) * 100) : currentTotal > 0 ? 100 : 0
  const isUp = diff > 0
  const isSame = diff === 0

  const currentDailyAvg = currentExpenses.length > 0
    ? currentTotal / new Set(currentExpenses.map(e => e.date)).size
    : 0
  const prevDailyAvg = prevExpenses.length > 0
    ? prevTotal / new Set(prevExpenses.map(e => e.date)).size
    : 0

  const currentCatTotals = new Map<string, number>()
  currentExpenses.forEach(e => currentCatTotals.set(e.categoryId, (currentCatTotals.get(e.categoryId) ?? 0) + e.amount))
  const prevCatTotals = new Map<string, number>()
  prevExpenses.forEach(e => prevCatTotals.set(e.categoryId, (prevCatTotals.get(e.categoryId) ?? 0) + e.amount))

  const allCatIds = new Set([...currentCatTotals.keys(), ...prevCatTotals.keys()])
  const catChanges = [...allCatIds].map(id => {
    const cur = currentCatTotals.get(id) ?? 0
    const prev = prevCatTotals.get(id) ?? 0
    const catDiff = cur - prev
    const cat = categories.find(c => c.id === id)
    if (!cat || catDiff === 0) return null
    const catPct = prev > 0 ? Math.round((catDiff / prev) * 100) : 100
    return { cat, diff: catDiff, pct: catPct }
  }).filter(Boolean) as { cat: Category; diff: number; pct: number }[]

  const biggestIncreaseCat = catChanges.filter(c => c.diff > 0).sort((a, b) => b.diff - a.diff)[0] ?? null
  const biggestDecreaseCat = catChanges.filter(c => c.diff < 0).sort((a, b) => a.diff - b.diff).map(c => ({ ...c, diff: Math.abs(c.diff), pct: Math.abs(c.pct) }))[0] ?? null

  const topExpense = currentExpenses.length > 0
    ? currentExpenses.reduce((max, e) => e.amount > max.amount ? e : max)
    : null
  const topExpenseCat = topExpense ? categories.find(c => c.id === topExpense.categoryId) : null

  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">Insights</p>

      <div className="space-y-4">
        {/* Month vs month comparison */}
        {prevTotal > 0 || currentTotal > 0 ? (
          <div className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: isSame ? 'rgba(161,161,170,0.12)' : isUp ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                color: isSame ? '#a1a1aa' : isUp ? '#ef4444' : '#10b981',
              }}
            >
              {isSame ? <Minus size={15} /> : isUp ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200">
                {isSame
                  ? `Same spending as ${prevMonthLabel}`
                  : isUp
                  ? `Spent ${Math.abs(pctChange)}% more than ${prevMonthLabel}`
                  : `Spent ${Math.abs(pctChange)}% less than ${prevMonthLabel}`}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {formatCurrency(currentTotal)} vs {formatCurrency(prevTotal)}
              </p>
            </div>
          </div>
        ) : null}

        {/* Daily average */}
        {currentExpenses.length > 0 && (
          <div className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-zinc-400"
              style={{ background: 'rgba(161,161,170,0.08)' }}
            >
              <span className="text-[11px] font-bold">₱/d</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200">
                {formatCurrency(currentDailyAvg)} daily average
              </p>
              {prevDailyAvg > 0 && (
                <p className="text-xs text-zinc-500 mt-0.5">
                  {currentDailyAvg > prevDailyAvg ? 'Up' : 'Down'} from {formatCurrency(prevDailyAvg)} last month
                </p>
              )}
            </div>
          </div>
        )}

        {/* Biggest category increase */}
        {biggestIncreaseCat && (
          <div className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: biggestIncreaseCat.cat.color + '18', color: biggestIncreaseCat.cat.color }}
            >
              <ArrowUpRight size={15} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200">
                {biggestIncreaseCat.cat.name} up {biggestIncreaseCat.pct}%
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                +{formatCurrency(biggestIncreaseCat.diff)} vs {prevMonthLabel}
              </p>
            </div>
          </div>
        )}

        {/* Biggest category decrease */}
        {biggestDecreaseCat && (
          <div className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: biggestDecreaseCat.cat.color + '18', color: biggestDecreaseCat.cat.color }}
            >
              <ArrowDownRight size={15} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200">
                {biggestDecreaseCat.cat.name} down {biggestDecreaseCat.pct}%
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                -{formatCurrency(biggestDecreaseCat.diff)} vs {prevMonthLabel}
              </p>
            </div>
          </div>
        )}

        {/* Biggest single expense */}
        {topExpense && (
          <div className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-amber-400"
              style={{ background: 'rgba(245,158,11,0.12)' }}
            >
              <span className="text-[13px] font-bold">★</span>
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200">
                Biggest expense: {formatCurrency(topExpense.amount)}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                {topExpense.note || topExpenseCat?.name || 'Expense'} · {topExpenseCat?.name}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
