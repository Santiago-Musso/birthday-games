'use client'

import { useEffect } from 'react'

export default function NotFound() {
  useEffect(() => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
      const already = new URLSearchParams(window.location.search).get('p')
      if (!already) {
        const targetPath = window.location.pathname + window.location.search + window.location.hash
        const redirect = `${base || ''}/?p=${encodeURIComponent(targetPath)}`
        if (window.location.href !== redirect) {
          window.location.replace(redirect)
        }
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-semibold">Not Found</div>
        <div className="text-sm text-gray-600 mt-2">Redirecting…</div>
      </div>
    </div>
  )
}


