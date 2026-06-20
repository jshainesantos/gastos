import { Settings2 } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Header } from '../components/layout/Header'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatCurrency } from '../utils/formatters'
import type { Category, Expense, MonthlyBudget } from '../types'

interface Props {
  userName: string
  categories: Category[]
  currentMonthExpenses: Expense[]
  currentMonthTotal: number
  currentMonthBudget: number
  currentMonthCategoryBudgets: MonthlyBudget[]
  onNavigateAdd: () => void
  onNavigateSettings: () => void
}

export function Dashboard({
  userName,
  categories,
  currentMonthExpenses,
  currentMonthTotal,
  currentMonthBudget,
  currentMonthCategoryBudgets,
  onNavigateAdd,
  onNavigateSettings,
}: Props) {
  const budgetUsedPct = currentMonthBudget > 0 ? (currentMonthTotal / currentMonthBudget) * 100 : 0
  const remaining = currentMonthBudget - currentMonthTotal

  const categoryTotals = categories
    .map(cat => ({
      ...cat,
      total: currentMonthExpenses.filter(e => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0),
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)

  const recentExpenses = currentMonthExpenses.slice(0, 5)
  const getCategoryById = (id: string) => categories.find(c => c.id === id)

  const barColor =
    budgetUsedPct >= 100 ? '#F87171' : budgetUsedPct >= 80 ? '#FBBF24' : '#818CF8'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'


  return (
    <div className="pb-24">
      <Header
        title={userName ? `${greeting}, ${userName.split(' ')[0]}` : greeting}
        subtitle={new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })}
        right={
          <button
            onClick={onNavigateSettings}
            aria-label="Settings"
            className="w-10 h-10 flex items-center justify-center rounded-2xl text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Settings2 size={18} aria-hidden="true" />
          </button>
        }
      />

      {/* Hero amount */}
      <div className="px-5 mb-5">
        <div
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{ background: 'var(--bg-hero)', border: '1px solid var(--border-dim)' }}
        >
          {/* Subtle glow behind number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
            <div className="w-48 h-24 rounded-full opacity-10" style={{ background: '#818CF8', filter: 'blur(40px)' }} />
          </div>

          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2 text-center">Total Spent</p>
          <p className="text-5xl font-bold tracking-tighter text-zinc-50 mb-1 leading-none text-center">
            {formatCurrency(currentMonthTotal)}
          </p>

          {currentMonthBudget > 0 ? (
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-500 font-medium">
                  of {formatCurrency(currentMonthBudget)} budget
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: barColor }}
                >
                  {remaining < 0
                    ? `₱${Math.abs(remaining).toLocaleString('en-PH', { minimumFractionDigits: 0 })} over`
                    : `₱${remaining.toLocaleString('en-PH', { minimumFractionDigits: 0 })} left`}
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5" role="progressbar" aria-valuenow={Math.min(budgetUsedPct, 100)} aria-valuemin={0} aria-valuemax={100}>
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
      </div>

      {/* Top category + donut */}
      {categoryTotals.length > 0 && (
        <div className="px-5 mb-5">
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
                    <Tooltip
                      formatter={(v: number) => formatCurrency(v)}
                      contentStyle={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-md)', borderRadius: 12, color: '#f4f4f5', fontSize: 12 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex-1 min-w-0 space-y-2.5">
                {categoryTotals.slice(0, 4).map(cat => {
                  const catBudget = currentMonthCategoryBudgets.find(b => b.categoryId === cat.id)
                  const catRemaining = catBudget ? catBudget.amount - cat.total : null
                  const catPct = catBudget ? Math.min((cat.total / catBudget.amount) * 100, 100) : 0
                  const catBarColor = catPct >= 100 ? '#F87171' : catPct >= 80 ? '#FBBF24' : cat.color
                  return (
                    <div key={cat.id} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                          <span className="text-xs text-zinc-400 truncate">{cat.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-zinc-200 flex-shrink-0 tabular-nums">
                          {currentMonthTotal > 0 ? Math.round((cat.total / currentMonthTotal) * 100) : 0}%
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
        </div>
      )}

      {/* Recent */}
      <div className="px-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">Recent</p>

        {recentExpenses.length === 0 ? (
          <div
            className="rounded-3xl p-10 text-center"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-zinc-500 text-sm">No expenses yet this month.</p>
            <button
              onClick={onNavigateAdd}
              className="mt-3 text-accent text-sm font-semibold hover:text-accent-hover transition-colors cursor-pointer"
            >
              Add your first →
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map(expense => {
              const cat = getCategoryById(expense.categoryId)
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  {cat && <CategoryIcon icon={cat.icon} color={cat.color} size={15} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate tracking-tight">
                      {expense.note || cat?.name || 'Expense'}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{cat?.name}</p>
                  </div>
                  <p className="text-sm font-bold text-zinc-100 tabular-nums tracking-tight">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
