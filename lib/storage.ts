const KEY = 'bg.playerId'

export function getStoredPlayerId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function setStoredPlayerId(id: string) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(KEY, id)
  } catch {}
}


