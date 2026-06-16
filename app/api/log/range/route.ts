import { NextRequest, NextResponse } from 'next/server'
import { getLogForRange } from '@/lib/db/logs'
import { requireSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession()
    const start = req.nextUrl.searchParams.get('start')
    const end = req.nextUrl.searchParams.get('end')

    if (!start || !end) {
      return NextResponse.json({ error: 'Missing start or end date' }, { status: 400 })
    }

    const entries = await getLogForRange(session.userId, start, end)
    return NextResponse.json({ entries })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch log range' }, { status: 500 })
  }
}
