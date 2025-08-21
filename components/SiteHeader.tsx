"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="site-header-inner">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>🎉</span>
          <span className="font-semibold text-sm">Birthday Games</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('bg.theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const initial = saved ? saved === 'dark' : prefersDark
      setIsDark(initial)
    } catch {}
  }, [])
  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', isDark)
      localStorage.setItem('bg.theme', isDark ? 'dark' : 'light')
    } catch {}
  }, [isDark])
  return (
    <button aria-label="Toggle dark mode" className="btn-ghost" onClick={() => setIsDark((d) => !d)}>
      {isDark ? '🌙' : '☀️'}
    </button>
  )
}


