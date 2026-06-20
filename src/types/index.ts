export interface Category {
  id: string
  name: string
  icon: string
  color: string
  isDefault: boolean
}

export interface Expense {
  id: string
  amount: number
  categoryId: string
  note: string
  date: string // ISO date string YYYY-MM-DD
  createdAt: string
}

export interface MonthlyBudget {
  yearMonth: string // YYYY-MM
  amount: number
  categoryId?: string // if set, this is a per-category budget
}

export type Page = 'dashboard' | 'add' | 'history' | 'categories' | 'settings'
