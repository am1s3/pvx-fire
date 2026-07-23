'use client'
import { useState } from 'react'
import { supabasePublic } from '@/lib/supabase'

export default function InstallmentPayment() {
  const [amount, setAmount] = useState('')
  const [installments, setInstallments] = useState('3')
  const [loading, setLoading] = useState(false)
  const [paymentUrl, setPaymentUrl] = useState('')

  const createPayment = async () => {
    if (!amount) return
    setLoading(true)

    const totalAmount = parseFloat(amount)
    const monthlyPayment = totalAmount / parseInt(installments)

    // Здесь должен быть запрос к ЮKassa API
    const mockPaymentUrl = `https://yoomoney.ru/quickpay/confirm?amount=${monthlyPayment}`

    const session = localStorage.getItem('pvx_session')
    if (session) {
      const { id } = JSON.parse(session)
      await supabasePublic.from('installment_payments').insert({
        user_id: id,
        total_amount: totalAmount,
        installments_count: parseInt(installments),
        status: 'pending',
        yookassa_id: `payment_${Date.now()}`,
      })
    }

    setPaymentUrl(mockPaymentUrl)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8"> Рассрочка на донат</h1>

        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Оформить рассрочку</h2>
          <div className="space-y-4">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="Общая сумма"
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
            />
            <select
              value={installments}
              onChange={e => setInstallments(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#450a0a] rounded p-3 text-white"
            >
              <option value="3">3 месяца</option>
              <option value="6">6 месяцев</option>
              <option value="12">12 месяцев</option>
            </select>
            
            {amount && (
              <div className="bg-[#0a0a0a] border border-[#450a0a] rounded p-4">
                <div className="text-gray-400 text-sm">Ежемесячный платеж:</div>
                <div className="text-2xl font-bold text-red-500">
                  {(parseFloat(amount) / parseInt(installments)).toFixed(2)} ₽/мес
                </div>
              </div>
            )}

            <button
              onClick={createPayment}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? 'Оформление...' : 'Оформить рассрочку'}
            </button>
          </div>
        </div>

        {paymentUrl && (
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Платеж создан!</h2>
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
            >
              Перейти к оплате
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
