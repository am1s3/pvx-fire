export default function Shop() {
  const ranks = [
    { name: 'VIP', price: '149₽', color: 'from-green-600 to-emerald-600', perks: ['Цветной ник', 'Кит VIP', '2 дома'] },
    { name: 'PREMIUM', price: '299₽', color: 'from-blue-600 to-cyan-600', perks: ['Всё от VIP', 'Флай в лобби', '5 домов', 'Префикс'] },
    { name: 'LEGEND', price: '599₽', color: 'from-purple-600 to-pink-600', perks: ['Всё от Premium', 'Уникальный миф', 'Безлимит домов', 'Доступ к /feed'] },
    { name: 'GOD', price: '999₽', color: 'from-red-600 to-orange-600', perks: ['Абсолютная власть', 'Свой регион', 'Тварь-питомец', 'Личный варп'] },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-4">
          МАГАЗИН ПРИВИЛЕГИЙ
        </h1>
        <p className="text-center text-gray-400 mb-16">
          Поддержи сервер и получи ебаные бонусы. Деньги идут на оплату хостинга и энергетики для админов.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ranks.map((rank) => (
            <div key={rank.name} className="bg-[#171717] border border-[#7f1d1d] rounded-xl p-6 flex flex-col hover:border-red-500/50 transition-all group hover:-translate-y-2 duration-300">
              <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${rank.color} mb-2`}>
                {rank.name}
              </div>
              <div className="text-4xl font-bold text-white mb-6">{rank.price}</div>
              
              <ul className="space-y-2 mb-8 flex-1">
                {rank.perks.map((perk, i) => (
                  <li key={i} className="flex items-center text-gray-300 text-sm">
                    <span className="text-red-500 mr-2">✓</span> {perk}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-lg font-bold text-white bg-gradient-to-r ${rank.color} opacity-80 hover:opacity-100 transition-opacity`}>
                КУПИТЬ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
