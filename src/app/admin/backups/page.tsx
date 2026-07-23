'use client'
import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'

export default function BackupManager() {
  const [backups, setBackups] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    const { data } = await supabaseAdmin.from('backups').select('*').order('created_at', { ascending: false })
    if (data) setBackups(data)
  }

  const createBackup = async () => {
    setLoading(true)
    // Здесь должен быть запрос к API сервера для создания бэкапа
    // Для демо просто добавляем запись в БД
    const { data } = await supabaseAdmin.from('backups').insert({
      name: `backup_${new Date().toISOString().split('T')[0]}`,
      size_mb: Math.floor(Math.random() * 500) + 100,
      status: 'completed',
    }).select()

    if (data) {
      setBackups([data[0], ...backups])
    }
    setLoading(false)
  }

  const deleteBackup = async (id: string) => {
    await supabaseAdmin.from('backups').delete().eq('id', id)
    loadBackups()
  }

  const downloadBackup = (backup: any) => {
    // Здесь должен быть запрос к API для скачивания файла
    alert(`Скачивание ${backup.name}... (нужен API сервера)`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8">💾 Менеджер бэкапов</h1>

        <div className="glass rounded-xl p-6 mb-6">
          <button
            onClick={createBackup}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? 'Создание бэкапа...' : ' Создать бэкап сейчас'}
          </button>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">История бэкапов</h2>
          <div className="space-y-3">
            {backups.map(backup => (
              <div key={backup.id} className="bg-[#0a0a0a] border border-[#450a0a] rounded p-4 flex justify-between items-center">
                <div>
                  <div className="font-bold">{backup.name}</div>
                  <div className="text-gray-400 text-sm">
                    {backup.size_mb} MB | {new Date(backup.created_at).toLocaleString('ru-RU')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadBackup(backup)}
                    className="px-3 py-1 bg-blue-600 rounded text-sm"
                  >
                    Скачать
                  </button>
                  <button
                    onClick={() => deleteBackup(backup.id)}
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
