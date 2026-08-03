import { useState } from 'react'
import { Header } from '../../components/layout/Header'
import { HistoryHero } from './components/HistoryHero'
import { CategoryBreakdownList } from './components/CategoryBreakdownList'
import { TransactionList } from './components/TransactionList'
import { computeCategoryTotals } from '../../helpers/categories'
import { formatMonthYear, toYearMonth } from '../../utils/formatters'
import { CategoryFilter } from './components/CategoryFilter'
import type { Category, Expense } from '../../types'

interface Props {
  categories: Category[]
  expenses: Expense[]
  selectedMonth: string
  onDelete: (id: string) => void
  onEdit: (expense: Expense) => void
}

export function History({ categories, expenses, selectedMonth, onDelete, onEdit }: Props) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  const monthFiltered = expenses.filter(e => toYearMonth(e.date) === selectedMonth)

  const activeCategoryIds = [...new Set(monthFiltered.map(e => e.categoryId))]
  const activeCategories = categories.filter(c => activeCategoryIds.includes(c.id))

  const filtered = (selectedCategoryIds.length === 0
    ? monthFiltered
    : monthFiltered.filter(e => selectedCategoryIds.includes(e.categoryId))
  ).sort((a, b) => b.date.localeCompare(a.date))

  const total = filtered.reduce((sum, e) => sum + e.amount, 0)
  const categoryTotals = computeCategoryTotals(categories, filtered)

  return (
    <div className="pb-24">
      <Header title="History" subtitle={formatMonthYear(selectedMonth)} />

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
        <HistoryHero total={total} label={formatMonthYear(selectedMonth)} count={filtered.length} />
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
