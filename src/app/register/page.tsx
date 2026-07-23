'use client'
import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [nick, setNick] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleReg = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(nick)) {
      setLoading(false)
      return setErr(' Ник 3-16 символов (латиница, цифры, _)')
    }
    if (pass.length < 6) {
      setLoading(false)
      return setErr('❌ Пароль минимум 6 символов')
    }

    const hash = await hashPassword(pass)
    const { error } = await supabasePublic.from('users').insert({ 
      mc_nick: nick, 
      password_hash: hash 
    })
    
    setLoading(false)
    
    if (error) {
      if (error.code === '23505') {
        return setErr('❌ Ник занят')
      }
      return setErr('❌ Ошибка: ' + error.message)
    }
    
    alert('✅ Аккаунт создан! Теперь войдите')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="card p-8 w-full max-w-md">
        <h1 className="text-3xl font-black text-gradient text-center mb-6">
          Регистрация
        </h1>

        {err && (
          <div className="bg-red-900/30 border border-red-600 text-red-300 p-3 rounded mb-4 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={handleReg} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Minecraft Ник
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
              placeholder="Минимум 6 символов"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded glow disabled:opacity-50"
          >
            {loading ? '⏳ Создание...' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-4">
          Уже есть аккаунт?{' '}
          <a href="/login" className="text-red-400 hover:text-red-300">
            Войти
          </a>
        </p>
      </div>
    </div>
  )
}
