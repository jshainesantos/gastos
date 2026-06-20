import { useState } from 'react'
import { Trash2, ChevronDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Header } from '../components/layout/Header'
import { CategoryIcon } from '../components/CategoryIcon'
import { formatCurrency, formatDate, formatMonthYear, getCurrentYearMonth, toYearMonth } from '../utils/formatters'
import type { Category, Expense } from '../types'

interface Props {
  categories: Category[]
  expenses: Expense[]
  availableMonths: string[]
  onDelete: (id: string) => void
}

export function History({ categories, expenses, availableMonths, onDelete }: Props) {
  const allMonths = availableMonths.length > 0 ? availableMonths : [getCurrentYearMonth()]
  const [selectedMonth, setSelectedMonth] = useState(allMonths[0])
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const monthExpenses = expenses
    .filter(e => toYearMonth(e.date) === selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date))

  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
  const getCategoryById = (id: string) => categories.find(c => c.id === id)

  const categoryTotals = categories
    .map(cat => ({
      name: cat.name.length > 10 ? cat.name.slice(0, 9) + '…' : cat.name,
      fullName: cat.name,
      total: monthExpenses.filter(e => e.categoryId === cat.id).reduce((s, e) => s + e.amount, 0),
      color: cat.color,
    }))
    .filter(c => c.total > 0)
    .sort((a, b) => b.total - a.total)

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  return (
    <div className="pb-24">
      <Header title="History" />

      {/* Month picker */}
      <div className="px-5 mb-5">
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)}
            className="w-full rounded-2xl px-4 py-3.5 text-zinc-100 focus:outline-none focus:ring-1 focus:ring-accent transition-colors appearance-none cursor-pointer text-sm font-semibold tracking-tight [color-scheme:dark]"
            style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.07)' }}
            aria-label="Select month"
          >
            {allMonths.map(m => (
              <option key={m} value={m}>{formatMonthYear(m)}</option>
            ))}
          </select>
          <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" aria-hidden="true" />
        </div>
      </div>

      {/* Total hero */}
      <div className="px-5 mb-5">
        <div
          className="rounded-3xl px-5 py-5"
          style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1">
            {formatMonthYear(selectedMonth)}
          </p>
          <p className="text-4xl font-bold tracking-tighter text-zinc-50">{formatCurrency(total)}</p>
          <p className="text-xs text-zinc-500 mt-1 font-medium">{monthExpenses.length} transaction{monthExpenses.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Bar chart */}
      {categoryTotals.length > 0 && (
        <div className="px-5 mb-5">
          <div
            className="rounded-3xl p-5"
            style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">By Category</p>
            <ResponsiveContainer width="100%" height={categoryTotals.length * 34 + 8}>
              <BarChart
                data={categoryTotals}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                barSize={10}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fill: '#71717A', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  contentStyle={{ background: '#18181D', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f4f4f5', fontSize: 12 }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                  {categoryTotals.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="px-5">
        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-3">Transactions</p>
        {monthExpenses.length === 0 ? (
          <div
            className="rounded-3xl p-10 text-center"
            style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-zinc-500 text-sm">No expenses for this month.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {monthExpenses.map(expense => {
              const cat = getCategoryById(expense.categoryId)
              return (
                <div
                  key={expense.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
                  style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {cat && <CategoryIcon icon={cat.icon} color={cat.color} size={15} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate tracking-tight">
                      {expense.note || cat?.name || 'Expense'}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{formatDate(expense.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-sm font-bold text-zinc-100 tabular-nums">{formatCurrency(expense.amount)}</p>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      aria-label={confirmDelete === expense.id ? 'Confirm delete' : 'Delete'}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                        confirmDelete === expense.id
                          ? 'bg-red-500/15 text-red-400'
                          : 'text-zinc-700 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
