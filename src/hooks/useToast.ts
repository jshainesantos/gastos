import { useState, useCallback } from 'react'
import type { Toast, ToastType } from '../components/Toaster'

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = useCallback((message: string, type: ToastType = 'success', duration = 3000) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev.slice(-2), { id, message, type, duration }])
  }, [])

  return { toasts, toast, dismiss }
}
