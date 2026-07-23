import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  if (request.headers.get('X-API-SECRET') !== process.env.API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { target, reason, sender } = await request.json()
  await supabaseAdmin.from('users').update({ is_banned: true, ban_reason: reason || 'Забанен' }).ilike('mc_nick', target)
  return NextResponse.json({ status: 'success' })
}
