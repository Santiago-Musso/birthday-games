"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

type Item = { label: string; href: string }

export default function CommandPalette({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const filtered = useMemo(() => items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())), [items, q])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      if ((isMac && e.metaKey && e.key.toLowerCase() === 'k') || (!isMac && e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault(); setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative mx-auto mt-20 w-[min(92vw,720px)] rounded-2xl border bg-[rgb(var(--surface))]/80 supports-[backdrop-filter]:backdrop-blur-md p-3 shadow-glass" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 rounded-xl border px-3 py-2">
          <span className="text-gray-500">⌘K</span>
          <input ref={inputRef} placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 bg-transparent outline-none" />
        </div>
        <div className="mt-3 max-h-[50vh] overflow-auto">
          {filtered.length === 0 ? (
            <div className="p-3 text-sm text-gray-500">No results</div>
          ) : (
            <ul className="divide-y">
              {filtered.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className="block px-3 py-2 hover:bg-black/5 rounded-xl">
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}



