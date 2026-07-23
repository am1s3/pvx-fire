'use client'

import { useState, useEffect } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('pvx_session')
    if (!session) {
      router.push('/login')
      return
    }

    const parsed = JSON.parse(session)
    
    // Загружаем свежие данные о пользователе
    supabasePublic.from('users').select('*').eq('id', parsed.id).single().then(({ data, error }) => {
      if (error || !data) {
        localStorage.removeItem('pvx_session')
        router.push('/login')
      } else {
        setUser(data)
      }
      setLoading(false)
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('pvx_session')
    router.push('/')
  }

  const copyIP = () => {
    navigator.clipboard.writeText('play.paraverx.net') // Замени на свой IP
    alert('IP скопирован!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-red-500 text-xl font-bold animate-pulse">Загрузка данных...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            Личный кабинет
          </h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-900/30 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/50 transition-all text-sm font-bold"
          >
            Выйти
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#171717] border border-[#7f1d1d] rounded-xl p-6">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Информация об аккаунте</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Никнейм:</span>
                <span className="font-bold text-white">{user.mc_nick}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Статус:</span>
                <span className={`font-bold ${user.status === 'No Pass' ? 'text-red-500' : 'text-green-500'}`}>
                  {user.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Бан:</span>
                <span className={`font-bold ${user.is_banned ? 'text-red-500' : 'text-green-500'}`}>
                  {user.is_banned ? 'ДА' : 'НЕТ'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Истекает:</span>
                <span className="font-bold text-white">
                  {user.pass_end ? new Date(user.pass_end).toLocaleDateString('ru-RU') : 'Никогда'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#171717] border border-[#7f1d1d] rounded-xl p-6 flex flex-col justify-center items-center text-center">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Подключение к серверу</h2>
            <div className="bg-[#0a0a0a] border border-[#450a0a] rounded-lg p-4 w-full mb-4 flex items-center justify-between">
              <code className="text-orange-400 font-mono text-lg">play.paraverx.net</code>
              <button 
                onClick={copyIP}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-colors"
              >
                КОПИРОВАТЬ
              </button>
            </div>
            <p className="text-gray-500 text-sm">Используйте этот IP в лаунчере для входа в игру.</p>
          </div>
        </div>

        {user.is_banned && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center">
            <h3 className="text-red-500 font-bold text-xl mb-2">⛔ Ваш аккаунт заблокирован</h3>
            <p className="text-gray-400">Причина: {user.ban_reason || 'Не указана'}</p>
            <p className="text-gray-500 text-sm mt-2">Если вы считаете это ошибкой, создайте тикет в Discord.</p>
          </div>
        )}
      </div>
    </div>
  )
}
