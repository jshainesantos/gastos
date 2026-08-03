import { Settings2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { HeroCard } from './components/HeroCard'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { SpendingInsights } from './components/SpendingInsights'
import { RecentExpenses } from './components/RecentExpenses'
import { computeCategoryTotals } from '../../helpers/categories'
import { formatMonthYear, getCurrentYearMonth } from '../../utils/formatters'
import type { Category, Expense, MonthlyBudget } from '../../types'

interface Props {
  userName: string
  categories: Category[]
  selectedMonth: string
  onMonthChange: (month: string) => void
  getExpensesForMonth: (ym: string) => Expense[]
  getBudget: (ym: string, categoryId?: string) => number
  getCategoryBudgets: (ym: string) => MonthlyBudget[]
  onNavigateAdd: () => void
  onNavigateSettings: () => void
  onNavigateHistory: () => void
}

export function Dashboard({
  userName,
  categories,
  selectedMonth,
  onMonthChange,
  getExpensesForMonth,
  getBudget,
  getCategoryBudgets,
  onNavigateAdd,
  onNavigateSettings,
  onNavigateHistory,
}: Props) {
  const currentYearMonth = getCurrentYearMonth()
  const isCurrentMonth = selectedMonth === currentYearMonth

  function shiftMonth(ym: string, delta: number): string {
    const [y, m] = ym.split('-').map(Number)
    const d = new Date(y, m - 1 + delta, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  const prevMonth = shiftMonth(selectedMonth, -1)
  const monthExpenses = getExpensesForMonth(selectedMonth)
  const prevMonthExpenses = getExpensesForMonth(prevMonth)
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const prevMonthTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const monthBudget = getBudget(selectedMonth)
  const monthCategoryBudgets = getCategoryBudgets(selectedMonth)
  const categoryTotals = computeCategoryTotals(categories, monthExpenses)

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

      <div className="px-5 mb-4 flex items-center justify-between">
        <button
          onClick={() => onMonthChange(shiftMonth(selectedMonth, -1))}
          aria-label="Previous month"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#a1a1aa',
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex flex-col items-center min-w-[120px]">
          <span className="text-sm font-semibold text-zinc-100">
            {formatMonthYear(selectedMonth)}
          </span>
          {!isCurrentMonth && (
            <button
              onClick={() => onMonthChange(currentYearMonth)}
              className="text-[11px] font-medium text-accent cursor-pointer mt-0.5"
            >
              Today
            </button>
          )}
        </div>
        <button
          onClick={() => onMonthChange(shiftMonth(selectedMonth, 1))}
          aria-label="Next month"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#a1a1aa',
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="px-5">
        <div className="mb-5">
          <HeroCard
            total={monthTotal}
            budget={monthBudget}
            onNavigateSettings={onNavigateSettings}
          />
        </div>

        <div className="flex flex-col gap-5">
          {categoryTotals.length > 0 && (
            <CategoryBreakdown
              categoryTotals={categoryTotals}
              monthTotal={monthTotal}
              categoryBudgets={monthCategoryBudgets}
            />
          )}
          <SpendingInsights
            currentExpenses={monthExpenses}
            prevExpenses={prevMonthExpenses}
            currentTotal={monthTotal}
            prevTotal={prevMonthTotal}
            categories={categories}
            prevMonthLabel={formatMonthYear(prevMonth).split(' ')[0]}
          />
          <RecentExpenses
            expenses={monthExpenses}
            categories={categories}
            onNavigateAdd={onNavigateAdd}
            onNavigateHistory={onNavigateHistory}
          />
        </div>
      </div>
    </div>
  )
}
