import { supabaseAdmin } from '@/lib/supabase'
import { createMyth, deleteMyth } from '../actions'

export default async function MythsPage() {
  const { data: myths } = await supabaseAdmin.from('myths').select('*').order('mc_nick', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-8">
        УПРАВЛЕНИЕ МИФАМИ
      </h1>
      
      <div className="bg-ash border border-blood-900/30 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">➕ Добавить нового мифа</h2>
        <form action={createMyth} className="flex gap-3">
          <input 
            name="nick" 
            type="text" 
            placeholder="Никнейм мифа" 
            required
            className="flex-1 bg-abyss border border-blood-900/30 rounded px-4 py-3 text-white focus:border-blood-500 outline-none" 
          />
          <button type="submit" className="px-6 py-3 bg-blood-600 hover:bg-blood-500 text-white font-bold rounded glow-fire">
            СОЗДАТЬ
          </button>
        </form>
      </div>

      <div className="bg-ash border border-blood-900/30 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blood-400 mb-4">👻 Список мифов ({myths?.length || 0})</h2>
        {myths && myths.length > 0 ? (
          <ul className="space-y-3">
            {myths.map((myth: any) => (
              <li key={myth.mc_nick} className="flex items-center justify-between bg-abyss p-4 rounded border border-gray-800">
                <div>
                  <span className="text-white font-bold text-lg">{myth.mc_nick}</span>
                  <span className="text-gray-500 text-sm ml-3">
                    {myth.gradient !== 'none' ? `🌈 ${myth.gradient}` : `🎨 ${myth.color || 'Без цвета'}`}
                  </span>
                </div>
                <form action={deleteMyth}>
                  <input type="hidden" name="nick" value={myth.mc_nick} />
                  <button type="submit" className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-300 rounded text-sm font-semibold transition-colors">
                    Удалить
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">Мифов пока нет. Создай первого!</p>
        )}
      </div>
    </div>
  )
}
