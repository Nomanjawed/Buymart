import { NextResponse, type NextRequest } from 'next/server'

function decodeBase64Url(value: string) {
  const normalizedValue = value.replace(/-/g, '+').replace(/_/g, '/')
  const paddedValue = normalizedValue.padEnd(
    Math.ceil(normalizedValue.length / 4) * 4,
    '=',
  )

  return Uint8Array.from(atob(paddedValue), (character) => character.charCodeAt(0))
}

async function getTokenRole(token?: string) {
  if (!token) return null

  try {
    const [encodedHeader, encodedPayload, encodedSignature, extraSegment] = token.split('.')
    const secret = process.env.JWT_SECRET
    if (!encodedHeader || !encodedPayload || !encodedSignature || extraSegment || !secret) {
      return null
    }

    const header = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedHeader))) as { alg?: string }
    if (header.alg !== 'HS256') return null

    const verificationKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const isValid = await crypto.subtle.verify(
      'HMAC',
      verificationKey,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    )
    if (!isValid) return null

    const claims = JSON.parse(new TextDecoder().decode(decodeBase64Url(encodedPayload))) as {
      role?: unknown
      exp?: unknown
      nbf?: unknown
    }
    const now = Date.now() / 1000
    if (typeof claims.exp !== 'number' || claims.exp <= now) return null
    if (typeof claims.nbf === 'number' && claims.nbf > now) return null

    return typeof claims.role === 'string' ? claims.role : null
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const hasToken = Boolean(token)
  const isAdmin = await getTokenRole(token) === 'admin'
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/dashboard') && !hasToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (pathname === '/dashboard' && isAdmin) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  if (pathname.startsWith('/admin') && !hasToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname === '/auth' && hasToken) {
    return NextResponse.redirect(
      new URL(isAdmin ? '/admin/dashboard' : '/dashboard', request.url),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/auth'],
}