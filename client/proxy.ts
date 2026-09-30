import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const hasToken = Boolean(request.cookies.get('token')?.value)
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/dashboard') && !hasToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (pathname === '/auth' && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth'],
}