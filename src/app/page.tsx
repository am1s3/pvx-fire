export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Герой */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-black text-gradient mb-4">
          ParaVerX
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Самый лучший майнкрафт сервер про мистику
        </p>
        
        <div className="flex gap-4 justify-center mb-16">
          <a href="/register" className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold rounded glow">
            Начать играть
          </a>
          <a href="https://discord.gg/KtUmMNw6TT" className="px-8 py-3 bg-gray-800 border border-red-900/50 text-white font-bold rounded hover:border-red-500 transition-all">
            Discord
          </a>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-20">
          <div className="card p-4">
            <div className="text-3xl font-bold text-gradient">500+</div>
            <div className="text-gray-400 text-sm">Игроков</div>
          </div>
          <div className="card p-4">
            <div className="text-3xl font-bold text-gradient">99.9%</div>
            <div className="text-gray-400 text-sm">Аптайм</div>
          </div>
          <div className="card p-4">
            <div className="text-3xl font-bold text-gradient">24/7</div>
            <div className="text-gray-400 text-sm">Поддержка</div>
          </div>
        </div>

        {/* Фичи */}
        <h2 className="text-4xl font-black text-gradient mb-12">
          Почему ParaVerX?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard icon="" title="Мистические существа" desc="Уникальные мифы и легенды" />
          <FeatureCard icon="⚔️" title="Эпические битвы" desc="PvP арены и клановые войны" />
          <FeatureCard icon="🏰" title="Кастомные миры" desc="Уникальные локации" />
          <FeatureCard icon="💎" title="Редкие предметы" desc="Легендарное оружие" />
          <FeatureCard icon="" title="Способности" desc="Прокачивай навыки" />
          <FeatureCard icon="🎭" title="Сообщество" desc="Дружелюбные игроки" />
        </div>
      </div>

      {/* Футер */}
      <footer className="border-t border-red-900/30 py-8 text-center text-gray-500">
        <p>© 2024 ParaVerX</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="card p-6">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  )
}
