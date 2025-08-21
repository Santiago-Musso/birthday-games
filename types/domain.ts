export type GameKey = 'daytona' | 'basket' | 'pump_it' | 'air_tejo' | 'punch' | 'bowling'

export type Player = {
  id: string
  name: string
  skills: { [K in GameKey]: 1 | 2 | 3 | 4 | 5 }
  teamId?: string | null
  isAdmin?: boolean
  avatarKey?: string | null
  phrase?: string | null
  createdAt: string
}

export type Team = {
  id: string
  name: string
  color?: string
  createdAt: string
}

export type Assignment = {
  id: string
  teamId: string
  game: Exclude<GameKey, 'bowling'>
  playerId: string
  createdAt: string
}

export type Score = {
  id: string
  teamId: string
  game: GameKey
  value: number
  createdAt: string
}

export type PlayerScore = {
  id: string
  playerId: string
  game: GameKey
  value: number
  createdAt: string
}


