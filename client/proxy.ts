import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const hasToken = Boolean(token)
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/dashboard') && !hasToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (pathname.startsWith('/admin') && !hasToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (pathname === '/auth' && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth'],
}