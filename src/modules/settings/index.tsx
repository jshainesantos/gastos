import { useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { NameForm } from './components/NameForm'
import { BudgetForm } from './components/BudgetForm'
import { CategoryBudgetsSection } from './components/CategoryBudgetsSection'
import { loadTheme, saveTheme, type Theme } from '../../utils/storage'
import { formatMonthYear } from '../../utils/formatters'
import type { Category, MonthlyBudget } from '../../types'

interface Props {
  categories: Category[]
  selectedMonth: string
  getBudget: (ym: string, categoryId?: string) => number
  getCategoryBudgets: (ym: string) => MonthlyBudget[]
  onSetBudget: (yearMonth: string, amount: number, categoryId?: string) => void
  onNameChange: (name: string) => void
}

export function Settings({ categories, selectedMonth, getBudget, getCategoryBudgets, onSetBudget, onNameChange }: Props) {
  const [theme, setTheme] = useState<Theme>(() => loadTheme())

  const monthBudget = getBudget(selectedMonth)
  const monthCategoryBudgets = getCategoryBudgets(selectedMonth)

  function handleThemeToggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    saveTheme(next)
  }

  return (
    <div className="pb-24">
      <Header
        title="Settings"
        subtitle={formatMonthYear(selectedMonth)}
        right={
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-full cursor-pointer transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        }
      />

      <div className="px-5 space-y-4">
        <NameForm onNameChange={onNameChange} />
        <BudgetForm
          currentYearMonth={selectedMonth}
          currentBudget={monthBudget}
          onSetBudget={onSetBudget}
        />
        <CategoryBudgetsSection
          categories={categories}
          currentYearMonth={selectedMonth}
          currentCategoryBudgets={monthCategoryBudgets}
          onSetBudget={onSetBudget}
        />
      </div>
    </div>
  )
}
