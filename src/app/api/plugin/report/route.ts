import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  if (request.headers.get('X-API-SECRET') !== process.env.API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { reporter, target, reason, coords } = await request.json()
  await supabaseAdmin.from('tickets').insert({
    reporter_nick: reporter,
    target_nick: target,
    reason: reason || 'Без причины',
    coords: coords || '',
    source: 'ingame'
  })
  return NextResponse.json({ status: 'success' })
}
