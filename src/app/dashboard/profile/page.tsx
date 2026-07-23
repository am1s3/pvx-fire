'use client'
import { useState, useEffect } from 'react'
import { supabasePublic } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import AvatarUpload from '@/components/AvatarUpload'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [bio, setBio] = useState('')
  const [banner, setBanner] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()

  useEffect(() => {
    const session = localStorage.getItem('pvx_session')
    if (!session) { router.push('/login'); return }
    const parsed = JSON.parse(session)
    
    supabasePublic.from('users').select('*').eq('id', parsed.id).single().then(({ data }) => {
      if (data) {
        setUser(data)
        setBio(data.bio || '')
        setBanner(data.banner_url || '')
      }
    })
  }, [router])

  const saveProfile = async () => {
    const { error } = await supabasePublic.from('users').update({ bio, banner_url: banner }).eq('id', user.id)
    if (error) setMsg('Ошибка сохранения!')
    else setMsg('Профиль обновлен!')
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8">Кастомизация профиля</h1>
        
        {msg && <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded mb-4">{msg}</div>}

        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Аватар</h2>
          <AvatarUpload userId={user.id} currentUrl={user.avatar_url} />
        </div>

        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Баннер</h2>
          <input 
            value={banner}
            onChange={e => setBanner(e.target.value)}
            placeholder="URL баннера"
            className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Био</h2>
          <textarea 
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Расскажи о себе..."
            rows={4}
            className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white focus:border-red-500 focus:outline-none"
          />
        </div>

        <button 
          onClick={saveProfile}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg hover:scale-105 transition-transform"
        >
          Сохранить изменения
        </button>
      </div>
    </div>
  )
}
