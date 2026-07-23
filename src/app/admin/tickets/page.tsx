import { supabaseAdmin } from '@/lib/supabase'

export default async function TicketsPage() {
  const { data: tickets } = await supabaseAdmin.from('tickets').select('*').eq('is_resolved', false).order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-8">
        🐞 ТИКЕТЫ И ЖАЛОБЫ
      </h1>
      <div className="space-y-4">
        {tickets && tickets.length > 0 ? (
          tickets.map((t: any) => (
            <div key={t.id} className="bg-ash border border-blood-900/30 rounded-lg p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-red-400 font-bold">От: {t.reporter_nick}</span>
                  <span className="text-gray-500 mx-2">→</span>
                  <span className="text-white font-bold">На: {t.target_nick || 'Не указан'}</span>
                </div>
                <span className="text-xs text-gray-500">{new Date(t.created_at).toLocaleString('ru')}</span>
              </div>
              <p className="text-gray-300 bg-abyss p-4 rounded mb-3">{t.reason}</p>
              {t.coords && <p className="text-sm text-amber-400 mb-3">📍 Координаты: {t.coords}</p>}
              <form action={async () => {
                'use server'
                await supabaseAdmin.from('tickets').update({ is_resolved: true }).eq('id', t.id)
              }}>
                <button className="px-4 py-2 bg-green-900/50 hover:bg-green-800 text-green-300 rounded text-sm font-semibold">
                  ✅ Отметить как решенное
                </button>
              </form>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10 bg-ash border border-blood-900/30 rounded-lg">
            🎉 Нет открытых тикетов. Все чисто!
          </div>
        )}
      </div>
    </div>
  )
}
