import type { Category, Expense } from '../types'

export function getCategoryById(categories: Category[], id: string) {
  return categories.find(c => c.id === id)
}

export function computeCategoryTotals(categories: Category[], expenses: Expense[]) {
  return categories
    .map(cat => ({
      ...cat,
      total: expenses.filter(e => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0),
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)
}

export const ICON_OPTIONS = [
  { value: 'utensils',        label: 'Food'      },
  { value: 'coffee',          label: 'Drinks'    },
  { value: 'car',             label: 'Transport' },
  { value: 'shopping-bag',    label: 'Shopping'  },
  { value: 'zap',             label: 'Bills'     },
  { value: 'film',            label: 'Fun'       },
  { value: 'paw-print',       label: 'Pets'      },
  { value: 'sparkles',        label: 'Beauty'    },
  { value: 'plane',           label: 'Travel'    },
  { value: 'house',           label: 'Home'      },
  { value: 'gift',            label: 'Gifts'     },
  { value: 'dumbbell',        label: 'Fitness'   },
  { value: 'pill',            label: 'Medicine'  },
  { value: 'baby',            label: 'Baby'      },
  { value: 'gamepad-2',       label: 'Gaming'    },
  { value: 'music',           label: 'Music'     },
  { value: 'shirt',           label: 'Clothing'  },
  { value: 'bike',            label: 'Bike'      },
  { value: 'wallet',          label: 'Savings'   },
  { value: 'more-horizontal', label: 'Other'     },
]

export const COLOR_OPTIONS = [
  '#F97316', '#EF4444', '#A855F7', '#818CF8',
  '#3B82F6', '#06B6D4', '#10B981', '#34D399',
  '#EAB308', '#EC4899', '#F59E0B', '#6B7280',
]
