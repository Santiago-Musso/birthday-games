"use client"

import type { Assignment, GameKey, Player, Team, Score, PlayerScore } from '@/types/domain'
import Link from 'next/link'
import { Avatar } from './avatars/Avatars'

const gameLabels: Record<GameKey, string> = {
  daytona: 'Daytona',
  basket: 'Basket',
  pump_it: 'Pump It',
  air_tejo: 'Air Tejo',
  punch: 'Punch',
  bowling: 'Bowling',
}

export function TeamCard({ team, players, assignments, scores, youId, playerScores }: { team: Team; players: Player[]; assignments?: Assignment[]; scores?: Score[]; youId?: string | null; playerScores?: PlayerScore[] }) {
  const byId: Record<string, Player> = Object.fromEntries(players.map((p) => [p.id, p]))
  const pointsByPlayerId: Record<string, number> = {}
  if (playerScores) {
    for (const ps of playerScores) {
      if (!byId[ps.playerId]) continue
      pointsByPlayerId[ps.playerId] = (pointsByPlayerId[ps.playerId] || 0) + (Number(ps.value) || 0)
    }
  }
  return (
    <div className="card overflow-hidden transition hover:shadow-glass hover:-translate-y-0.5 will-change-transform">
      <div className="card-header">
        <div className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: team.color || '#E5E7EB' }} />
          <span className="font-medium">{team.name}</span>
        </div>
        <span className="pill dark:border-white/10">{players.length} players</span>
      </div>
      <div className="card-body space-y-3">
        {assignments && assignments.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {assignments.map((a) => {
              const player = byId[a.playerId]
              if (!player) return null
              return (
                <div key={`${a.teamId}-${a.game}`} className="flex items-center justify-between rounded-lg border border-gray-200 bg-white/80 supports-[backdrop-filter]:backdrop-blur px-2 py-1 text-xs dark:border-white/10 dark:bg-white/5">
                  <span className="capitalize text-gray-600">{gameLabels[a.game as keyof typeof gameLabels]}</span>
                  <span className="font-medium">{player.name}</span>
                </div>
              )
            })}
          </div>
        ) : null }

        <div className="grid grid-cols-2 gap-2">
          {players.map((p) => (
            <Link
              key={p.id}
              href={`/players?id=${p.id}`}
              className={`flex items-center gap-2 rounded-lg border px-2 py-1 text-sm hover:border-blue-300 transition ${youId && youId === p.id ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-200 bg-white/80 supports-[backdrop-filter]:backdrop-blur dark:border-white/10 dark:bg-white/5'}`}
            >
              {p.avatarKey ? (
                <Avatar keyName={p.avatarKey as any} className="h-6 w-6" />
              ) : (
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">
                  {p.name.slice(0,1).toUpperCase()}
                </span>
              )}
              <span>{p.name}</span>
              <span className="ml-auto flex items-center gap-2">
                {typeof pointsByPlayerId[p.id] === 'number' ? (
                  <span className="pill dark:border-white/10 text-[10px]">{pointsByPlayerId[p.id]} pts</span>
                ) : null}
                {youId && youId === p.id ? <span className="text-[10px] text-blue-600">You</span> : null}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


