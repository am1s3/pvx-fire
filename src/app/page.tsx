export default function Home() {
  return (
    <div className="min-h-screen bg-animated">
      {/* Герой секция */}
      <div className="relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blood-600/20 rounded-full blur-3xl float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-ember/20 rounded-full blur-3xl float" style={{ animationDelay: '1s' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 py-32 text-center relative z-10">
          {/* Логотип */}
          <div className="fade-in-up">
            <h1 className="text-8xl font-black text-gradient-fire gradient-animate mb-6 drop-shadow-2xl">
              ParaVerX
            </h1>
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Самый лучший майнкрафт сервер про мистику
            </p>
          </div>

          {/* Кнопки */}
          <div className="flex gap-6 justify-center mb-20 fade-in-up" style={{ animationDelay: '0.2s' }}>
            <a 
              href="/register" 
              className="px-12 py-4 bg-gradient-to-r from-blood-600 to-ember text-white font-bold rounded-lg text-lg fire-button uppercase tracking-wider"
            >
              🔥 Начать играть
            </a>
            <a 
              href="https://discord.gg/KtUmMNw6TT" 
              className="px-12 py-4 bg-ash border-2 border-blood-600/50 text-white font-bold rounded-lg text-lg hover:border-blood-500 hover:bg-blood-950/30 transition-all uppercase tracking-wider"
            >
              💬 Discord
            </a>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto fade-in-up" style={{ animationDelay: '0.4s' }}>
            <StatCard number="500+" label="Игроков" />
            <StatCard number="99.9%" label="Аптайм" />
            <StatCard number="24/7" label="Поддержка" />
          </div>
        </div>
      </div>

      {/* Фичи */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-5xl font-black text-center text-gradient-fire mb-16">
          Почему ParaVerX?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon="" 
            title="Мистические существа" 
            desc="Уникальные мифы и легенды, которые оживают на сервере. Исследуй тайны и раскрывай секреты."
            gradient="from-purple-600 to-blood-600"
          />
          <FeatureCard 
            icon="⚔️" 
            title="Эпические битвы" 
            desc="PvP арены, клановые войны и боссы. Докажи, что ты сильнейший воин ParaVerX."
            gradient="from-blood-600 to-ember"
          />
          <FeatureCard 
            icon="🏰" 
            title="Кастомные миры" 
            desc="Уникальные локации, подземелья и квесты. Каждый уголок сервера хранит свои тайны."
            gradient="from-ember to-yellow-600"
          />
          <FeatureCard 
            icon="💎" 
            title="Редкие предметы" 
            desc="Легендарное оружие, артефакты и ресурсы. Коллекционируй и торгуй с другими игроками."
            gradient="from-cyan-600 to-purple-600"
          />
          <FeatureCard 
            icon="" 
            title="Уникальные способности" 
            desc="Прокачивай навыки, получай новые умения и становись непобедимым."
            gradient="from-green-600 to-cyan-600"
          />
          <FeatureCard 
            icon="🎭" 
            title="Живое сообщество" 
            desc="Дружелюбные игроки, ивенты и турниры. ParaVerX — это не просто сервер, это семья."
            gradient="from-pink-600 to-blood-600"
          />
        </div>
      </div>

      {/* CTA секция */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="glass rounded-2xl p-12 pulse-fire">
          <h2 className="text-4xl font-black text-gradient-fire mb-6">
            Готов к приключению?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Присоединяйся к тысячам игроков и начни свою историю в ParaVerX
          </p>
          <a 
            href="/register" 
            className="inline-block px-12 py-4 bg-gradient-to-r from-blood-600 to-ember text-white font-bold rounded-lg text-lg fire-button uppercase tracking-wider"
          >
            Создать аккаунт
          </a>
        </div>
      </div>

      {/* Футер */}
      <footer className="border-t border-blood-900/30 py-8 text-center text-gray-500">
        <p>© 2024 ParaVerX. Все права защищены.</p>
      </footer>
    </div>
  )
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="glass rounded-xl p-6 card-hover">
      <div className="text-4xl font-black text-gradient-fire mb-2">{number}</div>
      <div className="text-gray-400">{label}</div>
    </div>
  )
}

function FeatureCard({ icon, title, desc, gradient }: { icon: string, title: string, desc: string, gradient: string }) {
  return (
    <div className="glass rounded-xl p-8 card-hover group">
      <div className={`text-6xl mb-4 bg-gradient-to-br ${gradient} w-20 h-20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}
