import type { Player, Team } from '@/types/domain'

export function randomizeTeamsEvenly(players: Player[], teams: Team[]): Player[] {
  if (teams.length === 0) return players.map((p) => ({ ...p, teamId: null }))

  // Keep current order stable to avoid confusion; randomness is optional.
  const shuffledPlayers = [...players]
  const numTeams = teams.length
  const totalPlayers = shuffledPlayers.length

  // Calculate exact quotas per team so distribution differs by at most 1
  const base = Math.floor(totalPlayers / numTeams)
  const remainder = totalPlayers % numTeams
  const quotas = Array.from({ length: numTeams }, (_, i) => base + (i < remainder ? 1 : 0))
  const assignedCounts = Array.from({ length: numTeams }, () => 0)

  let teamIndex = 0
  const updated: Player[] = []
  for (const player of shuffledPlayers) {
    // Move to next team that still has remaining quota
    while (teamIndex < numTeams && assignedCounts[teamIndex] >= quotas[teamIndex]) {
      teamIndex++
    }
    // If all initial quotas were filled due to rounding, wrap and place round-robin as fallback
    if (teamIndex >= numTeams) {
      // find first team with minimal count
      const minCount = Math.min(...assignedCounts)
      const idx = assignedCounts.findIndex((c) => c === minCount)
      assignedCounts[idx]++
      updated.push({ ...player, teamId: teams[idx].id })
    } else {
      assignedCounts[teamIndex]++
      updated.push({ ...player, teamId: teams[teamIndex].id })
    }
  }

  return updated
}


