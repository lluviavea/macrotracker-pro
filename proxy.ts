import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { getSessionFromRequest } from './lib/auth'

const intlMiddleware = createMiddleware(routing)
const PUBLIC_PATHS = ['/login', '/register']

function extractLocale(pathname: string): string {
  const match = pathname.match(/^\/(en|es)(?:\/|$)/)
  return match ? match[1] : routing.defaultLocale
}

function pathWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/(en|es)/, '') || '/'
}

function isPublicPath(pathname: string): boolean {
  const bare = pathWithoutLocale(pathname)
  return PUBLIC_PATHS.some(p => bare === p || bare.startsWith(`${p}/`))
}

function isAdminPath(pathname: string): boolean {
  const bare = pathWithoutLocale(pathname)
  return bare === '/admin' || bare.startsWith('/admin/')
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return intlMiddleware(request)
  }

  const session = await getSessionFromRequest(request)
  if (!session) {
    const locale = extractLocale(pathname)
    const loginUrl = new URL(`/${locale}/login`, request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('session')
    return response
  }

  if (isAdminPath(pathname) && session.role !== 'admin') {
    const locale = extractLocale(pathname)
    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
