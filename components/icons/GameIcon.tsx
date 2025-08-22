"use client"

import type { GameKey } from '@/types/domain'

export function GameIcon({ game, className = '' }: { game: GameKey; className?: string }) {
  const icon =
    game === 'daytona' ? '🏁' :
    game === 'basket' ? '🏀' :
    game === 'pump_it' ? '💃' :
    game === 'punch' ? '🥊' :
    game === 'air_tejo' ? '💨' :
    game === 'bowling' ? '🎳' :
    '🎮'
  return <span className={className} aria-hidden>{icon}</span>
}


