import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../../utils/formatters'
import { getBudgetBarColor } from '../../../helpers/budget'
import type { Category, MonthlyBudget } from '../../../types'

interface CategoryTotal extends Category {
  total: number
}

interface Props {
  categoryTotals: CategoryTotal[]
  monthTotal: number
  categoryBudgets: MonthlyBudget[]
}

export function CategoryBreakdown({ categoryTotals, monthTotal, categoryBudgets }: Props) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">Breakdown</p>

      <div className="flex items-center gap-4">
        <div className="w-28 h-28 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryTotals}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={52}
                dataKey="total"
                strokeWidth={0}
                paddingAngle={2}
              >
                {categoryTotals.map(cat => (
                  <Cell key={cat.id} fill={cat.color} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const { name, value, payload: p } = payload[0]
                return (
                  <div style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-md)', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginRight: 4 }}>{name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(value as number)}</span>
                  </div>
                )
              }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 min-w-0 space-y-2.5">
          {categoryTotals.slice(0, 4).map(cat => {
            const catBudget = categoryBudgets.find(b => b.categoryId === cat.id)
            const catRemaining = catBudget ? catBudget.amount - cat.total : null
            const catPct = catBudget ? Math.min((cat.total / catBudget.amount) * 100, 100) : 0
            const catBarColor = catBudget ? getBudgetBarColor(catPct) : cat.color
            return (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                    <span className="text-xs text-zinc-400 truncate">{cat.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-zinc-200 flex-shrink-0 tabular-nums">
                    {monthTotal > 0 ? Math.round((cat.total / monthTotal) * 100) : 0}%
                  </span>
                </div>
                {catBudget && catRemaining !== null && (
                  <>
                    <div className="w-full bg-white/5 rounded-full h-1" role="progressbar" aria-valuenow={catPct} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-1 rounded-full transition-all duration-700" style={{ width: `${catPct}%`, background: catBarColor }} />
                    </div>
                    <p className="text-[10px] font-medium tabular-nums" style={{ color: catBarColor }}>
                      {catRemaining < 0
                        ? `₱${Math.abs(catRemaining).toLocaleString('en-PH', { minimumFractionDigits: 0 })} over budget`
                        : `₱${catRemaining.toLocaleString('en-PH', { minimumFractionDigits: 0 })} left`}
                    </p>
                  </>
                )}
              </div>
            )
          })}
          {categoryTotals.length > 4 && (
            <p className="text-xs text-zinc-600">+{categoryTotals.length - 4} more</p>
          )}
        </div>
      </div>
    </div>
  )
}
