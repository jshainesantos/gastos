import { useRef, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { CategoryIcon } from './CategoryIcon'
import { formatCurrency } from '../utils/formatters'
import type { Category, Expense } from '../types'

interface Props {
  expense: Expense
  category?: Category
  onEdit?: (expense: Expense) => void
  onDelete?: (expense: Expense) => void
}

const SWIPE_THRESHOLD = 60

export function ExpenseRow({ expense, category, onEdit, onDelete }: Props) {
  const startX = useRef(0)
  const startY = useRef(0)
  const swiping = useRef(false)
  const [offset, setOffset] = useState(0)
  const dragging = useRef(false)

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
    swiping.current = true
    dragging.current = true
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!dragging.current) return
    const dy = Math.abs(e.touches[0].clientY - startY.current)
    const dx = e.touches[0].clientX - startX.current
    if (dy > Math.abs(dx)) { dragging.current = false; setOffset(0); return }
    setOffset(dx)
  }

  function onTouchEnd(e: React.TouchEvent) {
    dragging.current = false
    if (!swiping.current) { setOffset(0); return }
    swiping.current = false
    const dx = e.changedTouches[0].clientX - startX.current
    const dy = Math.abs(e.changedTouches[0].clientY - startY.current)
    setOffset(0)
    if (dy > Math.abs(dx)) return
    if (dx < -SWIPE_THRESHOLD && onDelete) onDelete(expense)
    if (dx > SWIPE_THRESHOLD && onEdit) onEdit(expense)
  }

  const showEdit = offset > 20
  const showDelete = offset < -20

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {showEdit && onEdit && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4 text-accent">
          <Pencil size={16} />
        </div>
      )}
      {showDelete && onDelete && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 text-red-400">
          <Trash2 size={16} />
        </div>
      )}
      <div
        className="flex items-center gap-3 px-4 py-3.5 relative touch-pan-y"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          transform: `translateX(${dragging.current ? offset * 0.4 : 0}px)`,
          transition: dragging.current ? 'none' : 'transform 0.2s ease',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {category && <CategoryIcon icon={category.icon} color={category.color} size={15} />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-100 truncate tracking-tight">
            {expense.note || category?.name || 'Expense'}
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">{category?.name ?? ''}</p>
        </div>
        <p className="text-sm font-bold text-zinc-100 tabular-nums flex-shrink-0">{formatCurrency(expense.amount)}</p>
      </div>
    </div>
  )
}
