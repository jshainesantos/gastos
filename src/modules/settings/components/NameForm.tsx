import { useState } from 'react'
import { Check, User } from 'lucide-react'
import { loadName, saveName } from '../../../utils/storage'

interface Props {
  onNameChange: (name: string) => void
}

export function NameForm({ onNameChange }: Props) {
  const [savedName] = useState(() => loadName())
  const [name, setName] = useState(() => loadName())
  const [nameSaved, setNameSaved] = useState(false)
  const nameChanged = name.trim() !== savedName.trim()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    saveName(trimmed)
    onNameChange(trimmed)
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
  }

  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">Your Name</p>
      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: 'var(--bg-surface-2)', border: '1px solid var(--border-dim)' }}
        >
          <User size={15} className="text-zinc-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={40}
            className="flex-1 bg-transparent text-sm font-medium text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={!nameChanged && !nameSaved}
          className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{
            background: nameSaved ? '#059669' : '#818CF8',
            boxShadow: nameSaved ? '0 0 16px rgba(5,150,105,0.2)' : nameChanged ? '0 0 16px rgba(129,140,248,0.2)' : 'none',
          }}
        >
          {nameSaved ? <><Check size={14} /> Updated</> : savedName ? 'Update' : 'Save'}
        </button>
      </form>
    </div>
  )
}
