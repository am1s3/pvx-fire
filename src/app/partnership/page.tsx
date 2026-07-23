'use client'
import { useEffect, useState } from 'react'
import { supabasePublic } from '@/lib/supabase'

export default function PartnershipPage() {
  const [partnership, setPartnership] = useState<any>(null)
  const [partnerName, setPartnerName] = useState('')
  const [partnerUrl, setPartnerUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPartnership()
  }, [])

  const loadPartnership = async () => {
    const session = localStorage.getItem('pvx_session')
    if (!session) return
    const { id } = JSON.parse(session)

    const { data } = await supabasePublic.from('partnerships').select('*').eq('user_id', id).single()
    if (data) setPartnership(data)
  }

  const createPartnership = async () => {
    if (!partnerName) return
    setLoading(true)

    const session = localStorage.getItem('pvx_session')
    if (!session) return
    const { id } = JSON.parse(session)

    const referralCode = `REF_${Date.now().toString(36).toUpperCase()}`

    const { data } = await supabasePublic.from('partnerships').insert({
      user_id: id,
      partner_name: partnerName,
      partner_url: partnerUrl,
      referral_code: referralCode,
    }).select()

    if (data) {
      setPartnership(data[0])
    }
    setLoading(false)
  }

  const copyReferralLink = () => {
    if (!partnership) return
    const link = `https://paraverx.pages.dev/?ref=${partnership.referral_code}`
    navigator.clipboard.writeText(link)
    alert('Ссылка скопирована!')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8">🤝 Партнерская программа</h1>

        {!partnership ? (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Стать партнером</h2>
            <div className="space-y-4">
              <input
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                placeholder="Название партнера"
                className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
              />
              <input
                value={partnerUrl}
                onChange={e => setPartnerUrl(e.target.value)}
                placeholder="URL сайта/канала"
                className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
              />
              <button
                onClick={createPartnership}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg disabled:opacity-50"
              >
                {loading ? 'Создание...' : 'Стать партнером'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Твоя партнерка</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#0a0a0a] rounded p-4">
                  <div className="text-gray-400 text-sm">Партнер</div>
                  <div className="font-bold text-lg">{partnership.partner_name}</div>
                </div>
                <div className="bg-[#0a0a0a] rounded p-4">
                  <div className="text-gray-400 text-sm">Заработано</div>
                  <div className="font-bold text-lg text-green-500">{partnership.total_earned} ₽</div>
                </div>
              </div>
              
              <div className="bg-[#0a0a0a] rounded p-4 mb-4">
                <div className="text-gray-400 text-sm mb-2">Реферальный код</div>
                <div className="font-mono text-xl text-red-500">{partnership.referral_code}</div>
              </div>

              <button
                onClick={copyReferralLink}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
              >
                Скопировать реферальную ссылку
              </button>
            </div>

            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4">Условия</h2>
              <ul className="space-y-2 text-gray-400">
                <li>✓ Комиссия: {partnership.commission_rate}%</li>
                <li>✓ Выплаты раз в месяц</li>
                <li>✓ Минимальная сумма выплаты: 500 ₽</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
