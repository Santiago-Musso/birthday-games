"use client"

import type { Player } from '@/types/domain'
import Link from 'next/link'
import { Avatar } from './avatars/Avatars'

export function PlayerCard({ player, highlight, points }: { player: Player; highlight?: boolean; points?: number }) {
  return (
    <div className={`card transition hover:shadow-glass hover:-translate-y-0.5 will-change-transform ${highlight ? 'ring-2 ring-blue-500 dark:ring-blue-400/60' : ''}`}>
      <div className="card-header">
        <div className="flex items-center gap-2">
          {player.avatarKey ? <Avatar keyName={player.avatarKey as any} className="h-6 w-6" /> : null}
          <div className="font-medium">{player.name}</div>
        </div>
        <div className="flex items-center gap-2">
          {typeof points === 'number' ? <span className="pill dark:border-white/10 text-[11px]">{points} pts</span> : null}
          <Link className="btn-ghost" href={`/players?id=${player.id}`}>👀 View</Link>
        </div>
      </div>
    </div>
  )
}


