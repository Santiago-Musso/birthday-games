"use client"

import type { GameKey, Score, Team, Player, PlayerScore } from '@/types/domain'

const gameKeys: GameKey[] = ['daytona', 'basket', 'pump_it', 'air_tejo', 'punch', 'bowling']

export function Scoreboard({ teams, scores, youTeamId, playerScores, players }: { teams: Team[]; scores: Score[]; youTeamId?: string; playerScores?: PlayerScore[]; players?: Player[] }) {
  const totalByTeam: Record<string, number> = {}
  const perGameByTeam: Record<string, Partial<Record<GameKey, number>>> = {}
  for (const t of teams) {
    totalByTeam[t.id] = 0
    perGameByTeam[t.id] = {}
  }
  if (playerScores && players) {
    const playerById: Record<string, Player> = Object.fromEntries(players.map((p) => [p.id, p]))
    for (const ps of playerScores) {
      const p = playerById[ps.playerId]
      if (!p || !p.teamId) continue
      const value = Number(ps.value)
      if (!Number.isFinite(value)) continue
      totalByTeam[p.teamId] = (totalByTeam[p.teamId] || 0) + value
      perGameByTeam[p.teamId] = perGameByTeam[p.teamId] || {}
      perGameByTeam[p.teamId][ps.game as GameKey] = (perGameByTeam[p.teamId][ps.game as GameKey] || 0) + value
    }
  } else {
    for (const s of scores) {
      const value = Number(s.value)
      if (!Number.isFinite(value)) continue
      totalByTeam[s.teamId] = (totalByTeam[s.teamId] || 0) + value
      perGameByTeam[s.teamId] = perGameByTeam[s.teamId] || {}
      perGameByTeam[s.teamId][s.game as GameKey] = value
    }
  }
  const ordered = [...teams].sort((a, b) => (totalByTeam[b.id] || 0) - (totalByTeam[a.id] || 0))

  return (
    <div className="divide-y">
      {ordered.map((t, i) => (
        <div key={t.id} className="p-3 card transition hover:shadow-glass will-change-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ background: t.color || '#E5E7EB' }} />
              <span className="font-medium">{i + 1}. {t.name} {youTeamId === t.id ? <em className="text-blue-600 text-xs">(You)</em> : null}</span>
            </div>
            <div className="font-semibold">{totalByTeam[t.id] || 0}</div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-700 dark:text-gray-300">
            {gameKeys.map((g) => (
              <div key={g} className="rounded border px-2 py-1 capitalize border-black/10 dark:border-white/10 dark:bg-white/5">
                {g.replace('_', ' ')}: {perGameByTeam[t.id]?.[g] ?? 0}
              </div>
            ))}
          </div>
        </div>
      ))}
      {teams.length === 0 && <div className="p-3 text-sm text-gray-600 dark:text-gray-400">No teams yet. Waiting for admin.</div>}
    </div>
  )
}


