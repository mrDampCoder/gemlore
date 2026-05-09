import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSessionFromRequest(request)

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/403', request.url))
    }
    return NextResponse.next()
  }

  // Protected user routes
  if (pathname.startsWith('/profile') || pathname.startsWith('/favorites')) {
    if (!session) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Auth pages — redirect if already logged in
  if (pathname === '/login' || pathname === '/signup') {
    if (session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/favorites/:path*', '/login', '/signup'],
}
