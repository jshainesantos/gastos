import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Header } from '../../components/layout/Header'
import { ConfirmModal } from '../../components/ConfirmModal'
import { CategoryForm } from './components/CategoryForm'
import { CategoryList } from './components/CategoryList'
import type { Category } from '../../types'

interface Props {
  categories: Category[]
  onAdd: (category: Category) => void
  onDelete: (id: string) => void
}

export function Categories({ categories, onAdd, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('more-horizontal')
  const [color, setColor] = useState('#818CF8')
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) { setError('Category name is required.'); return }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters.'); return }
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('A category with this name already exists.')
      return
    }
    onAdd({ id: crypto.randomUUID(), name: trimmed, icon, color, isDefault: false })
    setName(''); setIcon('more-horizontal'); setColor('#818CF8'); setError(''); setShowForm(false)
  }

  return (
    <div className="pb-24">
      <Header
        title="Categories"
        right={
          <button
            onClick={() => setShowForm(v => !v)}
            aria-label={showForm ? 'Cancel' : 'Add category'}
            className="flex items-center gap-1.5 text-sm font-semibold tracking-tight cursor-pointer px-2 py-1 transition-colors"
            style={{ color: showForm ? '#71717A' : '#818CF8' }}
          >
            {showForm
              ? <><X size={15} aria-hidden="true" /> Cancel</>
              : <><Plus size={15} aria-hidden="true" /> New</>}
          </button>
        }
      />

      {showForm && (
        <CategoryForm
          name={name}
          icon={icon}
          color={color}
          error={error}
          onNameChange={v => { setName(v); setError('') }}
          onIconChange={setIcon}
          onColorChange={setColor}
          onSubmit={handleAdd}
        />
      )}

      <CategoryList categories={categories} onDeleteRequest={setDeleteTarget} />

      {deleteTarget && (
        <ConfirmModal
          title="Delete Category?"
          message={`"${deleteTarget.name}" will be permanently removed.`}
          confirmLabel="Delete"
          onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
