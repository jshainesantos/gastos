import { useState } from 'react'
import { BottomNav } from './components/layout/BottomNav'
import { Toaster } from './components/Toaster'
import { Dashboard } from './pages/Dashboard'
import { AddExpense } from './pages/AddExpense'
import { History } from './pages/History'
import { Categories } from './pages/Categories'
import { Settings } from './pages/Settings'
import { useStore } from './hooks/useStore'
import { useToast } from './hooks/useToast'
import type { Page } from './types'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')
  const store = useStore()
  const { toasts, toast, dismiss } = useToast()

  return (
    <div className="min-h-screen bg-canvas text-zinc-100 font-sans">
      <main className="max-w-[430px] mx-auto" id="main-content">
        {page === 'dashboard' && (
          <Dashboard
            categories={store.categories}
            currentYearMonth={store.currentYearMonth}
            currentMonthExpenses={store.currentMonthExpenses}
            currentMonthTotal={store.currentMonthTotal}
            currentMonthBudget={store.currentMonthBudget}
            onNavigateAdd={() => setPage('add')}
            onNavigateSettings={() => setPage('settings')}
          />
        )}
        {page === 'add' && (
          <AddExpense
            categories={store.categories}
            onAdd={expense => { store.addExpense(expense); toast('Expense added!') }}
          />
        )}
        {page === 'history' && (
          <History
            categories={store.categories}
            expenses={store.expenses}
            availableMonths={store.availableMonths}
            onDelete={id => { store.deleteExpense(id); toast('Expense deleted.', 'warning') }}
          />
        )}
        {page === 'categories' && (
          <Categories
            categories={store.categories}
            onAdd={cat => { store.addCategory(cat); toast(`"${cat.name}" added.`) }}
            onDelete={id => {
              const name = store.categories.find(c => c.id === id)?.name
              store.deleteCategory(id)
              toast(`"${name}" removed.`, 'warning')
            }}
          />
        )}
        {page === 'settings' && (
          <Settings
            currentYearMonth={store.currentYearMonth}
            currentBudget={store.currentMonthBudget}
            onSetBudget={(ym, amount) => {
              store.setBudget(ym, amount)
              toast(amount > 0 ? 'Budget saved!' : 'Budget cleared.')
            }}
          />
        )}
      </main>

      <Toaster toasts={toasts} onDismiss={dismiss} />
      <BottomNav current={page} onNavigate={setPage} />
    </div>
  )
}
