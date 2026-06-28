import { Settings2 } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { HeroCard } from './components/HeroCard'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { RecentExpenses } from './components/RecentExpenses'
import { computeCategoryTotals } from '../../helpers/categories'
import type { Category, Expense, MonthlyBudget } from '../../types'

interface Props {
  userName: string
  categories: Category[]
  currentMonthExpenses: Expense[]
  currentMonthTotal: number
  currentMonthBudget: number
  currentMonthCategoryBudgets: MonthlyBudget[]
  onNavigateAdd: () => void
  onNavigateSettings: () => void
  onNavigateHistory: () => void
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
  onNavigateHistory,
}: Props) {
  const categoryTotals = computeCategoryTotals(categories, currentMonthExpenses)

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

      <div className="px-5 mb-5">
        <HeroCard
          total={currentMonthTotal}
          budget={currentMonthBudget}
          onNavigateSettings={onNavigateSettings}
        />
      </div>

      {categoryTotals.length > 0 && (
        <div className="px-5 mb-5">
          <CategoryBreakdown
            categoryTotals={categoryTotals}
            monthTotal={currentMonthTotal}
            categoryBudgets={currentMonthCategoryBudgets}
          />
        </div>
      )}

      <div className="px-5">
        <RecentExpenses
          expenses={currentMonthExpenses}
          categories={categories}
          onNavigateAdd={onNavigateAdd}
          onNavigateHistory={onNavigateHistory}
        />
      </div>
    </div>
  )
}
