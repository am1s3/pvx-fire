import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Проверка сессии для админки (упрощенно)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // В проде используй Supabase Auth cookies
    const session = request.cookies.get('pvx_session')
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  return NextResponse.next()
}

export const config = { matcher: ['/admin/:path*'] }
