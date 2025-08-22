"use client"

import { useQuery } from '@tanstack/react-query'
import { getPlayer } from '@/lib/players'
import { listTeams } from '@/lib/teams'
import { RadarSkills } from '@/components/RadarSkills'
import { listPlayerScores } from '@/lib/scores'
import type { GameKey } from '@/types/domain'
import { GameIcon } from './icons/GameIcon'
import { Avatar, AVATAR_LABELS } from './avatars/Avatars'

export function PlayerDetailClient({ id }: { id: string }) {
  const playerQ = useQuery({ queryKey: ['players', id], queryFn: () => getPlayer(id), enabled: !!id })
  const teamsQ = useQuery({ queryKey: ['teams'], queryFn: listTeams })
  const playerScoresQ = useQuery({ queryKey: ['playerScores'], queryFn: listPlayerScores })

  if (playerQ.isLoading || teamsQ.isLoading || playerScoresQ.isLoading) return <div className="py-10 text-center">Loading…</div>
  if (playerQ.error || !playerQ.data) return <div className="py-10 text-center text-red-600 dark:text-red-400">Player not found.</div>

  const player = playerQ.data
  const team = teamsQ.data?.find((t) => t.id === player.teamId)
  const scores = (playerScoresQ.data || []).filter((s) => s.playerId === player.id)
  const total = scores.reduce((a, s) => a + (Number(s.value) || 0), 0)
  const byGame = scores.reduce<Record<GameKey, number>>((acc, s: any) => {
    acc[s.game as GameKey] = (acc[s.game as GameKey] || 0) + (Number(s.value) || 0)
    return acc
  }, {} as any)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {player.avatarKey ? (
          <div className="flex flex-col items-center">
            <Avatar keyName={player.avatarKey as any} className="h-16 w-16 sm:h-20 sm:w-20" />
            <span className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">{AVATAR_LABELS[(player.avatarKey as keyof typeof AVATAR_LABELS) || 'cat']}</span>
          </div>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold">{player.name}</h1>
          {player.phrase ? <p className="text-sm text-gray-600 dark:text-gray-400">“{player.phrase}”</p> : null}
        </div>
      </div>

      <div className="rounded-2xl border p-4 dark:border-white/10 card">
        <div className="text-sm font-medium mb-2">Skills</div>
        <RadarSkills skills={player.skills} />
      </div>

      <div className="rounded-2xl border p-4 dark:border-white/10 card">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Points</div>
          <span className="pill dark:border-white/10">Total: {total}</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {(['daytona','basket','pump_it','air_tejo','punch','bowling'] as GameKey[]).map((g) => (
            <div key={g} className="flex items-center justify-between rounded-lg border px-2 py-1 dark:border-white/10">
              <div className="flex items-center gap-2 capitalize"><GameIcon game={g} /> {g.replace('_',' ')}</div>
              <div className="font-medium">{byGame[g] ?? 0}</div>
            </div>
          ))}
        </div>
      </div>

      {team && (
        <div className="rounded-2xl border p-4 dark:border-white/10 card">
          <div className="text-sm text-gray-600 dark:text-gray-400">Team</div>
          <div className="font-medium flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: team.color || '#E5E7EB' }} />
            {team.name}
          </div>
        </div>
      )}
    </div>
  )
}


