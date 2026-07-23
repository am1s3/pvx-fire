'use client'
import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { verifyPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [nick, setNick] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setLoading(true)

    const { data: user } = await supabasePublic
      .from('users')
      .select('*')
      .ilike('mc_nick', nick)
      .single()

    if (!user) {
      setLoading(false)
      return setErr('❌ Игрок не найден')
    }

    const valid = await verifyPassword(pass, user.password_hash)
    if (!valid) {
      setLoading(false)
      return setErr(' Неверный пароль')
    }

    // Сохраняем сессию
    localStorage.setItem('pvx_session', JSON.stringify({ 
      id: user.id, 
      nick: user.mc_nick, 
      isAdmin: user.is_admin 
    }))

    router.push(user.is_admin ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center px-4">
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blood-600/20 rounded-full blur-3xl float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-ember/20 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>

      <div className="glass rounded-2xl p-10 w-full max-w-md relative z-10 fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gradient-fire mb-2">
            Вход
          </h1>
          <p className="text-gray-400">
            Добро пожаловать обратно, воин
          </p>
        </div>

        {err && (
          <div className="bg-blood-950/50 border border-blood-600 text-blood-300 p-4 rounded-lg mb-6 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-semibold">
              Никнейм
            </label>
            <input 
              type="text" 
              value={nick} 
              onChange={e => setNick(e.target.value)}
              className="w-full bg-abyss border-2 border-blood-900/50 rounded-lg px-4 py-3 text-white focus:border-blood-500 focus:outline-none transition-all placeholder-gray-600"
              placeholder="Steve"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 font-semibold">
              Пароль
            </label>
            <input 
              type="password" 
              value={pass} 
              onChange={e => setPass(e.target.value)}
              className="w-full bg-abyss border-2 border-blood-900/50 rounded-lg px-4 py-3 text-white focus:border-blood-500 focus:outline-none transition-all placeholder-gray-600"
              placeholder="Введите пароль"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blood-600 to-ember text-white font-bold rounded-lg text-lg fire-button uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Загрузка...' : 'Войти'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Нет аккаунта?{' '}
          <a href="/register" className="text-blood-400 hover:text-blood-300 font-semibold transition-colors">
            Регистрация
          </a>
        </p>
      </div>
    </div>
  )
}
