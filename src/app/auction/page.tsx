'use client'
import { useEffect, useState } from 'react'
import { supabasePublic } from '@/lib/supabase'

export default function AuctionPage() {
  const [auctions, setAuctions] = useState<any[]>([])
  const [bidAmount, setBidAmount] = useState<{[key: string]: string}>({})

  useEffect(() => {
    loadAuctions()
    const interval = setInterval(loadAuctions, 5000) // Обновление каждые 5 секунд
    return () => clearInterval(interval)
  }, [])

  const loadAuctions = async () => {
    const { data } = await supabasePublic
      .from('privilege_auctions')
      .select('*, auction_bids(*)')
      .eq('status', 'active')
      .order('ends_at', { ascending: true })
    
    if (data) setAuctions(data)
  }

  const placeBid = async (auctionId: string) => {
    const amount = parseFloat(bidAmount[auctionId] || '0')
    if (!amount) return

    const session = localStorage.getItem('pvx_session')
    if (!session) {
      alert('Войдите для участия в аукционе!')
      return
    }
    const { id: userId } = JSON.parse(session)

    const auction = auctions.find(a => a.id === auctionId)
    if (amount <= (auction.current_bid || auction.starting_price)) {
      alert('Ставка должна быть выше текущей!')
      return
    }

    await supabasePublic.from('auction_bids').insert({
      auction_id: auctionId,
      user_id: userId,
      amount,
    })

    await supabasePublic.from('privilege_auctions').update({
      current_bid: amount,
      current_bidder_id: userId,
    }).eq('id', auctionId)

    setBidAmount({ ...bidAmount, [auctionId]: '' })
    loadAuctions()
  }

  const getTimeLeft = (endsAt: string) => {
    const diff = new Date(endsAt).getTime() - Date.now()
    if (diff <= 0) return 'Завершено'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}ч ${minutes}м`
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8">🏆 Аукцион привилегий</h1>

        <div className="space-y-6">
          {auctions.map(auction => (
            <div key={auction.id} className="glass rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-red-500">{auction.privilege_name}</h2>
                  <p className="text-gray-400 mt-1">{auction.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-gray-400 text-sm">Осталось</div>
                  <div className="text-xl font-bold text-orange-500">{getTimeLeft(auction.ends_at)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#0a0a0a] rounded p-3">
                  <div className="text-gray-400 text-sm">Стартовая цена</div>
                  <div className="font-bold text-lg">{auction.starting_price} ₽</div>
                </div>
                <div className="bg-[#0a0a0a] rounded p-3">
                  <div className="text-gray-400 text-sm">Текущая ставка</div>
                  <div className="font-bold text-lg text-green-500">
                    {auction.current_bid || auction.starting_price} ₽
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  value={bidAmount[auction.id] || ''}
                  onChange={e => setBidAmount({ ...bidAmount, [auction.id]: e.target.value })}
                  placeholder="Ваша ставка"
                  className="flex-1 bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
                />
                <button
                  onClick={() => placeBid(auction.id)}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg"
                >
                  Сделать ставку
                </button>
              </div>

              {auction.auction_bids && auction.auction_bids.length > 0 && (
                <div className="mt-4">
                  <div className="text-gray-400 text-sm mb-2">История ставок:</div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {auction.auction_bids.map((bid: any, i: number) => (
                      <div key={i} className="text-sm text-gray-500">
                        {bid.amount} ₽ - {new Date(bid.created_at).toLocaleString('ru-RU')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
