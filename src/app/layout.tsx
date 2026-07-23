import './globals.css'
import type { Metadata } from 'next'

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
        url: 'https://paraverx.pages.dev/og-image.png', // Замени на ссылку на свою картинку
        width: 1200,
        height: 630,
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased selection:bg-red-500 selection:text-white">
        {children}
      </body>
    </html>
  )
}
