'use client'

import { useState, useEffect } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [serverStatus, setServerStatus] = useState<any>(null)
  const [newPass, setNewPass] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('pvx_session')
    if (!session) { router.push('/login'); return }
    const parsed = JSON.parse(session)
    
    supabasePublic.from('users').select('*').eq('id', parsed.id).single().then(({ data }) => {
      setUser(data)
      setLoading(false)
    })

    // Тянем реальный статус сервера
    fetch('https://api.mcsrvstat.us/3/play.paraverx.net')
      .then(res => res.json())
      .then(data => setServerStatus(data))
      .catch(() => setServerStatus({ online: false }))
  }, [router])

  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPass.length < 6) return setMsg('Пароль слишком короткий, епт!')
    
    const hash = await hashPassword(newPass)
    const { error } = await supabasePublic.from('users').update({ password_hash: hash }).eq('id', user.id)
    
    if (error) setMsg('Ошибка при смене пароля!')
    else {
      setMsg('Пароль успешно изменен!')
      setNewPass('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('pvx_session')
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><div className="text-red-500 animate-pulse text-xl">Загрузка...</div></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
            Кабинет: {user.mc_nick}
          </h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-900/30 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/50 transition-all text-sm font-bold">
            Выйти
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Виджет статуса сервера */}
          <div className="bg-[#171717] border border-[#7f1d1d] rounded-xl p-6">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Статус сервера</h2>
            {serverStatus ? (
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${serverStatus.online ? 'text-green-500' : 'text-red-500'}`}>
                    {serverStatus.online ? 'ОНЛАЙН' : 'ОФФЛАЙН'}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    {serverStatus.online ? `${serverStatus.players.online} / ${serverStatus.players.max} игроков` : 'Сервер спит'}
                  </div>
                </div>
                <div className="text-4xl">{serverStatus.online ? '' : '🔴'}</div>
              </div>
            ) : (
              <div className="text-gray-500">Загрузка статуса...</div>
            )}
          </div>

          {/* Смена пароля */}
          <div className="bg-[#171717] border border-[#7f1d1d] rounded-xl p-6">
            <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Безопасность</h2>
            {msg && <div className="bg-red-900/20 text-red-400 p-2 rounded mb-3 text-sm">{msg}</div>}
            <form onSubmit={handleChangePass} className="flex gap-3">
              <input 
                type="password" 
                value={newPass} 
                onChange={e => setNewPass(e.target.value)}
                placeholder="Новый пароль"
                className="flex-1 bg-[#0a0a0a] border border-[#450a0a] rounded-lg p-2 text-white focus:border-red-500 focus:outline-none"
              />
              <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-colors">
                Сменить
              </button>
            </form>
          </div>
        </div>

        {/* Инфо об аккаунте */}
        <div className="bg-[#171717] border border-[#7f1d1d] rounded-xl p-6">
          <h2 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Данные аккаунта</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoBlock label="Статус" value={user.status} color={user.status === 'No Pass' ? 'text-red-500' : 'text-green-500'} />
            <InfoBlock label="Бан" value={user.is_banned ? 'ДА' : 'НЕТ'} color={user.is_banned ? 'text-red-500' : 'text-green-500'} />
            <InfoBlock label="Истекает" value={user.pass_end ? new Date(user.pass_end).toLocaleDateString('ru-RU') : '∞'} color="text-white" />
            <InfoBlock label="Роль" value={user.is_admin ? 'АДМИН' : 'ИГРОК'} color={user.is_admin ? 'text-orange-500' : 'text-gray-400'} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-[#0a0a0a] rounded-lg p-4 border border-[#450a0a]">
      <div className="text-gray-500 text-xs uppercase mb-1">{label}</div>
      <div className={`font-bold text-lg ${color}`}>{value}</div>
    </div>
  )
}
