const BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://68a6840d639c6a54e99eefa9.mockapi.io/birthday-games/'

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE.replace(/\/$/, '') + '/' + path.replace(/^\//, ''), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`API ${res.status}: ${txt}`)
  }
  return res.json()
}


