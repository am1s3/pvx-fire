'use client'

import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [nick, setNick] = useState('')
  const [pass, setPass] = useState('')
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'error' | 'success' | ''>('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    
    if (nick.length < 3 || nick.length > 16 || !/^[a-zA-Z0-9_]+$/.test(nick)) {
      setMsg('Ник должен быть от 3 до 16 символов (латиница, цифры, _)')
      setMsgType('error')
      return
    }
    if (pass.length < 6) {
      setMsg('Пароль должен быть не менее 6 символов')
      setMsgType('error')
      return
    }

    setLoading(true)
    try {
      const hash = await hashPassword(pass)
      const { error } = await supabasePublic.from('users').insert({ 
        mc_nick: nick, 
        password_hash: hash 
      })
      
      if (error) {
        if (error.code === '23505') {
          setMsg('Этот никнейм уже занят. Выберите другой.')
        } else {
          setMsg('Ошибка сервера: ' + error.message)
        }
        setMsgType('error')
      } else {
        setMsg('Аккаунт успешно создан! Перенаправляем на вход...')
        setMsgType('success')
        setTimeout(() => router.push('/login'), 1500)
      }
    } catch (err: any) {
      setMsg('Критическая ошибка: ' + err.message)
      setMsgType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md bg-[#171717] border border-[#7f1d1d] rounded-xl p-8 shadow-2xl shadow-red-900/20">
        <h1 className="text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-2">
          Регистрация
        </h1>
        <p className="text-gray-500 text-center mb-6 text-sm">Создай аккаунт для доступа к ParaVerX</p>
        
        {msg && (
          <div className={`p-3 rounded-lg mb-4 text-sm font-medium border ${
            msgType === 'success' ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-red-900/20 border-red-800 text-red-400'
          }`}>
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Никнейм</label>
            <input 
              type="text" 
              value={nick} 
              onChange={e => setNick(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all"
              placeholder="Steve"
              autoFocus
            />
3          </div>

          <div>
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Пароль</label>
            <input 
              type="password" 
              value={pass} 
              onChange={e => setPass(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded-lg p-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all"
              placeholder="Минимум 6 символов"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-red-900/30"
          >
            {loading ? '⏳ Создание аккаунта...' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Уже есть аккаунт? <a href="/login" className="text-red-400 hover:text-red-300 font-semibold transition-colors">Войти</a>
        </p>
      </div>
    </div>
  )
}
