import { useEffect, useRef } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface Props {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

const CONFIG: Record<ToastType, { icon: React.ElementType; color: string; bg: string }> = {
  success: { icon: CheckCircle,  color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
  error:   { icon: XCircle,      color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
  warning: { icon: AlertCircle,  color: '#FBBF24', bg: 'rgba(251,191,36,0.12)'  },
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const { icon: Icon, color, bg } = CONFIG[toast.type]
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(onDismiss, toast.duration ?? 3000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [toast.id])

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl w-full max-w-sm mx-auto shadow-xl animate-toast-in"
      style={{
        background: 'var(--bg-surface-2)',
        border: `1px solid ${color}33`,
        backdropFilter: 'blur(12px)',
      }}
    >
      <span style={{ background: bg, borderRadius: 10, padding: 6, display: 'flex', flexShrink: 0 }}>
        <Icon size={16} style={{ color }} aria-hidden="true" />
      </span>
      <p className="flex-1 text-sm font-medium text-zinc-100 leading-snug">{toast.message}</p>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer flex-shrink-0 p-1 rounded-lg hover:bg-white/5"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  )
}

export function Toaster({ toasts, onDismiss }: Props) {
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed left-0 right-0 z-50 flex flex-col gap-2 px-4"
      style={{ bottom: 88 }}
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
      ))}
    </div>
  )
}
