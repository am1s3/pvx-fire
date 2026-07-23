import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date().toISOString()
  const { data: expired } = await supabaseAdmin
    .from('users')
    .select('id')
    .neq('status', 'No Pass')
    .lt('pass_end', now)

  if (expired && expired.length > 0) {
    const ids = expired.map(u => u.id)
    await supabaseAdmin.from('users').update({ status: 'No Pass', pass_end: null }).in('id', ids)
  }

  return NextResponse.json({ checked: expired?.length || 0 })
}
