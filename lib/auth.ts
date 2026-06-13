import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export interface SessionUser {
  userId: number
  email: string
  role: 'admin' | 'user'
}

const COOKIE_NAME = 'session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET is not set')
  }
  return new TextEncoder().encode(secret)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ userId: user.userId, email: user.email, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ['HS256'] })
    if (
      typeof payload.userId !== 'number' ||
      typeof payload.email !== 'string' ||
      (payload.role !== 'admin' && payload.role !== 'user')
    ) {
      return null
    }
    return { userId: payload.userId, email: payload.email, role: payload.role }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export function getSessionTokenFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(COOKIE_NAME)?.value
}

export async function getSessionFromRequest(request: NextRequest): Promise<SessionUser | null> {
  const token = getSessionTokenFromRequest(request)
  if (!token) return null
  return verifySessionToken(token)
}

export function buildLoginRedirect(request: NextRequest): NextResponse {
  const locale = request.nextUrl.pathname.split('/')[1] || 'es'
  const loginUrl = new URL(`/${locale}/login`, request.url)
  const response = NextResponse.redirect(loginUrl)
  response.cookies.delete(COOKIE_NAME)
  return response
}
