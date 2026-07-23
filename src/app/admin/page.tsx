import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export default async function AdminPage() {
  const { count: totalUsers } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true })
  const { count: bannedUsers } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('is_banned', true)
  const { count: activePasses } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).neq('status', 'No Pass')

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-8">ПАНЕЛЬ УПРАВЛЕНИЯ</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-ash border border-blood-900/30 rounded-lg p-6">
          <p className="text-gray-500 text-sm">Всего игроков</p>
          <p className="text-3xl font-bold text-white">{totalUsers || 0}</p>
        </div>
        <div className="bg-ash border border-blood-900/30 rounded-lg p-6">
          <p className="text-gray-500 text-sm">Забанено</p>
          <p className="text-3xl font-bold text-blood-500">{bannedUsers || 0}</p>
        </div>
        <div className="bg-ash border border-blood-900/30 rounded-lg p-6">
          <p className="text-gray-500 text-sm">С проходкой</p>
          <p className="text-3xl font-bold text-white">{activePasses || 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminLink href="/admin/players" icon="👥" title="Игроки" />
        <AdminLink href="/admin/myths" icon="👻" title="Мифы" />
        <AdminLink href="/admin/promos" icon="🎁" title="Промокоды" />
        <AdminLink href="/admin/settings" icon="⚙️" title="Настройки" />
      </div>
    </div>
  )
}

function AdminLink({ href, icon, title }: { href: string, icon: string, title: string }) {
  return (
    <Link href={href} className="bg-ash border border-blood-900/30 hover:border-blood-500 rounded-lg p-6 transition-all">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
    </Link>
  )
}
