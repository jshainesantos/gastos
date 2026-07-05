import { useState } from 'react'
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

function DonutChart({ data }: { data: CategoryTotal[] }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const hoveredCat = data.find(d => d.id === hovered)
  const total = data.reduce((sum, d) => sum + d.total, 0)
  const cx = 56, cy = 56, ir = 32, or = 52
  let angle = -Math.PI / 2

  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg width="112" height="112" viewBox="0 0 112 112">
        {data.map(d => {
          const sweep = (d.total / total) * (2 * Math.PI)
          const gap = data.length > 1 ? 0.04 : 0
          const start = angle
          const end = angle + sweep - gap
          angle += sweep
          const large = sweep - gap > Math.PI ? 1 : 0
          const x1 = cx + or * Math.cos(start), y1 = cy + or * Math.sin(start)
          const x2 = cx + or * Math.cos(end),   y2 = cy + or * Math.sin(end)
          const x3 = cx + ir * Math.cos(end),   y3 = cy + ir * Math.sin(end)
          const x4 = cx + ir * Math.cos(start), y4 = cy + ir * Math.sin(start)
          return (
            <path
              key={d.id}
              d={`M${x1} ${y1} A${or} ${or} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${ir} ${ir} 0 ${large} 0 ${x4} ${y4}Z`}
              fill={d.color}
              opacity={hovered && hovered !== d.id ? 0.35 : 1}
              style={{ transition: 'opacity 0.15s', cursor: 'default' }}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })}
      </svg>
      {hoveredCat && (
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-10 z-10 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 pointer-events-none whitespace-nowrap"
          style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-md)' }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: hoveredCat.color }} />
          <span className="text-[11px] text-zinc-400">{hoveredCat.name}</span>
          <span className="text-[11px] font-semibold text-zinc-100 tabular-nums">{formatCurrency(hoveredCat.total)}</span>
        </div>
      )}
    </div>
  )
}

export function CategoryBreakdown({ categoryTotals, monthTotal, categoryBudgets }: Props) {
  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">Breakdown</p>

      <div className="flex items-center gap-4">
        <DonutChart data={categoryTotals} />

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
