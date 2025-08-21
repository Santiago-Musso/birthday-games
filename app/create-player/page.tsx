'use client'

import { useRouter } from 'next/navigation'
import { PlayerForm } from '@/components/PlayerForm'
import { createPlayer } from '@/lib/players'
import { setStoredPlayerId } from '@/lib/storage'

export default function CreatePlayerPage() {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Create Player</h1>
      <PlayerForm
        onSubmit={async (payload) => {
          const created = await createPlayer(payload)
          setStoredPlayerId(created.id)
          router.push('/')
        }}
      />
    </div>
  )
}


