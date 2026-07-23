'use server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export async function banPlayer(nick: string, reason: string) {
  await supabaseAdmin.from('users').update({ is_banned: true, ban_reason: reason }).ilike('mc_nick', nick)
  revalidatePath('/admin')
}

export async function unbanPlayer(nick: string) {
  await supabaseAdmin.from('users').update({ is_banned: false, ban_reason: '' }).ilike('mc_nick', nick)
  revalidatePath('/admin')
}

export async function extendPass(nick: string, days: number) {
  const { data: user } = await supabaseAdmin.from('users').select('pass_end').ilike('mc_nick', nick).single()
  const end = user?.pass_end && new Date(user.pass_end) > new Date() ? new Date(user.pass_end) : new Date()
  end.setDate(end.getDate() + days)
  await supabaseAdmin.from('users').update({ status: `Pass (${days}d)`, pass_end: end.toISOString() }).ilike('mc_nick', nick)
  revalidatePath('/admin')
}

export async function updateStyle(nick: string, data: { color?: string, decor?: string, gradient?: string, prefix?: string }) {
  if (data.gradient && data.gradient !== 'none') { data.color = ''; data.decor = '' }
  if (data.color || data.decor) { data.gradient = 'none' }
  await supabaseAdmin.from('users').update(data).ilike('mc_nick', nick)
  revalidatePath('/admin')
}

export async function createPromo(code: string, type: 'days' | 'discount', value: number, uses: number) {
  await supabaseAdmin.from('promocodes').upsert({ 
    code, type, 
    days: type==='days'?value:0, 
    discount: type==='discount'?value:0,
    uses_left: uses
  })
  revalidatePath('/admin')
}

export async function toggleMaintenance() {
  const { data } = await supabaseAdmin.from('settings').select('value').eq('key', 'maintenance_mode').single()
  await supabaseAdmin.from('settings').update({ value: data?.value === 'true' ? 'false' : 'true' }).eq('key', 'maintenance_mode')
  revalidatePath('/admin')
}

export async function createMyth(nick: string) {
  await supabaseAdmin.from('myths').insert({ mc_nick: nick.toLowerCase() })
  revalidatePath('/admin/myths')
}

export async function deleteMyth(nick: string) {
  await supabaseAdmin.from('myths').delete().ilike('mc_nick', nick)
  revalidatePath('/admin/myths')
}
