import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validation'
import { getUserByEmail, createUser } from '@/lib/db/users'
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth'
import { seedUserCatalog } from '@/lib/db/foods'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.parse(body)

    const existing = await getUserByEmail(parsed.email)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await hashPassword(parsed.password)
    const user = await createUser(parsed.email, passwordHash, 'user')
    await seedUserCatalog(user.id)

    const token = await createSessionToken({ userId: user.id, email: user.email, role: user.role })
    const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } })
    await setSessionCookie(response, token)

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
