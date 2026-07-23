'use client'
import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'

export default function CryptoPayment() {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('RUB')
  const [cryptoCurrency, setCryptoCurrency] = useState('USDT')
  const [loading, setLoading] = useState(false)
  const [invoiceUrl, setInvoiceUrl] = useState('')

  const createInvoice = async () => {
    if (!amount) return
    setLoading(true)

    // Здесь должен быть запрос к CryptoBot API
    // Для демо создаем моковый инвойс
    const mockInvoiceUrl = `https://t.me/send?start=pay_${Date.now()}`
    
    // Сохраняем в БД
    const session = localStorage.getItem('pvx_session')
    if (session) {
      const { id } = JSON.parse(session)
      await supabasePublic.from('crypto_payments').insert({
        user_id: id,
        amount: parseFloat(amount),
        currency,
        crypto_currency: cryptoCurrency,
        status: 'pending',
        invoice_id: `invoice_${Date.now()}`,
      })
    }

    setInvoiceUrl(mockInvoiceUrl)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8">₿ Крипто-платежи</h1>

        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Создать инвойс</h2>
          <div className="space-y-4">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Сумма"
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
            />
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
            >
              <option value="RUB">RUB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <select
              value={cryptoCurrency}
              onChange={e => setCryptoCurrency(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
            >
              <option value="USDT">USDT (TRC20)</option>
              <option value="TON">TON</option>
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
            <button
              onClick={createInvoice}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать инвойс'}
            </button>
          </div>
        </div>

        {invoiceUrl && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Инвойс создан!</h2>
            <p className="text-gray-400 mb-4">Перейди по ссылке для оплаты:</p>
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
            >
              Оплатить в Telegram
            </a>
          </div>
        )}

        <div className="glass rounded-xl p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Поддерживаемые криптовалюты</h2>
          <div className="grid grid-cols-2 gap-4">
            {['USDT', 'TON', 'BTC', 'ETH', 'LTC', 'DOGE'].map(crypto => (
              <div key={crypto} className="bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-center">
                <div className="font-bold">{crypto}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
