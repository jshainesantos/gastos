import { formatCurrency } from '../../../utils/formatters'

interface Props {
  amount: string
  error: string
  onChange: (value: string) => void
}

export function AmountInput({ amount, error, onChange }: Props) {
  const parsedAmount = parseFloat(amount)
  const hasValidAmount = amount && !isNaN(parsedAmount) && parsedAmount > 0

  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-2">Amount</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-bold text-zinc-500">₱</span>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={e => onChange(e.target.value)}
          className="flex-1 bg-transparent text-3xl font-bold tracking-tighter text-zinc-50 placeholder:text-zinc-700 focus:outline-none min-w-0"
          min="0"
          step="0.01"
          aria-label="Amount in PHP"
        />
      </div>
      {hasValidAmount && (
        <p className="text-sm text-zinc-500 mt-2 font-medium">{formatCurrency(parsedAmount)}</p>
      )}
      {error && <p className="text-red-400 text-xs mt-2 font-medium" role="alert">{error}</p>}
    </div>
  )
}
