import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { getLogForDate, addLogEntry, updateLogEntry, deleteLogEntry } from '@/lib/db/logs'
import { getFoodByNameAndCategory } from '@/lib/db/foods'
import { createLogEntrySchema, updateLogEntrySchema, deleteLogEntrySchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') || new Date().toISOString().slice(0, 10)
  try {
    const entries = await getLogForDate(date)
    return NextResponse.json({ entries })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch log' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createLogEntrySchema.parse(body)

    const food = await getFoodByNameAndCategory(parsed.foodName, parsed.category)
    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 })

    const id = await addLogEntry(food, parsed.amount, parsed.date || new Date().toISOString().slice(0, 10), parsed.meal)
    return NextResponse.json({ success: true, id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = updateLogEntrySchema.parse(body)

    const food = await getFoodByNameAndCategory(parsed.foodName, parsed.category)
    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 })

    await updateLogEntry(parsed.id, food, parsed.amount)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = deleteLogEntrySchema.parse(body)

    await deleteLogEntry(parsed.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
