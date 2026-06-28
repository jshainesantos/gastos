import { Check } from 'lucide-react'
import { CategoryIcon } from '../../../components/CategoryIcon'
import { ICON_OPTIONS, COLOR_OPTIONS } from '../../../helpers/categories'

interface Props {
  name: string
  icon: string
  color: string
  error: string
  onNameChange: (v: string) => void
  onIconChange: (v: string) => void
  onColorChange: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function CategoryForm({ name, icon, color, error, onNameChange, onIconChange, onColorChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-5 mb-5 rounded-3xl p-5 space-y-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">New Category</p>

      <div>
        <label htmlFor="cat-name" className="block text-xs font-medium text-zinc-500 mb-2">Name</label>
        <input
          id="cat-name"
          type="text"
          placeholder="e.g. Gym & Fitness"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          maxLength={30}
          className="w-full rounded-2xl px-4 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-accent text-sm font-medium transition-colors"
          style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-dim)' }}
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
              onClick={() => onIconChange(opt.value)}
              aria-pressed={icon === opt.value}
              className="w-full aspect-square flex items-center justify-center rounded-xl transition-all cursor-pointer"
              style={{
                background: icon === opt.value ? color + '22' : 'var(--bg-surface-2)',
                border: `1px solid ${icon === opt.value ? color + '60' : 'var(--border-dim)'}`,
              }}
            >
              <CategoryIcon icon={opt.value} color={icon === opt.value ? color : '#9F9FA8'} size={15} />
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
              onClick={() => onColorChange(c)}
              aria-label={`Color ${c}`}
              aria-pressed={color === c}
              className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
              style={{ background: c, boxShadow: color === c ? `0 0 0 2px var(--bg-surface), 0 0 0 4px ${c}` : 'none' }}
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
  )
}
