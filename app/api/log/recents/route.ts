import { NextRequest, NextResponse } from 'next/server'
import { getRecentFoods } from '@/lib/db/logs'
import { requireSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession()
    const limitParam = req.nextUrl.searchParams.get('limit')
    const limit = Math.min(Math.max(Number(limitParam) || 8, 1), 20)
    const recents = await getRecentFoods(session.userId, limit)
    return NextResponse.json({ recents })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch recents' }, { status: 500 })
  }
}
