'use client'
import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { verifyPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [nick, setNick] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data: user } = await supabasePublic.from('users').select('*').ilike('mc_nick', nick).single()
    if (!user) return setErr('Игрок не найден')
    
    const valid = await verifyPassword(pass, user.password_hash)
    if (!valid) return setErr('Неверный пароль')

    localStorage.setItem('pvx_session', JSON.stringify({ id: user.id, nick: user.mc_nick, isAdmin: user.is_admin }))
    router.push(user.is_admin ? '/admin' : '/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleLogin} className="bg-ash border border-blood-900/50 p-8 rounded-lg w-full max-w-md glow-fire">
        <h1 className="text-3xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember">ВХОД</h1>
        {err && <p className="text-blood-500 text-sm mb-4">{err}</p>}
        <input type="text" value={nick} onChange={e=>setNick(e.target.value)} placeholder="Ник" className="w-full bg-abyss border border-blood-900/30 p-3 rounded mb-4 text-white focus:border-blood-500 outline-none" />
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Пароль" className="w-full bg-abyss border border-blood-900/30 p-3 rounded mb-6 text-white focus:border-blood-500 outline-none" />
        <button type="submit" className="w-full py-3 bg-gradient-to-r from-blood-700 to-blood-500 text-white font-bold rounded glow-fire uppercase">Войти</button>
      </form>
    </div>
  )
}
