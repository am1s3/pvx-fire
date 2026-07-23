import { supabaseAdmin } from '@/lib/supabase'
import { createPromo } from '../actions'

export default async function PromosPage() {
  const { data: promos } = await supabaseAdmin.from('promocodes').select('*').order('code', { ascending: true })

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-8">
        🎁 ПРОМОКОДЫ
      </h1>
      
      <div className="bg-ash border border-blood-900/30 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-blood-400 mb-4">➕ Создать промокод</h2>
        <form action={async (formData: FormData) => {
          'use server'
          const code = formData.get('code') as string
          const type = formData.get('type') as 'days' | 'discount'
          const value = parseInt(formData.get('value') as string)
          const uses = parseInt(formData.get('uses') as string)
          await createPromo(code, type, value, uses)
        }} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input name="code" placeholder="Код (напр. PVX2024)" required className="bg-abyss border border-blood-900/30 p-3 rounded text-white md:col-span-1" />
          <select name="type" className="bg-abyss border border-blood-900/30 p-3 rounded text-white md:col-span-1">
            <option value="days">Дни</option>
            <option value="discount">Скидка (%)</option>
          </select>
          <input name="value" type="number" placeholder="Значение" required className="bg-abyss border border-blood-900/30 p-3 rounded text-white md:col-span-1" />
          <input name="uses" type="number" placeholder="Кол-во использований" defaultValue="500" required className="bg-abyss border border-blood-900/30 p-3 rounded text-white md:col-span-1" />
          <button type="submit" className="px-6 py-3 bg-blood-600 hover:bg-blood-500 text-white font-bold rounded glow-fire md:col-span-1">СОЗДАТЬ</button>
        </form>
      </div>

      <div className="bg-ash border border-blood-900/30 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-abyss text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4">Код</th>
              <th className="p-4">Тип</th>
              <th className="p-4">Значение</th>
              <th className="p-4">Осталось</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blood-900/20">
            {promos?.map((p: any) => (
              <tr key={p.code} className="hover:bg-blood-950/20">
                <td className="p-4 font-bold text-white">{p.code}</td>
                <td className="p-4 text-gray-300">{p.type === 'days' ? 'Дни' : 'Скидка'}</td>
                <td className="p-4 text-gray-300">{p.type === 'days' ? `${p.days} дн.` : `${p.discount}%`}</td>
                <td className="p-4 text-amber-400">{p.uses_left}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
