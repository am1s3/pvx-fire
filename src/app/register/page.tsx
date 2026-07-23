'use client'
import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [nick, setNick] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleReg = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(nick)) {
      return setErr('❌ Ник должен быть 3-16 символов (латиница, цифры, _)')
    }
    if (pass.length < 6) {
      return setErr('❌ Пароль минимум 6 символов')
    }

    const hash = await hashPassword(pass)
    const { error } = await supabasePublic.from('users').insert({ 
      mc_nick: nick, 
      password_hash: hash 
    })
    
    if (error) {
      if (error.code === '23505') {
        return setErr('❌ Этот ник уже занят')
      }
      return setErr('❌ Ошибка регистрации: ' + error.message)
    }
    
    setSuccess(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-animated flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-12 text-center max-w-md fade-in-up pulse-fire">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-black text-gradient-fire mb-4">Успешно!</h2>
          <p className="text-gray-300 mb-6">
            Аккаунт <span className="text-white font-bold">{nick}</span> создан!
          </p>
          <p className="text-gray-400 text-sm">
            Перенаправляем на страницу входа...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center px-4">
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blood-600/20 rounded-full blur-3xl float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-ember/20 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>

      <div className="glass rounded-2xl p-10 w-full max-w-md relative z-10 fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gradient-fire mb-2">
            Регистрация
          </h1>
          <p className="text-gray-400">
            Создай аккаунт и начни приключение
          </p>
        </div>

        {err && (
          <div className="bg-blood-950/50 border border-blood-600 text-blood-300 p-4 rounded-lg mb-6 text-sm">
            {err}
          </div>
        )}

        <form onSubmit={handleReg} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2 font-semibold">
              Minecraft Никнейм
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
              placeholder="Минимум 6 символов"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-gradient-to-r from-blood-600 to-ember text-white font-bold rounded-lg text-lg fire-button uppercase tracking-wider"
          >
            Создать аккаунт
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Уже есть аккаунт?{' '}
          <a href="/login" className="text-blood-400 hover:text-blood-300 font-semibold transition-colors">
            Войти
          </a>
        </p>
      </div>
    </div>
  )
}
