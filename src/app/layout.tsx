import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PVX — MistikWorld',
  description: 'Официальный сайт и панель управления сервером PVX',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-abyss text-white">
        <nav className="border-b border-blood-900/30 bg-abyss/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember">
              PVX
            </a>
            <div className="flex gap-4">
              <a href="/login" className="text-gray-400 hover:text-blood-400 transition-colors">Вход</a>
              <a href="/register" className="px-4 py-2 bg-blood-600 hover:bg-blood-500 text-white rounded font-semibold transition-all glow-fire">
                Регистрация
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
