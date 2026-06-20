import { useState, useEffect } from 'react'
import { BottomNav } from './components/layout/BottomNav'
import { Toaster } from './components/Toaster'
import { Dashboard } from './pages/Dashboard'
import { AddExpense } from './pages/AddExpense'
import { History } from './pages/History'
import { Categories } from './pages/Categories'
import { Settings } from './pages/Settings'
import { Onboarding } from './pages/Onboarding'
import { useStore } from './hooks/useStore'
import { useToast } from './hooks/useToast'
import { hasOnboarded, markOnboarded, loadName, saveName, applyTheme } from './utils/storage'
import type { Expense, Page } from './types'

export default function App() {
  const [onboarded, setOnboarded] = useState(() => hasOnboarded())
  const [userName, setUserName] = useState(() => loadName())

  useEffect(() => {
    applyTheme()
  }, [])
  const [page, setPage] = useState<Page>('dashboard')
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const store = useStore()
  const { toasts, toast, dismiss } = useToast()

  if (!onboarded) {
    return (
      <div className="min-h-screen bg-canvas text-zinc-100 font-sans">
        <Onboarding
          onComplete={(name, budget) => {
            if (name) { saveName(name); setUserName(name) }
            if (budget) store.setBudget(store.currentYearMonth, budget)
            markOnboarded()
            setOnboarded(true)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas text-zinc-100 font-sans">
      <main className="max-w-[430px] mx-auto" id="main-content">
        {page === 'dashboard' && (
          <Dashboard
            userName={userName}
            categories={store.categories}
            currentMonthExpenses={store.currentMonthExpenses}
            currentMonthTotal={store.currentMonthTotal}
            currentMonthBudget={store.currentMonthBudget}
            currentMonthCategoryBudgets={store.currentMonthCategoryBudgets}
            onNavigateAdd={() => setPage('add')}
            onNavigateSettings={() => setPage('settings')}
          />
        )}
        {page === 'add' && (
          <AddExpense
            categories={store.categories}
            initialExpense={editingExpense ?? undefined}
            onAdd={expense => { store.addExpense(expense); toast('Expense added!') }}
            onUpdate={(id, updates) => {
              store.updateExpense(id, updates)
              toast('Expense updated!')
              setEditingExpense(null)
              setPage('history')
            }}
            onBack={() => { setEditingExpense(null); setPage('history') }}
          />
        )}
        {page === 'history' && (
          <History
            categories={store.categories}
            expenses={store.expenses}
            availableMonths={store.availableMonths}
            onDelete={id => { store.deleteExpense(id); toast('Expense deleted.', 'warning') }}
            onEdit={expense => { setEditingExpense(expense); setPage('add') }}
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
            categories={store.categories}
            currentYearMonth={store.currentYearMonth}
            currentBudget={store.currentMonthBudget}
            currentCategoryBudgets={store.currentMonthCategoryBudgets}
            onSetBudget={(ym, amount, categoryId) => {
              store.setBudget(ym, amount, categoryId)
              if (categoryId) {
                toast(amount > 0 ? 'Category budget saved!' : 'Category budget removed.')
              } else {
                toast(amount > 0 ? 'Budget saved!' : 'Budget cleared.')
              }
            }}
            onNameChange={n => setUserName(n)}
          />
        )}
      </main>

      <Toaster toasts={toasts} onDismiss={dismiss} />
      <BottomNav current={page} onNavigate={p => { setEditingExpense(null); setPage(p) }} />
    </div>
  )
}
