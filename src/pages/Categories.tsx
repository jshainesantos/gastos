import { useState } from 'react'
import { Plus, X, Check } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { CategoryIcon } from '../components/CategoryIcon'
import { ConfirmModal } from '../components/ConfirmModal'
import type { Category } from '../types'

interface Props {
  categories: Category[]
  onAdd: (category: Category) => void
  onDelete: (id: string) => void
}

const ICON_OPTIONS = [
  { value: 'utensils',      label: 'Food'      },
  { value: 'coffee',        label: 'Drinks'    },
  { value: 'car',           label: 'Transport' },
  { value: 'shopping-bag',  label: 'Shopping'  },
  { value: 'zap',           label: 'Bills'     },
  { value: 'film',          label: 'Fun'       },
  { value: 'paw-print',     label: 'Pets'      },
  { value: 'sparkles',      label: 'Beauty'    },
  { value: 'plane',         label: 'Travel'    },
  { value: 'house',         label: 'Home'      },
  { value: 'gift',          label: 'Gifts'     },
  { value: 'dumbbell',      label: 'Fitness'   },
  { value: 'pill',          label: 'Medicine'  },
  { value: 'baby',          label: 'Baby'      },
  { value: 'gamepad-2',     label: 'Gaming'    },
  { value: 'music',         label: 'Music'     },
  { value: 'shirt',         label: 'Clothing'  },
  { value: 'bike',          label: 'Bike'      },
  { value: 'wallet',        label: 'Savings'   },
  { value: 'more-horizontal', label: 'Other'   },
]

const COLOR_OPTIONS = [
  '#F97316', '#EF4444', '#A855F7', '#818CF8',
  '#3B82F6', '#06B6D4', '#10B981', '#34D399',
  '#EAB308', '#EC4899', '#F59E0B', '#6B7280',
]

const cardStyle = { background: '#111115', border: '1px solid rgba(255,255,255,0.05)' }

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
    if (!trimmed) {
      setError('Category name is required.')
      return
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
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
            className="flex items-center gap-1.5 text-sm font-semibold tracking-tight cursor-pointer min-h-[44px] px-2 transition-colors"
            style={{ color: showForm ? '#71717A' : '#818CF8' }}
          >
            {showForm
              ? <><X size={15} aria-hidden="true" /> Cancel</>
              : <><Plus size={15} aria-hidden="true" /> New</>}
          </button>
        }
      />

      {showForm && (
        <form onSubmit={handleAdd} noValidate className="mx-5 mb-5 rounded-3xl p-5 space-y-4" style={cardStyle}>
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">New Category</p>

          <div>
            <label htmlFor="cat-name" className="block text-xs font-medium text-zinc-500 mb-2">Name</label>
            <input
              id="cat-name"
              type="text"
              placeholder="e.g. Gym & Fitness"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              maxLength={30}
              className="w-full rounded-2xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
              style={{ background: '#18181D', border: '1px solid rgba(255,255,255,0.07)' }}
            />
            {error && <p className="text-red-400 text-xs mt-1.5 font-medium" role="alert">{error}</p>}
          </div>

          <div>
            <p className="text-xs font-medium text-zinc-500 mb-2">Icon</p>
            <div className="grid grid-cols-5 gap-2">
              {ICON_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setIcon(opt.value)}
                  aria-pressed={icon === opt.value}
                  className="w-full aspect-square flex items-center justify-center rounded-xl transition-all cursor-pointer"
                  style={{
                    background: icon === opt.value ? color + '18' : '#18181D',
                    border: `1px solid ${icon === opt.value ? color + '55' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  <CategoryIcon icon={opt.value} color={icon === opt.value ? color : '#52525B'} size={15} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-zinc-500 mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                  className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
                  style={{ background: c, boxShadow: color === c ? `0 0 0 2px #08080A, 0 0 0 4px ${c}` : 'none' }}
                >
                  {color === c && <Check size={12} className="text-white" aria-hidden="true" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-colors cursor-pointer active:scale-[0.98]"
            style={{ background: '#818CF8', boxShadow: '0 0 16px rgba(129,140,248,0.2)' }}
          >
            Add Category
          </button>
        </form>
      )}

      <div className="px-5 space-y-2">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
            style={cardStyle}
          >
            <CategoryIcon icon={cat.icon} color={cat.color} size={15} />
            <span className="flex-1 text-sm font-medium text-zinc-100 tracking-tight">{cat.name}</span>
            {cat.isDefault
              ? <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-700 px-2">Default</span>
              : (
                <button
                  onClick={() => setDeleteTarget(cat)}
                  aria-label={`Delete ${cat.name}`}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-700 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )
            }
          </div>
        ))}
      </div>

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
