'use client'
import { useEffect, useState } from 'react'
import { supabaseAdmin } from '@/lib/supabase'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    bannedUsers: 0,
    activePasses: 0,
    dailyRegistrations: [] as any[],
    revenueData: [] as any[],
    topRanks: [] as any[],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { count: total } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true })
    const { count: banned } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).eq('is_banned', true)
    const { count: active } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true }).neq('status', 'No Pass')

    // Моковые данные для графиков (замени на реальные запросы)
    const dailyData = Array.from({ length: 7 }, (_, i) => ({
      day: `День ${i + 1}`,
      users: Math.floor(Math.random() * 50) + 10,
    }))

    const revenueData = Array.from({ length: 7 }, (_, i) => ({
      day: `День ${i + 1}`,
      amount: Math.floor(Math.random() * 5000) + 1000,
    }))

    const topRanks = [
      { name: 'VIP', count: 45 },
      { name: 'Premium', count: 23 },
      { name: 'Legend', count: 12 },
      { name: 'God', count: 5 },
    ]

    setStats({
      totalUsers: total || 0,
      bannedUsers: banned || 0,
      activePasses: active || 0,
      dailyRegistrations: dailyData,
      revenueData: revenueData,
      topRanks: topRanks,
    })
  }

  const lineData = {
    labels: stats.dailyRegistrations.map(d => d.day),
    datasets: [{
      label: 'Регистрации',
      data: stats.dailyRegistrations.map(d => d.users),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true,
    }]
  }

  const barData = {
    labels: stats.revenueData.map(d => d.day),
    datasets: [{
      label: 'Доход (₽)',
      data: stats.revenueData.map(d => d.amount),
      backgroundColor: '#f97316',
      borderRadius: 8,
    }]
  }

  const doughnutData = {
    labels: stats.topRanks.map(r => r.name),
    datasets: [{
      data: stats.topRanks.map(r => r.count),
      backgroundColor: ['#22c55e', '#3b82f6', '#a855f7', '#ef4444'],
      borderWidth: 0,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#9ca3af' } },
    },
    scales: {
      x: { ticks: { color: '#6b7280' }, grid: { color: '#374151' } },
      y: { ticks: { color: '#6b7280' }, grid: { color: '#374151' } },
    },
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black text-gradient-animated mb-8">📊 Аналитика</h1>

        {/* Карточки статистики */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard label="Всего игроков" value={stats.totalUsers} color="from-blue-600 to-cyan-600" />
          <StatCard label="Забанено" value={stats.bannedUsers} color="from-red-600 to-orange-600" />
          <StatCard label="С проходкой" value={stats.activePasses} color="from-green-600 to-emerald-600" />
        </div>

        {/* Графики */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Регистрации за неделю</h2>
            <Line data={lineData} options={chartOptions} />
          </div>
          <div className="glass rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Доход за неделю</h2>
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Распределение привилегий</h2>
          <div className="max-w-md mx-auto">
            <Doughnut data={doughnutData} options={{ plugins: { legend: { labels: { color: '#9ca3af' } } } }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="glass rounded-xl p-6">
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${color}`}>
        {value}
      </div>
    </div>
  )
}
