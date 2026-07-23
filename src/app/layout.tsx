'use client' // ЭТА СТРОКА ОБЯЗАТЕЛЬНА ДЛЯ КЛИЕНТ-КОМПОНЕНТОВ

import './globals.css'
import type { Metadata } from 'next'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useEffect, useState } from 'react'
import ScrollProgress from '@/components/ScrollProgress'

export const metadata: Metadata = {
  title: {
    default: 'ParaVerX — Мистический Minecraft Сервер',
    template: '%s | ParaVerX'
  },
  description: 'Самый лучший майнкрафт сервер про мистику. Заходи и выживай.',
  openGraph: {
    title: 'ParaVerX — Мистический Minecraft Сервер',
    description: 'Самый лучший майнкрафт сервер про мистику. Заходи и выживай.',
    url: 'https://paraverx.pages.dev',
    siteName: 'ParaVerX',
    images: [
      {
        url: 'https://paraverx.pages.dev/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    loadSlim().then(() => setInit(true))
  }, [])

  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased selection:bg-red-500 selection:text-white">
        <ScrollProgress />
        {init && (
          <Particles
            id="tsparticles"
            options={{
              background: { color: { value: "#0a0a0a" } },
              fpsLimit: 60,
              particles: {
                color: { value: ["#ef4444", "#f97316", "#dc2626"] },
                move: { enable: true, speed: 1.5, direction: "top", random: true },
                number: { value: 60, density: { enable: true, area: 800 } },
                opacity: { value: { min: 0.3, max: 0.8 } },
                size: { value: { min: 1, max: 3 } },
              },
              detectRetina: true,
            }}
            className="fixed inset-0 -z-10"
          />
        )}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
