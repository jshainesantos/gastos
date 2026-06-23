import type { Category, Expense, MonthlyBudget } from '../types'

const KEYS = {
  CATEGORIES: 'gastos_categories',
  EXPENSES: 'gastos_expenses',
  BUDGETS: 'gastos_budgets',
  ONBOARDED: 'gastos_onboarded',
  NAME: 'gastos_name',
  THEME: 'gastos_theme',
}

export interface GastosBackup {
  app: 'gastos'
  version: 1
  exportedAt: string
  data: {
    categories: Category[]
    expenses: Expense[]
    budgets: MonthlyBudget[]
    onboarded: boolean
    name: string
    theme: Theme
  }
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isCategory(value: unknown): value is Category {
  return isRecord(value)
    && isString(value.id)
    && isString(value.name)
    && isString(value.icon)
    && isString(value.color)
    && typeof value.isDefault === 'boolean'
}

function isExpense(value: unknown): value is Expense {
  return isRecord(value)
    && isString(value.id)
    && isFiniteNumber(value.amount)
    && isString(value.categoryId)
    && isString(value.note)
    && isString(value.date)
    && isString(value.createdAt)
}

function isMonthlyBudget(value: unknown): value is MonthlyBudget {
  return isRecord(value)
    && isString(value.yearMonth)
    && isFiniteNumber(value.amount)
    && (value.categoryId === undefined || isString(value.categoryId))
}

function parseBackup(raw: unknown): GastosBackup {
  if (!isRecord(raw) || raw.app !== 'gastos' || raw.version !== 1 || !isString(raw.exportedAt) || !isRecord(raw.data)) {
    throw new Error('Invalid backup file.')
  }

  const { data } = raw
  const categories = data.categories
  const expenses = data.expenses
  const budgets = data.budgets
  const theme = data.theme

  if (!Array.isArray(categories) || !categories.every(isCategory)) throw new Error('Invalid categories data.')
  if (!Array.isArray(expenses) || !expenses.every(isExpense)) throw new Error('Invalid expenses data.')
  if (!Array.isArray(budgets) || !budgets.every(isMonthlyBudget)) throw new Error('Invalid budget data.')
  if (typeof data.onboarded !== 'boolean') throw new Error('Invalid onboarding data.')
  if (!isString(data.name)) throw new Error('Invalid profile data.')
  if (theme !== 'dark' && theme !== 'light') throw new Error('Invalid theme data.')

  return {
    app: 'gastos',
    version: 1,
    exportedAt: raw.exportedAt,
    data: {
      categories,
      expenses,
      budgets,
      onboarded: data.onboarded,
      name: data.name,
      theme,
    },
  }
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
  return localStorage.getItem(KEYS.NAME) ?? ''
}

export function saveName(name: string): void {
  localStorage.setItem(KEYS.NAME, name)
}

// Theme
export type Theme = 'dark' | 'light'

export function loadTheme(): Theme {
  return (localStorage.getItem(KEYS.THEME) as Theme) ?? 'dark'
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem(KEYS.THEME, theme)
  document.documentElement.setAttribute('data-theme', theme)
}

export function applyTheme(): void {
  document.documentElement.setAttribute('data-theme', loadTheme())
}

// Backup / restore
export function createBackup(): GastosBackup {
  return {
    app: 'gastos',
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      categories: loadCategories(),
      expenses: loadExpenses(),
      budgets: loadBudgets(),
      onboarded: hasOnboarded(),
      name: loadName(),
      theme: loadTheme(),
    },
  }
}

export function backupFileName(date = new Date()): string {
  return `gastos-backup-${date.toISOString().slice(0, 10)}.json`
}

export function readBackup(rawJson: string): GastosBackup {
  return parseBackup(JSON.parse(rawJson))
}

export function importBackup(rawJson: string): GastosBackup {
  const backup = readBackup(rawJson)

  saveCategories(backup.data.categories)
  saveExpenses(backup.data.expenses)
  saveBudgets(backup.data.budgets)
  localStorage.setItem(KEYS.ONBOARDED, String(backup.data.onboarded))
  saveName(backup.data.name)
  saveTheme(backup.data.theme)

  return backup
}
