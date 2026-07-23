'use client'
import { useState, useEffect } from 'react'
import { supabasePublic } from '@/lib/supabase'

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    loadNotifications()
    
    const channel = supabasePublic
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
        setUnread(prev => prev + 1)
      })
      .subscribe()

    return () => { supabasePublic.removeChannel(channel) }
  }, [userId])

  const loadNotifications = async () => {
    const { data } = await supabasePublic
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (data) {
      setNotifications(data)
      setUnread(data.filter(n => !n.is_read).length)
    }
  }

  const markAsRead = async (id: string) => {
    await supabasePublic.from('notifications').update({ is_read: true }).eq('id', id)
    setUnread(prev => Math.max(0, prev - 1))
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-[#171717] border border-[#7f1d1d] rounded-lg hover:border-red-500 transition-all"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 glass rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-[#7f1d1d]">
            <h3 className="font-bold text-white">Уведомления</h3>
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">Нет уведомлений</div>
          ) : (
            notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => markAsRead(n.id)}
                className={`p-4 border-b border-[#450a0a] hover:bg-[#450a0a]/30 cursor-pointer ${!n.is_read ? 'bg-red-900/10' : ''}`}
              >
                <div className="font-bold text-white text-sm">{n.title}</div>
                <div className="text-gray-400 text-xs mt-1">{n.message}</div>
                <div className="text-gray-600 text-xs mt-2">{new Date(n.created_at).toLocaleString('ru-RU')}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
