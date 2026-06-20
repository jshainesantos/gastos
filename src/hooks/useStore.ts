import { useState, useCallback } from 'react'
import type { Category, Expense, MonthlyBudget } from '../types'
import {
  loadCategories,
  saveCategories,
  loadExpenses,
  saveExpenses,
  loadBudgets,
  saveBudgets,
} from '../utils/storage'
import { getCurrentYearMonth, toYearMonth } from '../utils/formatters'

export function useStore() {
  const [categories, setCategories] = useState<Category[]>(() => loadCategories())
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpenses())
  const [budgets, setBudgets] = useState<MonthlyBudget[]>(() => loadBudgets())

  // Categories
  const addCategory = useCallback((category: Category) => {
    setCategories(prev => {
      const next = [...prev, category]
      saveCategories(next)
      return next
    })
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id)
      saveCategories(next)
      return next
    })
  }, [])

  // Expenses
  const addExpense = useCallback((expense: Expense) => {
    setExpenses(prev => {
      const next = [expense, ...prev]
      saveExpenses(next)
      return next
    })
  }, [])

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id)
      saveExpenses(next)
      return next
    })
  }, [])

  // Budgets
  const setBudget = useCallback((yearMonth: string, amount: number) => {
    setBudgets(prev => {
      const next = prev.filter(b => b.yearMonth !== yearMonth)
      if (amount > 0) next.push({ yearMonth, amount })
      saveBudgets(next)
      return next
    })
  }, [])

  const getBudget = useCallback(
    (yearMonth: string): number => {
      return budgets.find(b => b.yearMonth === yearMonth)?.amount ?? 0
    },
    [budgets]
  )

  const getExpensesForMonth = useCallback(
    (yearMonth: string): Expense[] => {
      return expenses.filter(e => toYearMonth(e.date) === yearMonth)
    },
    [expenses]
  )

  const currentYearMonth = getCurrentYearMonth()

  const currentMonthExpenses = getExpensesForMonth(currentYearMonth)

  const currentMonthTotal = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0)

  const currentMonthBudget = getBudget(currentYearMonth)

  // Available months that have expenses
  const availableMonths = [...new Set(expenses.map(e => toYearMonth(e.date)))].sort().reverse()

  return {
    categories,
    expenses,
    addCategory,
    deleteCategory,
    addExpense,
    deleteExpense,
    setBudget,
    getBudget,
    getExpensesForMonth,
    currentYearMonth,
    currentMonthExpenses,
    currentMonthTotal,
    currentMonthBudget,
    availableMonths,
  }
}
