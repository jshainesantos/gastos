import type { Category, Expense, MonthlyBudget } from '../types'

const KEYS = {
  CATEGORIES: 'gastos_categories',
  EXPENSES: 'gastos_expenses',
  BUDGETS: 'gastos_budgets',
  ONBOARDED: 'gastos_onboarded',
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food',          name: 'Food',             icon: 'utensils',        color: '#F97316', isDefault: true },
  { id: 'drinks',        name: 'Drinks',            icon: 'coffee',          color: '#A16207', isDefault: true },
  { id: 'transport',     name: 'Transport',         icon: 'car',             color: '#3B82F6', isDefault: true },
  { id: 'shopping',      name: 'Shopping',          icon: 'shopping-bag',    color: '#A855F7', isDefault: true },
  { id: 'bills',         name: 'Bills & Utilities', icon: 'zap',             color: '#EAB308', isDefault: true },
  { id: 'entertainment', name: 'Entertainment',     icon: 'film',            color: '#EC4899', isDefault: true },
  { id: 'other',         name: 'Others',            icon: 'more-horizontal', color: '#6B7280', isDefault: true },
]

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data))
}

// Categories
export function loadCategories(): Category[] {
  return load<Category[]>(KEYS.CATEGORIES, DEFAULT_CATEGORIES)
}

export function saveCategories(categories: Category[]): void {
  save(KEYS.CATEGORIES, categories)
}

// Expenses
export function loadExpenses(): Expense[] {
  return load<Expense[]>(KEYS.EXPENSES, [])
}

export function saveExpenses(expenses: Expense[]): void {
  save(KEYS.EXPENSES, expenses)
}

// Budgets
export function loadBudgets(): MonthlyBudget[] {
  return load<MonthlyBudget[]>(KEYS.BUDGETS, [])
}

export function saveBudgets(budgets: MonthlyBudget[]): void {
  save(KEYS.BUDGETS, budgets)
}

// Onboarding
export function hasOnboarded(): boolean {
  return localStorage.getItem(KEYS.ONBOARDED) === 'true'
}

export function markOnboarded(): void {
  localStorage.setItem(KEYS.ONBOARDED, 'true')
}

// User name
export function loadName(): string {
  return localStorage.getItem('gastos_name') ?? ''
}

export function saveName(name: string): void {
  localStorage.setItem('gastos_name', name)
}
