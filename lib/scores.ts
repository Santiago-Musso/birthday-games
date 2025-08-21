import { api } from './apiClient'
import type { Score, PlayerScore } from '@/types/domain'

export async function listScores(): Promise<Score[]> {
  try {
    return await api<Score[]>('scores')
  } catch {
    return []
  }
}

export async function upsertScore(data: Omit<Score, 'id' | 'createdAt'>): Promise<Score> {
  const all = await listScores()
  const existing = all.find((s) => s.teamId === data.teamId && s.game === data.game)
  if (existing) {
    return api<Score>(`scores/${existing.id}`, { method: 'PUT', body: JSON.stringify({ ...existing, ...data }) })
  }
  return api<Score>('scores', { method: 'POST', body: JSON.stringify(data) })
}

// Player scores (per-user scoring)
export async function listPlayerScores(): Promise<PlayerScore[]> {
  try {
    return await api<PlayerScore[]>('playerScores')
  } catch {
    return []
  }
}

export async function upsertPlayerScore(data: Omit<PlayerScore, 'id' | 'createdAt'>): Promise<PlayerScore> {
  const all = await listPlayerScores()
  const existing = all.find((s) => s.playerId === data.playerId && s.game === data.game)
  if (existing) {
    return api<PlayerScore>(`playerScores/${existing.id}`, { method: 'PUT', body: JSON.stringify({ ...existing, ...data }) })
  }
  return api<PlayerScore>('playerScores', { method: 'POST', body: JSON.stringify(data) })
}


