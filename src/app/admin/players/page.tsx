import { supabaseAdmin } from '@/lib/supabase'
import { banPlayer, unbanPlayer, extendPass } from '../actions'
import Link from 'next/link'

export default async function PlayersPage() {
  const { data: users } = await supabaseAdmin.from('users').select('*').order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-8">
        👥 СПИСОК ИГРОКОВ
      </h1>
      <div className="bg-ash border border-blood-900/30 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-abyss text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4">Никнейм</th>
              <th className="p-4">Статус</th>
              <th className="p-4">Бан</th>
              <th className="p-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blood-900/20">
            {users?.map((user: any) => (
              <tr key={user.id} className="hover:bg-blood-950/20 transition-colors">
                <td className="p-4 font-bold text-white">{user.mc_nick}</td>
                <td className="p-4 text-gray-300">{user.status}</td>
                <td className="p-4">
                  {user.is_banned ? <span className="text-red-500 font-bold">🛑 ДА</span> : <span className="text-green-500">🟢 НЕТ</span>}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link href={`/admin/players/${user.id}`} className="px-3 py-1 bg-blue-900/50 hover:bg-blue-800 text-blue-300 rounded text-sm">
                    Настроить
                  </Link>
                  {user.is_banned ? (
                    <form action={async () => { 'use server'; await unbanPlayer(user.mc_nick) }}>
                      <button className="px-3 py-1 bg-green-900/50 hover:bg-green-800 text-green-300 rounded text-sm">Разбан</button>
                    </form>
                  ) : (
                    <form action={async () => { 'use server'; await banPlayer(user.mc_nick, 'Нарушение правил') }}>
                      <button className="px-3 py-1 bg-red-900/50 hover:bg-red-800 text-red-300 rounded text-sm">Бан</button>
                    </form>
                  )}
                  <form action={async () => { 'use server'; await extendPass(user.mc_nick, 30) }}>
                    <button className="px-3 py-1 bg-amber-900/50 hover:bg-amber-800 text-amber-300 rounded text-sm">+30 дн.</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
