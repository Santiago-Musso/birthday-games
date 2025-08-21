"use client"

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

type Toast = {
  id: number
  title?: string
  message: string
  variant?: 'default' | 'success' | 'error' | 'warning'
  durationMs?: number
}

type ToastContextValue = {
  show: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(1)

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = idRef.current++
    const toast: Toast = { id, durationMs: 3500, variant: 'default', ...t }
    setToasts((prev) => [...prev, toast])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, toast.durationMs)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 w-[min(92vw,420px)] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`rounded-xl px-4 py-3 shadow-soft border backdrop-blur-md ${
              t.variant === 'success' ? 'bg-green-500/90 text-white' :
              t.variant === 'error' ? 'bg-red-500/90 text-white' :
              t.variant === 'warning' ? 'bg-amber-500/90 text-white' :
              'bg-[rgb(var(--surface))]/80 text-[rgb(var(--text))] border-black/5 dark:border-white/10'
            }`}
          >
            {t.title ? <div className="text-sm font-semibold">{t.title}</div> : null}
            <div className="text-sm">{t.message}</div>
            <div className="mt-2 h-1 w-full rounded bg-black/10 dark:bg-white/20 overflow-hidden">
              <div className="h-full bg-white/50 dark:bg-white/70 animate-[shimmer_3.5s_linear_infinite]" />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}



