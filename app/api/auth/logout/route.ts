import { NextResponse } from 'next/server'
import { deleteSessionCookie } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ success: true })
  await deleteSessionCookie(response)
  return response
}
