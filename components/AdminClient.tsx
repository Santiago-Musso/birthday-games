"use client"

import { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { listPlayers, updatePlayer, deletePlayer, createPlayer } from '@/lib/players'
import { listTeams, createTeam, deleteTeam, updateTeam } from '@/lib/teams'
import { listAssignments, upsertAssignment } from '@/lib/assignments'
import { listScores } from '@/lib/scores'
import { randomizeTeamsEvenly } from '@/lib/randomizeTeams'
import type { GameKey, Player, Team } from '@/types/domain'

type SingleGame = Exclude<GameKey, 'bowling'>
const singlePlayerGames: SingleGame[] = ['daytona', 'basket', 'pump_it', 'air_tejo', 'punch']
const allGames: GameKey[] = ['daytona', 'basket', 'pump_it', 'air_tejo', 'punch', 'bowling']

export function AdminClient() {
  const qc = useQueryClient()
  const playersQ = useQuery({ queryKey: ['players'], queryFn: listPlayers })
  const teamsQ = useQuery({ queryKey: ['teams'], queryFn: listTeams })
  const assignmentsQ = useQuery({ queryKey: ['assignments'], queryFn: listAssignments })
  const scoresQ = useQuery({ queryKey: ['scores'], queryFn: listScores })

  const [teamCount, setTeamCount] = useState(2)
  const [isBusy, setIsBusy] = useState(false)
  const [busyMessage, setBusyMessage] = useState('')
  // Local drafts for scores: key `${teamId}:${game}` -> number
  const [scoreDrafts, setScoreDrafts] = useState<Record<string, number>>({})
  const existingScores = useMemo(() => scoresQ.data || [], [scoresQ.data])

  // When scores change from server and there's no local draft for a key, seed it for controlled inputs
  useEffect(() => {
    const next: Record<string, number> = { ...scoreDrafts }
    for (const s of existingScores) {
      const k = `${s.teamId}:${s.game}`
      if (next[k] === undefined) next[k] = Number(s.value) || 0
    }
    setScoreDrafts(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingScores.length])

  if (playersQ.isLoading || teamsQ.isLoading || assignmentsQ.isLoading || scoresQ.isLoading) {
    return <div className="py-10 text-center">Loading…</div>
  }
  if (playersQ.error || teamsQ.error || assignmentsQ.error || scoresQ.error) {
    return <div className="py-10 text-center text-red-600 dark:text-red-400">Failed to load admin data.</div>
  }

  const players = playersQ.data || []
  const teams = teamsQ.data || []
  const assignments = assignmentsQ.data || []
  const scores = scoresQ.data || []

  async function handleCreateTeams() {
    setIsBusy(true)
    setBusyMessage('Creating teams and randomizing players…')
    // Re-fetch fresh players to ensure we use the full set from API
    const freshPlayers = await listPlayers()

    await Promise.all(teams.map((t) => deleteTeam(t.id)))
    await Promise.all(freshPlayers.map((p) => updatePlayer(p.id, { teamId: null })))

    const baseNames = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange']
    const baseColors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#F97316']
    const desired = Math.max(2, Math.min(teamCount, 6))
    const created: Team[] = []
    for (let i = 0; i < desired; i++) {
      const t = await createTeam({ name: `${baseNames[i]} Team`, color: baseColors[i] })
      created.push(t)
    }

    const updated = randomizeTeamsEvenly(freshPlayers, created)
    // Update sequentially to avoid API throttling and ensure all players are assigned
    for (const p of updated) {
      try {
        await updatePlayer(p.id, { teamId: p.teamId ?? null })
        // small delay to be gentle with MockAPI
        await new Promise((r) => setTimeout(r, 120))
      } catch (e) {
        // continue with next player
      }
    }
    await qc.invalidateQueries({ queryKey: ['players'] })
    await qc.invalidateQueries({ queryKey: ['teams'] })
    setIsBusy(false)
    try { window.location.reload() } catch {}
  }

  function getTeamPlayers(teamId: string) {
    return players.filter((p) => p.teamId === teamId)
  }

  async function handleAssign(teamId: string, game: SingleGame, playerId: string) {
    await upsertAssignment({ teamId, game, playerId })
    await qc.invalidateQueries({ queryKey: ['assignments'] })
  }

  function setScoreDraft() {}

  async function saveAllScores() { /* Deprecated with player scoring */ }

  async function handleDeletePlayer(id: string) {
    await deletePlayer(id)
    await qc.invalidateQueries({ queryKey: ['players'] })
  }

  async function handleCreateAdminPlayer() {
    const name = prompt('Your name?')?.trim()
    if (!name) return
    const defaultSkills = { daytona: 3, basket: 3, pump_it: 3, air_tejo: 3, punch: 3, bowling: 3 } as const
    await createPlayer({ name, skills: defaultSkills, isAdmin: true, teamId: null })
    await qc.invalidateQueries({ queryKey: ['players'] })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Admin</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Teams</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm">Number of teams</label>
          <input
            type="number"
            min={2}
            max={6}
            value={teamCount}
            onChange={(e) => setTeamCount(parseInt(e.target.value || '2'))}
            className="w-20 rounded border px-2 py-1 dark:border-white/10 dark:bg-white/5"
          />
          <button onClick={handleCreateTeams} className="rounded bg-blue-600 text-white px-3 py-1">Create & Randomize</button>
        </div>
        <div className="grid gap-3">
          {teams.map((t) => (
            <div key={t.id} className="rounded border p-3 dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ background: t.color || '#E5E7EB' }} />
                  <input
                    defaultValue={t.name}
                    onBlur={async (e) => {
                      const v = e.target.value.trim() || 'Team'
                      if (v !== t.name) await updateTeam(t.id, { name: v })
                    }}
                    className="font-medium bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>{getTeamPlayers(t.id).length} players</div>
                <div className="flex items-center gap-2">
                  <label className="text-xs">Color</label>
                  <input
                    type="color"
                    defaultValue={t.color || '#E5E7EB'}
                    onChange={async (e) => {
                      await updateTeam(t.id, { color: e.target.value })
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Assignments</h2>
        <div className="space-y-4">
          {teams.map((t) => (
            <div key={t.id} className="rounded border p-3 space-y-2 dark:border-white/10">
              <div className="font-medium">{t.name}</div>
              {singlePlayerGames.map((g) => {
                const teamPlayers = getTeamPlayers(t.id)
                const current = assignments.find((a) => a.teamId === t.id && a.game === g)
                return (
                  <div key={g} className="flex items-center gap-2">
                    <label className="w-28 text-sm capitalize">{g.replace('_', ' ')}</label>
                    <select
                      className="flex-1 rounded border px-2 py-1 dark:border-white/10 dark:bg-white/5"
                      value={current?.playerId || ''}
                      onChange={(e) => handleAssign(t.id, g, e.target.value)}
                    >
                      <option value="">— Select —</option>
                      {teamPlayers.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      {/* Scores section removed – now players submit their own scores */}

      {isBusy && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="rounded-xl bg-[rgb(var(--surface))] px-4 py-3 flex items-center gap-2 shadow-soft border border-black/5 dark:border-white/10">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            <span className="text-sm font-medium">{busyMessage}</span>
          </div>
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Players</h2>
        <button onClick={handleCreateAdminPlayer} className="rounded bg-gray-800 text-white px-3 py-1">Create Admin Player</button>
        <div className="grid gap-3">
          {players.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded border p-3 dark:border-white/10">
              <div className="flex-1">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{p.isAdmin ? 'Admin' : ''}</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    try { localStorage.setItem('bg.playerId', p.id) } catch {}
                    alert('Marked you as this player on this device.')
                  }}
                  className="text-blue-600 text-sm"
                >Set as me</button>
                <button onClick={() => handleDeletePlayer(p.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}


