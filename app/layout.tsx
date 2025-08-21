import '../styles/globals.css'
import { ReactNode } from 'react'
import { QueryProvider } from '@/lib/queryClient'
import dynamic from 'next/dynamic'
import { ToastProvider } from '@/components/ui/ToastProvider'
const DynamicSiteHeader = dynamic(() => import('@/components/SiteHeader'), { ssr: false })

export const metadata = {
  title: 'Birthday Games',
  description: 'Organize and score multi-game team competitions',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-[rgb(var(--text))] bg-[rgb(var(--bg))]">
        <QueryProvider>
          <ToastProvider>
            <DynamicSiteHeader />
            <main className="max-w-2xl mx-auto px-3 py-4">
              {children}
            </main>
            <ThemeScript />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

function ThemeScript() {
  // Inline script to avoid FOUC; prefers-color-scheme with localStorage persistence
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(() => { try { const s = localStorage.getItem('bg.theme'); const m = window.matchMedia('(prefers-color-scheme: dark)').matches; const d = s ? s === 'dark' : m; document.documentElement.classList.toggle('dark', d); } catch {} })();`,
      }}
    />
  )
}


