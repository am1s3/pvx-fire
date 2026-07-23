import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  if (request.headers.get('X-API-SECRET') !== process.env.API_SECRET) {
    return NextResponse.json({ status: 'kick', message: '§cUnauthorized' }, { status: 401 })
  }

  try {
    const { nickname, password } = await request.json()
    const nick = nickname?.trim()
    if (!nick) return NextResponse.json({ status: 'kick', message: '§cУкажите ник' })

    // Проверка тех. работ
    const { data: maint } = await supabaseAdmin.from('settings').select('value').eq('key', 'maintenance_mode').single()
    if (maint?.value === 'true') {
      const { data: adminCheck } = await supabaseAdmin.from('users').select('is_admin').ilike('mc_nick', nick).single()
      if (!adminCheck?.is_admin) {
        return NextResponse.json({ status: 'kick', message: '§c⚠️ Технические работы!' })
      }
    }

    // 1. ПРОВЕРКА МИФОВ
    const { data: myth } = await supabaseAdmin.from('myths').select('*').ilike('mc_nick', nick).single()
    if (myth) {
      let finalPrefix = myth.prefix || ''
      if (myth.gradient === 'none') finalPrefix = (myth.color || '') + (myth.decor || '') + finalPrefix
      return NextResponse.json({
        status: 'allow', is_admin: 'true', prefix: '',
        tab_prefix: finalPrefix,
        myth_style: myth.gradient !== 'none' ? myth.gradient : myth.style
      })
    }

    // 2. ПРОВЕРКА ИГРОКОВ
    const { data: user } = await supabaseAdmin.from('users').select('*').ilike('mc_nick', nick).single()
    if (!user) {
      return NextResponse.json({ status: 'kick', message: '§cВы не зарегистрированы!\n§7Зарегистрируйтесь на сайте PVX.' })
    }

    // Проверка пароля
    if (!password) {
      return NextResponse.json({ status: 'kick', message: '§cВведите пароль: /login <пароль>' })
    }
    const valid = await verifyPassword(password, user.password_hash)
    if (!valid) return NextResponse.json({ status: 'kick', message: '§cНеверный пароль!' })

    if (user.is_banned) {
      return NextResponse.json({ status: 'kick', message: `§c🛑 Вы забанены!\n§7Причина: ${user.ban_reason || 'Не указана'}` })
    }
    
    if (!user.is_admin && user.status === 'No Pass') {
      return NextResponse.json({ status: 'kick', message: '§cУ вас нет проходки!\n§7Купите её на сайте PVX.' })
    }

    let userPrefix = user.prefix || (user.is_admin ? '§c[ADMIN] ' : '')
    if (user.gradient === 'none') userPrefix = (user.color || '') + (user.decor || '') + userPrefix

    return NextResponse.json({
      status: 'allow',
      is_admin: user.is_admin ? 'true' : 'false',
      prefix: '',
      tab_prefix: userPrefix,
      myth_style: user.gradient !== 'none' ? user.gradient : 'normal'
    })

  } catch (e: any) {
    return NextResponse.json({ status: 'kick', message: `§cОшибка API: ${e.message}` })
  }
}
