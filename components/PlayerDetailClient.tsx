"use client"

import { useQuery } from '@tanstack/react-query'
import { getPlayer } from '@/lib/players'
import { listTeams } from '@/lib/teams'
import { RadarSkills } from '@/components/RadarSkills'
 
import { Avatar, AVATAR_LABELS } from './avatars/Avatars'

export function PlayerDetailClient({ id }: { id: string }) {
  const playerQ = useQuery({ queryKey: ['players', id], queryFn: () => getPlayer(id), enabled: !!id })
  const teamsQ = useQuery({ queryKey: ['teams'], queryFn: listTeams })

  if (playerQ.isLoading || teamsQ.isLoading) return <div className="py-10 text-center">Loading…</div>
  if (playerQ.error || !playerQ.data) return <div className="py-10 text-center text-red-600 dark:text-red-400">Player not found.</div>

  const player = playerQ.data
  const team = teamsQ.data?.find((t) => t.id === player.teamId)
 

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


