"use client"

import { Suspense } from 'react'
import { PlayerDetailClient } from '@/components/PlayerDetailClient'
import { useSearchParams } from 'next/navigation'

export default function PlayersPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-sm text-gray-600">Loading…</div>}>
      <PlayersPageInner />
    </Suspense>
  )
}

function PlayersPageInner() {
  const sp = useSearchParams()
  const id = sp.get('id') || ''
  if (!id) {
    return (
      <div className="py-10 text-center text-sm text-gray-600">
        No player selected.
      </div>
    )
  }
  return <PlayerDetailClient id={id} />
}


