import { useState } from 'react'
import { Header } from '../../components/layout/Header'
import { MultiSelect } from '../../components/MultiSelect'
import { HistoryHero } from './components/HistoryHero'
import { CategoryBreakdownList } from './components/CategoryBreakdownList'
import { TransactionList } from './components/TransactionList'
import { computeCategoryTotals } from '../../helpers/categories'
import { formatMonthYear, getCurrentYearMonth, toYearMonth } from '../../utils/formatters'
import { CategoryFilter } from './components/CategoryFilter'
import type { Category, Expense } from '../../types'

interface Props {
  categories: Category[]
  expenses: Expense[]
  availableMonths: string[]
  onDelete: (id: string) => void
  onEdit: (expense: Expense) => void
}

export function History({ categories, expenses, availableMonths, onDelete, onEdit }: Props) {
  const currentYearMonth = getCurrentYearMonth()
  const allMonths = availableMonths.includes(currentYearMonth)
    ? availableMonths
    : [currentYearMonth, ...availableMonths]
  const [selectedMonths, setSelectedMonths] = useState([currentYearMonth])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  function handleMonthsChange(months: string[]) {
    setSelectedMonths(months)
    setSelectedCategoryIds([])
  }

  const monthFiltered = expenses.filter(e => selectedMonths.includes(toYearMonth(e.date)))

  const activeCategoryIds = [...new Set(monthFiltered.map(e => e.categoryId))]
  const activeCategories = categories.filter(c => activeCategoryIds.includes(c.id))

  const filtered = (selectedCategoryIds.length === 0
    ? monthFiltered
    : monthFiltered.filter(e => selectedCategoryIds.includes(e.categoryId))
  ).sort((a, b) => b.date.localeCompare(a.date))

  const total = filtered.reduce((sum, e) => sum + e.amount, 0)
  const categoryTotals = computeCategoryTotals(categories, filtered)

  const heroLabel =
    selectedMonths.length === 1
      ? formatMonthYear(selectedMonths[0])
      : `${selectedMonths.length} months`

  return (
    <div className="pb-24 lg:pb-12">
      <Header title="History" />

      <div className="px-5 mb-4">
        <MultiSelect
          values={selectedMonths}
          onChange={handleMonthsChange}
          options={allMonths.map(m => ({ value: m, label: formatMonthYear(m) }))}
          label="Months"
          noun="months"
        />
      </div>

      {activeCategories.length > 1 && (
        <div className="px-5 mb-5">
          <CategoryFilter
            categories={activeCategories}
            selected={selectedCategoryIds}
            onChange={setSelectedCategoryIds}
          />
        </div>
      )}

      <div className="px-5 mb-5">
        <HistoryHero total={total} label={heroLabel} count={filtered.length} />
      </div>

      {categoryTotals.length > 0 && (
        <div className="px-5 mb-5">
          <CategoryBreakdownList categoryTotals={categoryTotals} total={total} />
        </div>
      )}

      <div className="px-5">
        <TransactionList
          expenses={filtered}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
