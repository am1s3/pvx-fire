'use client'
import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { hashPassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [nick, setNick] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const router = useRouter()

  const handleReg = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!/^[a-zA-Z0-9_]{3,16}$/.test(nick)) return setErr('Ник: 3-16 символов (латиница/цифры/_ )')
    if (pass.length < 6) return setErr('Пароль минимум 6 символов')

    const hash = await hashPassword(pass)
    const { error } = await supabasePublic.from('users').insert({ mc_nick: nick, password_hash: hash })
    
    if (error) return setErr('Ник занят или ошибка БД')
    router.push('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <form onSubmit={handleReg} className="bg-ash border border-blood-900/50 p-8 rounded-lg w-full max-w-md glow-fire">
        <h1 className="text-3xl font-black text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember">РЕГИСТРАЦИЯ PVX</h1>
        {err && <p className="text-blood-500 text-sm mb-4">{err}</p>}
        <input type="text" value={nick} onChange={e=>setNick(e.target.value)} placeholder="Minecraft Ник" className="w-full bg-abyss border border-blood-900/30 p-3 rounded mb-4 text-white focus:border-blood-500 outline-none" />
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Пароль" className="w-full bg-abyss border border-blood-900/30 p-3 rounded mb-6 text-white focus:border-blood-500 outline-none" />
        <button type="submit" className="w-full py-3 bg-gradient-to-r from-blood-700 to-blood-500 text-white font-bold rounded transition-all glow-fire uppercase">Создать Аккаунт</button>
      </form>
    </div>
  )
}
