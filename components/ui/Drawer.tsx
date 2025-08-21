"use client"

import { useEffect } from 'react'

export function Drawer({ open, onClose, children, side = 'left' }: { open: boolean; onClose: () => void; children: React.ReactNode; side?: 'left' | 'right' | 'bottom' }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute bg-[rgb(var(--surface))] shadow-glass supports-[backdrop-filter]:backdrop-blur-md border-t border-black/5 dark:border-white/10 transition-transform will-change-transform ${
          side === 'bottom' ? 'left-0 right-0 bottom-0 rounded-t-2xl' :
          side === 'right' ? 'top-0 right-0 h-full w-5/6 max-w-sm rounded-l-2xl' :
          'top-0 left-0 h-full w-5/6 max-w-sm rounded-r-2xl'
        } ${open ? 'translate-x-0 translate-y-0' : side === 'bottom' ? 'translate-y-full' : side === 'right' ? 'translate-x-full' : '-translate-x-full'}`}
      >
        {children}
      </div>
    </div>
  )
}



