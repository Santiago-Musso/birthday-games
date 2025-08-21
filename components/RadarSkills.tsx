"use client"

import { useEffect, useState } from 'react'
import { Radar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import type { Player } from '@/types/domain'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

export function RadarSkills({ skills }: { skills: Player['skills'] }) {
  const labels = ['daytona', 'basket', 'pump_it', 'air_tejo', 'punch', 'bowling']
  const initialDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const [isDark, setIsDark] = useState(initialDark)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const el = document.documentElement
    const obs = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'))
    })
    obs.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => obs.disconnect()
  }, [])
  const data = {
    labels,
    datasets: [
      {
        label: 'Self rating',
        data: labels.map((k) => skills[k as keyof typeof skills] as number),
        backgroundColor: 'rgba(59, 130, 246, 0.18)',
        borderColor: 'rgb(96, 165, 250)',
        pointBackgroundColor: 'rgb(147, 197, 253)',
        pointBorderColor: 'rgb(37, 99, 235)',
        pointRadius: 3,
        borderWidth: 2,
      },
    ],
  }
  const gridColor = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'
  const fontColor = isDark ? '#cbd5e1' : '#475569'
  const options = {
    scales: {
      r: {
        beginAtZero: true,
        min: 0,
        max: 5,
        ticks: { stepSize: 1, color: fontColor, backdropColor: 'rgba(0,0,0,0)' },
        grid: { color: gridColor },
        angleLines: { color: gridColor },
        pointLabels: { color: fontColor },
      },
    },
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
  } as const

  return (
    <div className="h-64">
      <Radar data={data} options={options} />
    </div>
  )
}


