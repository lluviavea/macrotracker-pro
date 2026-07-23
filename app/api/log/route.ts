import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { getLogForDate, addLogEntry, updateLogEntry, deleteLogEntry } from '@/lib/db/logs'
import { getFoodByNameAndCategory } from '@/lib/db/foods'
import { createLogEntrySchema, updateLogEntrySchema, deleteLogEntrySchema } from '@/lib/validation'
import { requireSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession()
    const date = req.nextUrl.searchParams.get('date')
    if (!date) {
      return NextResponse.json({ error: 'date is required' }, { status: 400 })
    }
    const entries = await getLogForDate(session.userId, date)
    return NextResponse.json({ entries })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch log' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = await req.json()
    const parsed = createLogEntrySchema.parse(body)

    const food = await getFoodByNameAndCategory(parsed.foodName, parsed.category, session.userId)
    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 })

    const id = await addLogEntry(session.userId, food, parsed.amount, parsed.date, parsed.meal)
    return NextResponse.json({ success: true, id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = await req.json()
    const parsed = updateLogEntrySchema.parse(body)

    const food = await getFoodByNameAndCategory(parsed.foodName, parsed.category, session.userId)
    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 })

    await updateLogEntry(session.userId, parsed.id, food, parsed.amount, parsed.meal)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = await req.json()
    const parsed = deleteLogEntrySchema.parse(body)

    await deleteLogEntry(session.userId, parsed.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
