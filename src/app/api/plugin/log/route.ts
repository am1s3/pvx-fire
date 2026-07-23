import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  if (request.headers.get('X-API-SECRET') !== process.env.API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { player, action, details } = await request.json()
  // Логи можно писать в отдельную таблицу или просто возвращать успех
  return NextResponse.json({ status: 'success' })
}
