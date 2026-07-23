'use client'
import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'

export default function AvatarUpload({ userId, currentUrl }: { userId: string, currentUrl: string | null }) {
  const [loading, setLoading] = useState(false)
  const [url, setUrl] = useState(currentUrl)

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setLoading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}.${fileExt}`

    const { error: uploadError } = await supabasePublic.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      alert('Ошибка загрузки!')
      setLoading(false)
      return
    }

    const { data } = supabasePublic.storage.from('avatars').getPublicUrl(filePath)
    setUrl(data.publicUrl)
    await supabasePublic.from('users').update({ avatar_url: data.publicUrl }).eq('id', userId)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-4">
      <img src={url || '/default-avatar.png'} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-red-500 object-cover" />
      <label className="cursor-pointer bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-bold text-sm transition-colors">
        {loading ? 'Загрузка...' : 'Сменить аватар'}
        <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" />
      </label>
    </div>
  )
}
