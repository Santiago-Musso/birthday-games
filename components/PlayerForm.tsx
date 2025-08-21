"use client"

import { useState } from 'react'
import type { GameKey, Player } from '@/types/domain'
import { AVATAR_KEYS, Avatar, AVATAR_LABELS } from './avatars/Avatars'
import { RadarSkills } from './RadarSkills'

type Skills = Player['skills']

export function PlayerForm({ onSubmit }: { onSubmit: (data: { name: string; skills: Skills; isAdmin?: boolean; teamId?: string | null; avatarKey?: string | null; phrase?: string | null }) => Promise<void> }) {
  const [name, setName] = useState('')
  const [skills, setSkills] = useState<Skills>({ daytona: 3, basket: 3, pump_it: 3, air_tejo: 3, punch: 3, bowling: 3 })
  const [submitting, setSubmitting] = useState(false)
  const [avatarKey, setAvatarKey] = useState<string>('spark')
  const [phrase, setPhrase] = useState('')

  const games: GameKey[] = ['daytona', 'basket', 'pump_it', 'air_tejo', 'punch', 'bowling']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), skills, teamId: null, isAdmin: false, ...(avatarKey ? { avatarKey } : {}), phrase: phrase.trim() || null })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
      </div>

      <div>
        <label className="block text-sm font-medium">Your phrase (optional)</label>
        <input value={phrase} onChange={(e) => setPhrase(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" placeholder="e.g., Fast and curious" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Choose an avatar</label>
        <div className="mb-3">
          <div className="inline-flex items-center gap-3 rounded-2xl border px-3 py-2 dark:border-white/10">
            <Avatar keyName={avatarKey as any} className="h-12 w-12 sm:h-16 sm:w-16" />
            <div className="text-sm text-gray-600 dark:text-gray-400">{AVATAR_LABELS[(avatarKey as keyof typeof AVATAR_LABELS) || 'cat']}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {AVATAR_KEYS.map((k) => (
            <button
              type="button"
              key={k}
              onClick={() => setAvatarKey(k)}
              className={`rounded-xl border p-2 transition hover:shadow-soft flex flex-col items-center gap-1 ${avatarKey === k ? 'ring-2 ring-blue-500 border-blue-300' : 'border-gray-200 dark:border-white/10'}`}
              aria-label={`Select avatar ${k}`}
            >
              <Avatar keyName={k as any} className="h-12 w-12" />
              <span className="text-[11px] text-gray-600 dark:text-gray-400">{AVATAR_LABELS[k as keyof typeof AVATAR_LABELS]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        {games.map((g) => (
          <div key={g} className="flex items-center gap-3">
            <label className="w-24 text-sm capitalize">{g.replace('_', ' ')}</label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={skills[g]}
              onChange={(e) => setSkills((s) => ({ ...s, [g]: Number(e.target.value) as any }))}
              className="flex-1"
            />
            <span className="w-6 text-center text-sm">{skills[g]}</span>
          </div>
        ))}
      </div>

      <div className="rounded border p-3">
        <RadarSkills skills={skills} />
      </div>

      <button type="submit" disabled={submitting} className="w-full rounded bg-blue-600 text-white py-2">
        {submitting ? 'Creating…' : 'Create Player'}
      </button>
    </form>
  )
}


