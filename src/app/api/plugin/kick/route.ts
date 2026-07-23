import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  if (request.headers.get('X-API-SECRET') !== process.env.API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ status: 'success' })
}
