'use client'

import { useQuery } from '@tanstack/react-query'
import { listPlayers } from '@/lib/players'
import { listTeams } from '@/lib/teams'
import { listScores, listPlayerScores } from '@/lib/scores'
import { listAssignments } from '@/lib/assignments'
import { PlayerCard } from '@/components/PlayerCard'
import { TeamCard } from '@/components/TeamCard'
import { Scoreboard } from '@/components/Scoreboard'
import { getStoredPlayerId } from '@/lib/storage'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/Skeleton'

export default function MainPage() {
  const playersQuery = useQuery({ queryKey: ['players'], queryFn: listPlayers })
  const teamsQuery = useQuery({ queryKey: ['teams'], queryFn: listTeams })
  const scoresQuery = useQuery({ queryKey: ['scores'], queryFn: listScores })
  const playerScoresQuery = useQuery({ queryKey: ['playerScores'], queryFn: listPlayerScores })
  const assignmentsQuery = useQuery({ queryKey: ['assignments'], queryFn: listAssignments })

  const playerId = getStoredPlayerId()

  if (playersQuery.isLoading || teamsQuery.isLoading || scoresQuery.isLoading || assignmentsQuery.isLoading || playerScoresQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div>
              <Skeleton className="skeleton-text w-40" />
              <div className="mt-1"><Skeleton className="skeleton-text w-24" /></div>
            </div>
          </div>
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>

        <section className="card">
          <div className="card-header">
            <Skeleton className="skeleton-text w-32" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="card-body space-y-2">
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
            <Skeleton className="h-10 w-full rounded" />
          </div>
        </section>
      </div>
    )
  }
  if (playersQuery.error || teamsQuery.error || scoresQuery.error || assignmentsQuery.error || playerScoresQuery.error) {
    return <div className="text-center py-10 text-red-600">Failed to load data.</div>
  }

  const players = playersQuery.data || []
  const teams = teamsQuery.data || []
  const scores = scoresQuery.data || []
  const playerScores = playerScoresQuery.data || []
  const assignments = assignmentsQuery.data || []

  const hasTeams = teams.length > 0
  const youTeamId = players.find((p) => p.id === playerId)?.teamId || null

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Birthday Games</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Form your teams, play hard, brag harder.</p>
          </div>
        </div>
        {!playerId ? (
          <Link className="btn-primary" href="/create-player"><span>➕</span><span>Create player</span></Link>
        ) : (
          <Link className="btn-ghost" href={`/players?id=${playerId}`} title="View your profile">👤 Me</Link>
        )}
      </header>

      <section className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold">🏆 Scoreboard</h2>
          <div className="flex items-center gap-2">
            <span className="pill">Total games: 6</span>
            <Link href="/scores" className="btn-ghost text-xs">Edit scores</Link>
          </div>
        </div>
        <div className="card-body">
          <Scoreboard teams={teams} scores={scores} youTeamId={youTeamId || undefined} playerScores={playerScores} players={players} />
        </div>
      </section>

      {!hasTeams ? (
        <section>
          <h2 className="text-lg font-medium mb-2">Participants</h2>
          <div className="grid gap-3">
            {players.map((p) => {
              const points = playerScores.filter((s) => s.playerId === p.id).reduce((acc, s) => acc + (Number(s.value) || 0), 0)
              return <PlayerCard key={p.id} player={p} highlight={p.id === playerId} points={points} />
            })}
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">👥 Teams</h2>
          <div className="grid gap-4">
            {teams.map((t) => (
              <TeamCard
                key={t.id}
                team={t}
                players={players.filter((p) => p.teamId === t.id)}
                assignments={assignments.filter((a) => a.teamId === t.id)}
                scores={scores}
                youId={playerId}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}


