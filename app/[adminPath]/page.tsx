import { AdminClient } from '@/components/AdminClient'

export async function generateStaticParams(): Promise<{ adminPath: string }[]> {
  const p = (process.env.NEXT_PUBLIC_ADMIN_PATH || 'admin').trim()
  return [{ adminPath: p }]
}

export const dynamic = 'error'
export const dynamicParams = false

export default function AdminPage() {
  return <AdminClient />
}


