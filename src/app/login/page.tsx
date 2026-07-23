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

    setLoading(false)

    if (!user) {
      return setErr('❌ Игрок не найден')
    }

    const valid = await verifyPassword(pass, user.password_hash)
    if (!valid) {
      return setErr('❌ Неверный пароль')
    }

    localStorage.setItem('pvx_session', JSON.stringify({ 
      id: user.id, 
      nick: user.mc_nick, 
      isAdmin: user.is_admin 
    }))

    router.push(user.is_admin ? '/admin' : '/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-gradient text-center mb-6">
          Вход
        </h1>

        {err && (
          <div className="bg-red-900/30 border border-red-600 text-red-300 p-3 rounded mb-4 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Никнейм
            </label>
            <input 
              type="text" 
              value={nick} 
              onChange={e => setNick(e.target.value)}
              className="w-full bg-black/50 border border-red-900/50 rounded px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              placeholder="Steve"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Пароль
            </label>
            <input 
              type="password" 
              value={pass} 
              onChange={e => setPass(e.target.value)}
              className="w-full bg-black/50 border border-red-900/50 rounded px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              placeholder="Введите пароль"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded glow disabled:opacity-50"
          >
            {loading ? '⏳ Вход...' : 'Войти'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Нет аккаунта?{' '}
          <a href="/register" className="text-red-400 hover:text-red-300">
            Регистрация
          </a>
        </p>
      </div>
    </div>
  )
}
