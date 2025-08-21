"use client"

type SvgProps = React.SVGProps<SVGSVGElement>

export const AVATAR_KEYS = ['cat', 'dog', 'panda', 'fox', 'bear', 'bunny'] as const
export type AvatarKey = typeof AVATAR_KEYS[number]

// Accepts string to gracefully handle legacy values; unknown keys fall back to 'cat'
export function Avatar({ keyName, className }: { keyName: string; className?: string }) {
  const k = (AVATAR_KEYS as readonly string[]).includes(keyName) ? (keyName as AvatarKey) : 'cat'
  const common: SvgProps = { viewBox: '0 0 64 64', className }
  const label = AVATAR_LABELS[k]
  switch (k) {
    case 'cat':
      return (
        <svg {...common} aria-hidden>
          <title>{label}</title>
          <rect width="64" height="64" rx="16" fill="#60a5fa" />
          <circle cx="32" cy="36" r="18" fill="#fde68a" />
          <path d="M18 22l6 6 4-4-7-8zM46 22l-6 6-4-4 7-8z" fill="#fde68a" />
          <circle cx="25" cy="36" r="3" fill="#0f172a" />
          <circle cx="39" cy="36" r="3" fill="#0f172a" />
          <path d="M28 44c3 3 5 3 8 0" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'dog':
      return (
        <svg {...common} aria-hidden>
          <title>{label}</title>
          <rect width="64" height="64" rx="16" fill="#f59e0b" />
          <circle cx="32" cy="36" r="18" fill="#fff7ed" />
          <ellipse cx="22" cy="30" rx="6" ry="8" fill="#fed7aa" />
          <ellipse cx="42" cy="30" rx="6" ry="8" fill="#fed7aa" />
          <circle cx="27" cy="36" r="3" fill="#0f172a" />
          <circle cx="37" cy="36" r="3" fill="#0f172a" />
          <path d="M28 44h8" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="40" r="3" fill="#0f172a" />
        </svg>
      )
    case 'panda':
      return (
        <svg {...common} aria-hidden>
          <title>{label}</title>
          <rect width="64" height="64" rx="16" fill="#111827" />
          <circle cx="32" cy="36" r="18" fill="#f9fafb" />
          <circle cx="22" cy="28" r="6" fill="#111827" />
          <circle cx="42" cy="28" r="6" fill="#111827" />
          <circle cx="26" cy="36" r="3" fill="#111827" />
          <circle cx="38" cy="36" r="3" fill="#111827" />
          <path d="M28 44c3 2 5 2 8 0" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'fox':
      return (
        <svg {...common} aria-hidden>
          <title>{label}</title>
          <rect width="64" height="64" rx="16" fill="#f97316" />
          <path d="M32 18l12 10-4 4-8-6-8 6-4-4z" fill="#fed7aa" />
          <circle cx="32" cy="38" r="14" fill="#ffedd5" />
          <circle cx="26" cy="38" r="3" fill="#0f172a" />
          <circle cx="38" cy="38" r="3" fill="#0f172a" />
          <path d="M28 44c3 2 5 2 8 0" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
    case 'bear':
      return (
        <svg {...common} aria-hidden>
          <title>{label}</title>
          <rect width="64" height="64" rx="16" fill="#92400e" />
          <circle cx="32" cy="36" r="18" fill="#fde68a" />
          <circle cx="24" cy="26" r="6" fill="#fbbf24" />
          <circle cx="40" cy="26" r="6" fill="#fbbf24" />
          <circle cx="27" cy="36" r="3" fill="#0f172a" />
          <circle cx="37" cy="36" r="3" fill="#0f172a" />
          <circle cx="32" cy="41" r="3" fill="#0f172a" />
        </svg>
      )
    case 'bunny':
      return (
        <svg {...common} aria-hidden>
          <title>{label}</title>
          <rect width="64" height="64" rx="16" fill="#38bdf8" />
          <circle cx="32" cy="40" r="16" fill="#f8fafc" />
          <rect x="22" y="14" width="6" height="14" rx="3" fill="#f8fafc" />
          <rect x="36" y="14" width="6" height="14" rx="3" fill="#f8fafc" />
          <circle cx="27" cy="40" r="3" fill="#0f172a" />
          <circle cx="37" cy="40" r="3" fill="#0f172a" />
          <path d="M28 46c3 3 5 3 8 0" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )
  }
}

export const AVATAR_LABELS: Record<AvatarKey, string> = {
  cat: 'Cat',
  dog: 'Dog',
  panda: 'Panda',
  fox: 'Fox',
  bear: 'Bear',
  bunny: 'Bunny',
}


