interface Props {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-8"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-[430px] rounded-3xl p-5 space-y-4"
        style={{ background: '#18181D', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={e => e.stopPropagation()}
      >
        <div>
          <p className="text-base font-bold text-zinc-100 tracking-tight">{title}</p>
          <p className="text-sm text-zinc-500 mt-1 font-medium">{message}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-zinc-400 transition-colors cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white transition-colors cursor-pointer"
            style={{ background: '#EF4444', boxShadow: '0 0 20px rgba(239,68,68,0.2)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
