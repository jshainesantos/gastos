import { Settings2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { HeroCard } from './components/HeroCard'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { RecentExpenses } from './components/RecentExpenses'
import { computeCategoryTotals } from '../../helpers/categories'
import { formatMonthYear, getCurrentYearMonth } from '../../utils/formatters'
import type { Category, Expense, MonthlyBudget } from '../../types'

interface Props {
  userName: string
  categories: Category[]
  availableMonths: string[]
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
  availableMonths,
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
  const allMonths = availableMonths.includes(currentYearMonth)
    ? availableMonths
    : [currentYearMonth, ...availableMonths]
  const currentIdx = allMonths.indexOf(selectedMonth)
  const canPrev = currentIdx < allMonths.length - 1
  const canNext = currentIdx > 0

  const monthExpenses = getExpensesForMonth(selectedMonth)
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
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
          onClick={() => canPrev && onMonthChange(allMonths[currentIdx + 1])}
          aria-label="Previous month"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
          style={{
            background: canPrev ? 'rgba(255,255,255,0.06)' : 'transparent',
            color: canPrev ? '#a1a1aa' : '#3f3f46',
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-zinc-100 min-w-[120px] text-center">
          {formatMonthYear(selectedMonth)}
        </span>
        <button
          onClick={() => canNext && onMonthChange(allMonths[currentIdx - 1])}
          aria-label="Next month"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer"
          style={{
            background: canNext ? 'rgba(255,255,255,0.06)' : 'transparent',
            color: canNext ? '#a1a1aa' : '#3f3f46',
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
