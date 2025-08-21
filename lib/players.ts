import { api } from './apiClient'
import type { Player } from '@/types/domain'

export async function listPlayers(): Promise<Player[]> {
  try {
    return await api<Player[]>('players?page=1&limit=1000')
  } catch {
    return []
  }
}

export async function getPlayer(id: string): Promise<Player> {
  return api<Player>(`players/${id}`)
}

export async function createPlayer(data: Omit<Player, 'id' | 'createdAt'>): Promise<Player> {
  return api<Player>('players', { method: 'POST', body: JSON.stringify(data) })
}

export async function updatePlayer(id: string, data: Partial<Player>): Promise<Player> {
  return api<Player>(`players/${id}`, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deletePlayer(id: string): Promise<void> {
  await api(`players/${id}`, { method: 'DELETE' })
}


