import { supabaseAdmin } from '@/lib/supabase'
import { updateStyle, banPlayer, unbanPlayer, extendPass } from '../../actions'
import Link from 'next/link'

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const playerId = params.id
  
  const { data: user } = await supabaseAdmin.from('users').select('*').eq('id', playerId).single()

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-blood-500">Игрок не найден</h1>
        <Link href="/admin" className="text-blue-400 hover:underline mt-4 inline-block">⬅️ Вернуться в админку</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Link href="/admin" className="text-gray-400 hover:text-white mb-4 inline-block">⬅️ Назад в админку</Link>
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-8">
        Управление игроком: {user.mc_nick}
      </h1>

      <div className="bg-ash border border-blood-900/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">📊 Информация</h2>
        <p>ID: <code className="bg-black px-2 py-1 rounded text-white">{user.id}</code></p>
        <p>Статус: <span className="text-white font-bold">{user.status}</span></p>
        <p>Бан: {user.is_banned ? '🔴 ДА' : '🟢 НЕТ'}</p>
      </div>

      <div className="bg-ash border border-blood-900/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">⚡ Быстрые действия</h2>
        <div className="flex gap-3 flex-wrap">
          <form action={async () => { 'use server'; await extendPass(user.mc_nick, 30) }}>
            <button className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-bold">+30 дней</button>
          </form>
          {user.is_banned ? (
            <form action={async () => { 'use server'; await unbanPlayer(user.mc_nick) }}>
              <button className="px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-bold">Разбанить</button>
            </form>
          ) : (
            <form action={async () => { 'use server'; await banPlayer(user.mc_nick, 'Нарушение правил') }}>
              <button className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-bold">Забанить</button>
            </form>
          )}
        </div>
      </div>

      <div className="bg-ash border border-blood-900/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">🎨 Настройка стиля</h2>
        <form action={async (formData: FormData) => {
          'use server'
          const color = formData.get('color') as string
          const decor = formData.get('decor') as string
          const gradient = formData.get('gradient') as string
          const prefix = formData.get('prefix') as string
          await updateStyle(user.mc_nick, { color, decor, gradient, prefix })
        }} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Префикс (напр. §c[ADMIN] )</label>
            <input name="prefix" defaultValue={user.prefix || ''} className="w-full bg-abyss border border-blood-900/30 p-3 rounded text-white focus:border-blood-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Цвет (напр. &c)</label>
              <input name="color" defaultValue={user.color || ''} className="w-full bg-abyss border border-blood-900/30 p-3 rounded text-white focus:border-blood-500 outline-none" />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Градиент (напр. fire)</label>
              <input name="gradient" defaultValue={user.gradient || 'none'} className="w-full bg-abyss border border-blood-900/30 p-3 rounded text-white focus:border-blood-500 outline-none" />
            </div>
          </div>
          <button type="submit" className="w-full py-3 bg-blood-600 hover:bg-blood-500 text-white font-bold rounded glow-fire">Сохранить стиль</button>
        </form>
      </div>
    </div>
  )
}
