import { api } from './apiClient'
import type { Team } from '@/types/domain'

export async function listTeams(): Promise<Team[]> {
  try {
    return await api<Team[]>('teams')
  } catch {
    return []
  }
}

export async function createTeam(data: Omit<Team, 'id' | 'createdAt'>): Promise<Team> {
  return api<Team>('teams', { method: 'POST', body: JSON.stringify(data) })
}

export async function updateTeam(id: string, data: Partial<Team>): Promise<Team> {
  return api<Team>(`teams/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteTeam(id: string): Promise<void> {
  await api(`teams/${id}`, { method: 'DELETE' })
}


