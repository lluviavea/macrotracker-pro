import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { copyLogEntries } from '@/lib/db/logs'
import { addDays } from '@/lib/calendar'
import { requireSession } from '@/lib/auth'

const copyDaySchema = z.object({
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
})

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = await req.json()
    const parsed = copyDaySchema.parse(body)

    const previousDate = addDays(parsed.targetDate, -1)
    const count = await copyLogEntries(session.userId, previousDate, parsed.targetDate)

    return NextResponse.json({ success: true, count, previousDate })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to copy entries' }, { status: 500 })
  }
}
