import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validation'
import { getUserWithPasswordByEmail } from '@/lib/db/users'
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.parse(body)

    const user = await getUserWithPasswordByEmail(parsed.email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const valid = await verifyPassword(parsed.password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createSessionToken({ userId: user.id, email: user.email, role: user.role })
    await setSessionCookie(token)

    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
