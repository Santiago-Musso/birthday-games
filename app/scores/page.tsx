"use client"

import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listPlayers } from '@/lib/players'
import { listTeams } from '@/lib/teams'
import { listScores, upsertScore, listPlayerScores, upsertPlayerScore } from '@/lib/scores'
import type { GameKey, Player, Assignment, PlayerScore, Score } from '@/types/domain'
import { getStoredPlayerId } from '@/lib/storage'
import { listAssignments } from '@/lib/assignments'
import { Avatar } from '@/components/avatars/Avatars'
import { GameIcon } from '@/components/icons/GameIcon'

const allGames: GameKey[] = ['daytona', 'basket', 'pump_it', 'air_tejo', 'punch', 'bowling']

export default function ScoresPage() {
  const qc = useQueryClient()
  const playersQ = useQuery({ queryKey: ['players'], queryFn: listPlayers })
  const teamsQ = useQuery({ queryKey: ['teams'], queryFn: listTeams })
  const assignmentsQ = useQuery({ queryKey: ['assignments'], queryFn: listAssignments })
  const enablePlayerScores = process.env.NEXT_PUBLIC_ENABLE_PLAYER_SCORES === 'true'
  const playerScoresQ = useQuery({ queryKey: ['playerScores'], queryFn: listPlayerScores, enabled: enablePlayerScores })
  const scoresQ = useQuery({ queryKey: ['scores'], queryFn: listScores })

  const [scoreDrafts, setScoreDrafts] = useState<Record<string, number>>({})
  const existingScores = useMemo<Score[]>(() => (scoresQ.data as any) || [], [scoresQ.data])

  useEffect(() => {
    const next: Record<string, number> = { ...scoreDrafts }
    for (const s of existingScores) {
      const k = `${s.teamId}:${s.game}`
      if (next[k] === undefined) next[k] = Number(s.value) || 0
    }
    setScoreDrafts(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingScores.length])

  const youId = getStoredPlayerId()
  const isAdmin = useMemo(() => {
    const you = (playersQ.data || []).find((p) => p.id === youId)
    return !!you?.isAdmin
  }, [playersQ.data, youId])

  const loading = playersQ.isLoading || teamsQ.isLoading || scoresQ.isLoading || assignmentsQ.isLoading || (enablePlayerScores && playerScoresQ.isLoading)
  if (loading) return <div className="py-10 text-center">Loading…</div>
  if (playersQ.error || teamsQ.error || scoresQ.error || assignmentsQ.error || (enablePlayerScores && playerScoresQ.error)) return <div className="py-10 text-center text-red-600 dark:text-red-400">Failed to load scores.</div>

  const teams = teamsQ.data || []
  const scores = existingScores
  const players = playersQ.data || []
  const assignments = assignmentsQ.data || []
  const playerScores: PlayerScore[] = ((playerScoresQ.data as unknown) as PlayerScore[]) || []

  function getTeamTotal(teamId: string) {
    const teamPlayers = players.filter((p) => p.teamId === teamId).map((p) => p.id)
    const ps = playerScores.filter((s: PlayerScore) => teamPlayers.includes(s.playerId))
    if (ps.length > 0) return ps.reduce((acc: number, s: PlayerScore) => acc + (Number(s.value) || 0), 0)
    return scores.filter((s: Score) => s.teamId === teamId).reduce((acc: number, s: Score) => acc + (Number(s.value) || 0), 0)
  }

  async function saveAll() {
    if (!isAdmin) return
    // Save team scores (legacy) and per-player scores
    const teamChanges: { teamId: string; game: GameKey; value: number }[] = []
    const playerChanges: { playerId: string; game: GameKey; value: number }[] = []

    for (const t of teams) {
      for (const g of allGames) {
        const key = `${t.id}:${g}`
        const draft = scoreDrafts[key]
        const existing = scores.find((s) => s.teamId === t.id && s.game === g)?.value
        if (typeof draft === 'number' && draft !== Number(existing ?? NaN)) {
          teamChanges.push({ teamId: t.id, game: g, value: draft })
        }
      }
    }

    for (const c of teamChanges) {
      try { await upsertScore(c); await new Promise((r) => setTimeout(r, 100)) } catch {}
    }

    for (const c of playerChanges) {
      try { await upsertPlayerScore(c as any); await new Promise((r) => setTimeout(r, 80)) } catch {}
    }

    await qc.invalidateQueries({ queryKey: ['scores'] })
    await qc.invalidateQueries({ queryKey: ['playerScores'] })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Scores</h1>
      {!isAdmin ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">Read-only view. Only admins can edit scores.</div>
      ) : (
        <div className="flex justify-end">
          <button onClick={saveAll} className="btn-primary">Save all</button>
        </div>
      )}

      <div className="space-y-4">
        {teams.map((t) => (
          <section key={t.id} className="card">
            <div className="card-header">
              <div className="font-medium flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: t.color || '#E5E7EB' }} />
                {t.name}
              </div>
              <span className="pill dark:border-white/10">Total: {getTeamTotal(t.id)}</span>
            </div>
            <div className="card-body space-y-4">
              <div className="text-sm font-medium">Players</div>
              <div className="space-y-3">
                {players.filter((p) => p.teamId === t.id).map((p: Player) => {
                  // Determine which single-player games this player is assigned to
                  const assigned = (assignments as Assignment[]).filter((a) => a.teamId === t.id && a.playerId === p.id)
                  const gamesForPlayer: GameKey[] = ['bowling', ...assigned.map((a) => a.game as GameKey)]
                  return (
                    <div key={p.id} className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border p-3 bg-[rgb(var(--surface))]/60 supports-[backdrop-filter]:backdrop-blur hover:shadow-soft transition dark:border-white/10">
                      <div className="sm:w-48 w-full font-medium flex items-center gap-2">
                        {p.avatarKey ? <Avatar keyName={p.avatarKey} className="h-7 w-7" /> : <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold">{p.name.slice(0,1).toUpperCase()}</span>}
                        <span>{p.name}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1">
                        {gamesForPlayer.map((g) => {
                          const key = `${p.id}:${g}`
                          const existing = playerScores.find((s) => s.playerId === p.id && s.game === g)?.value ?? 0
                          const val = (scoreDrafts[key] as number | undefined) ?? existing
                          const label = g === 'bowling' ? 'Bowling' : g.replace('_', ' ')
                          return (
                            <div key={key} className="flex items-center gap-3 rounded-xl border px-3 py-2 dark:border-white/10">
                              <span className="text-sm text-gray-600 dark:text-gray-400 w-24 sm:w-28 capitalize inline-flex items-center gap-2"><GameIcon game={g} /> {label}</span>
                              {isAdmin ? (
                                <input
                                  type="number"
                                  className="w-32 sm:w-36 text-base rounded-lg border px-3 py-2 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[oklch(var(--primary))]"
                                  value={Number.isFinite(Number(val)) ? String(val) : ''}
                                  onChange={(e) => {
                                    const v = Number(e.target.value); if (Number.isNaN(v)) return
                                    setScoreDrafts((d) => ({ ...d, [key]: v }))
                                    upsertPlayerScore({ playerId: p.id, game: g, value: v })
                                  }}
                                />
                              ) : (
                                <div className="pill dark:border-white/10">{Number(val) || 0}</div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}


