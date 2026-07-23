import { supabaseAdmin } from '@/lib/supabase'
import { toggleMaintenance, createMyth } from '../actions'

export default async function SettingsPage() {
  const { data: maint } = await supabaseAdmin.from('settings').select('value').eq('key', 'maintenance_mode').single()
  const isMaint = maint?.value === 'true'

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-8">
        ⚙️ НАСТРОЙКИ
      </h1>

      <div className="bg-ash border border-blood-900/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">🚧 Технические работы</h2>
        <p className="text-gray-400 mb-4">
          {isMaint ? 'Сервер сейчас закрыт для обычных игроков. Админы могут заходить.' : 'Сервер работает в обычном режиме.'}
        </p>
        <form action={toggleMaintenance}>
          <button className={`px-6 py-3 text-white font-bold rounded glow-fire ${isMaint ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}>
            {isMaint ? '✅ Выключить тех. работы' : '🛑 Включить тех. работы'}
          </button>
        </form>
      </div>

      <div className="bg-ash border border-blood-900/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">👻 Быстрое создание Мифа</h2>
        <form action={async (formData: FormData) => {
          'use server'
          const nick = formData.get('nick') as string
          if (nick) await createMyth(nick)
        }} className="flex gap-3">
          <input name="nick" placeholder="Никнейм мифа" required className="flex-1 bg-abyss border border-blood-900/30 p-3 rounded text-white focus:border-blood-500 outline-none" />
          <button type="submit" className="px-6 py-3 bg-blood-600 hover:bg-blood-500 text-white font-bold rounded glow-fire">СОЗДАТЬ</button>
        </form>
      </div>
    </div>
  )
}
