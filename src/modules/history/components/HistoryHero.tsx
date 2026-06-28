import { formatCurrency } from '../../../utils/formatters'

interface Props {
  total: number
  label: string
  count: number
}

export function HistoryHero({ total, label, count }: Props) {
  return (
    <div
      className="rounded-3xl px-5 py-5"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-1 text-center">{label}</p>
      <p className="text-4xl font-bold tracking-tighter text-zinc-50 text-center">{formatCurrency(total)}</p>
      <p className="text-xs text-zinc-500 mt-1 font-medium text-center">
        {count} transaction{count !== 1 ? 's' : ''}
      </p>
    </div>
  )
}
