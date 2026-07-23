'use client'
import { useState, useEffect } from 'react'
import { supabasePublic } from '@/lib/supabase'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [promo, setPromo] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const s = localStorage.getItem('pvx_session')
    if (s) {
      const parsed = JSON.parse(s)
      supabasePublic.from('users').select('*').eq('id', parsed.id).single().then(({data}) => setUser(data))
    } else window.location.href = '/login'
  }, [])

  const applyPromo = async () => {
    const { data: p } = await supabasePublic.from('promocodes').select('*').eq('code', promo).single()
    if (!p || p.uses_left <= 0) return setMsg('❌ Промокод недействителен')
    
    if (p.type === 'days') {
      const end = new Date(); end.setDate(end.getDate() + p.days)
      await supabasePublic.from('users').update({ status: `Promo (${p.code})`, pass_end: end.toISOString() }).eq('id', user.id)
    } else {
      await supabasePublic.from('users').update({ active_discount: { code: p.code, percent: p.discount } }).eq('id', user.id)
    }
    await supabasePublic.from('promocodes').update({ uses_left: p.uses_left - 1 }).eq('code', promo)
    setMsg('✅ Активировано!')
    setPromo('')
  }

  if (!user) return <p className="text-center mt-20">Загрузка...</p>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-8">ЛИЧНЫЙ КАБИНЕТ</h1>
      <div className="bg-ash border border-blood-900/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">👤 Профиль</h2>
        <p>Ник: <code className="bg-black px-2 py-1 rounded">{user.mc_nick}</code></p>
        <p>Статус: <span className="text-white font-bold">{user.status}</span></p>
        <p>Истекает: <code>{user.pass_end ? new Date(user.pass_end).toLocaleDateString() : 'Никогда'}</code></p>
        <p>Бан: {user.is_banned ? '🔴 ДА' : '🟢 НЕТ'}</p>
      </div>
      <div className="bg-ash border border-blood-900/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">🎁 Промокод</h2>
        <div className="flex gap-3">
          <input value={promo} onChange={e=>setPromo(e.target.value)} className="flex-1 bg-abyss border border-blood-900/30 p-3 rounded text-white" placeholder="Введи код" />
          <button onClick={applyPromo} className="px-6 py-3 bg-blood-600 hover:bg-blood-500 text-white font-bold rounded glow-fire">АКТИВИРОВАТЬ</button>
        </div>
        {msg && <p className="mt-3 text-sm text-gray-300">{msg}</p>}
      </div>
    </div>
  )
}
