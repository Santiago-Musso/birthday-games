import { api } from './apiClient'
import type { Assignment } from '@/types/domain'

export async function listAssignments(): Promise<Assignment[]> {
  try {
    return await api<Assignment[]>('assignments')
  } catch {
    return []
  }
}

export async function upsertAssignment(data: Omit<Assignment, 'id' | 'createdAt'>): Promise<Assignment> {
  // naive upsert: check existing by teamId+game
  const all = await listAssignments()
  const existing = all.find((a) => a.teamId === data.teamId && a.game === data.game)
  if (existing) {
    return api<Assignment>(`assignments/${existing.id}`, { method: 'PUT', body: JSON.stringify({ ...existing, ...data }) })
  }
  return api<Assignment>('assignments', { method: 'POST', body: JSON.stringify(data) })
}


