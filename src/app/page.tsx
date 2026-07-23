export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center">
      <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blood-500 to-ember mb-6">
        PVX — MISTIKWORLD
      </h1>
      <p className="text-xl text-gray-400 mb-8">
        Огненный Minecraft сервер с уникальной системой авторизации
      </p>
      <div className="flex gap-4 justify-center">
        <a href="/register" className="px-8 py-3 bg-blood-600 hover:bg-blood-500 text-white font-bold rounded glow-fire uppercase">
          Начать играть
        </a>
        <a href="https://discord.gg/KtUmMNw6TT" className="px-8 py-3 bg-ash border border-blood-900/50 text-white font-bold rounded hover:border-blood-500 transition-all">
          Discord
        </a>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon="🔥" 
          title="Уникальная авторизация" 
          desc="Ник + пароль. Никаких лишних 2FA." 
        />
        <FeatureCard 
          icon="️" 
          title="PvP и экономика" 
          desc="Полноценная RPG с донатом." 
        />
        <FeatureCard 
          icon="🛡️" 
          title="Античит" 
          desc="Защита от читеров 24/7." 
        />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="bg-ash border border-blood-900/30 rounded-lg p-6 text-left hover:border-blood-500/50 transition-all">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  )
}
