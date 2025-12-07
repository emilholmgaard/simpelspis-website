import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const { pathname } = request.nextUrl

  // Cache statiske assets (billeder, fonts, etc.) i 1 år
  if (
    pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot|js|css|map)$/i)
  ) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
    response.headers.set(
      'CDN-Cache-Control',
      'public, s-maxage=31536000, stale-while-revalidate=86400'
    )
    return response
  }

  // Cache Next.js statiske assets i 1 år
  if (pathname.startsWith('/_next/static/')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
    response.headers.set(
      'CDN-Cache-Control',
      'public, s-maxage=31536000, stale-while-revalidate=86400'
    )
    return response
  }

  // Cache Next.js images i 1 år
  if (pathname.startsWith('/_next/image')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    )
    response.headers.set(
      'CDN-Cache-Control',
      'public, s-maxage=31536000, stale-while-revalidate=86400'
    )
    return response
  }

  // Cache HTML sider i 1 time med stale-while-revalidate
  if (!pathname.startsWith('/api/')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    )
    response.headers.set(
      'CDN-Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=86400'
    )
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/webpack (webpack files)
     */
    '/((?!api|_next/webpack).*)',
  ],
}

