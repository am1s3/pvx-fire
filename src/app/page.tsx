export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 mb-6 drop-shadow-2xl">
          ParaVerX
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
          Самый лучший майнкрафт сервер про мистику
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a href="/register" className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-lg text-lg hover:scale-105 transition-transform shadow-lg shadow-red-900/40">
            Начать играть
          </a>
          <a href="https://discord.gg/KtUmMNw6TT" className="px-8 py-4 bg-[#171717] border border-red-900/50 text-white font-bold rounded-lg text-lg hover:border-red-500 transition-all">
            Discord
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureCard icon="" title="Мистические существа" desc="Уникальные мифы и легенды" />
          <FeatureCard icon="⚔️" title="Эпические битвы" desc="PvP арены и клановые войны" />
          <FeatureCard icon="🏰" title="Кастомные миры" desc="Уникальные локации и квесты" />
        </div>
      </div>
      
      <footer className="border-t border-[#7f1d1d] py-8 text-center text-gray-600 text-sm">
        <p>© 2024 ParaVerX. Все права защищены.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-[#171717] border border-[#7f1d1d] rounded-xl p-6 hover:border-red-500/50 transition-all group">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  )
}
