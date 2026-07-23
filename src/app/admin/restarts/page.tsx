'use client'
import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'

export default function RestartScheduler() {
  const [schedule, setSchedule] = useState<any[]>([])
  const [restartTime, setRestartTime] = useState('')
  const [message, setMessage] = useState('Сервер перезагружается через 5 минут!')

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    const { data } = await supabaseAdmin.from('restart_schedule').select('*').order('restart_time', { ascending: true })
    if (data) setSchedule(data)
  }

  const addRestart = async () => {
    if (!restartTime) return
    await supabaseAdmin.from('restart_schedule').insert({
      restart_time: new Date(restartTime).toISOString(),
      message,
    })
    setRestartTime('')
    loadSchedule()
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabaseAdmin.from('restart_schedule').update({ is_active: !isActive }).eq('id', id)
    loadSchedule()
  }

  const deleteRestart = async (id: string) => {
    await supabaseAdmin.from('restart_schedule').delete().eq('id', id)
    loadSchedule()
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8">⏰ Планировщик рестартов</h1>

        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Запланировать рестарт</h2>
          <div className="space-y-4">
            <input
              type="datetime-local"
              value={restartTime}
              onChange={e => setRestartTime(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
            />
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Сообщение игрокам"
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
            />
            <button
              onClick={addRestart}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg"
            >
              Запланировать
            </button>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Запланированные рестарты</h2>
          <div className="space-y-3">
            {schedule.map(item => (
              <div key={item.id} className="bg-[#0a0a0a] border border-[#450a0a] rounded p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold text-lg">
                    {new Date(item.restart_time).toLocaleString('ru-RU')}
                  </div>
                  <div className="text-gray-400 text-sm">{item.message}</div>
                  <div className={`text-xs mt-1 ${item.is_active ? 'text-green-500' : 'text-red-500'}`}>
                    {item.is_active ? 'Активен' : 'Отключен'}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(item.id, item.is_active)}
                    className={`px-3 py-1 rounded text-sm ${item.is_active ? 'bg-yellow-600' : 'bg-green-600'}`}
                  >
                    {item.is_active ? 'Отключить' : 'Включить'}
                  </button>
                  <button
                    onClick={() => deleteRestart(item.id)}
                    className="px-3 py-1 bg-red-900/50 text-red-400 rounded text-sm"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
