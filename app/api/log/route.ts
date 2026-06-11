import { NextRequest, NextResponse } from 'next/server'
import { getLogForDate, addLogEntry, updateLogEntry, deleteLogEntry } from '@/lib/log'
import { getAllFoods } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date') || new Date().toISOString().slice(0, 10)
  try {
    const entries = await getLogForDate(date)
    return NextResponse.json({ entries })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch log' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { date, foodName, category, amount } = await req.json()
    if (!foodName || amount === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const foods = await getAllFoods()
    const food = foods.find(f => f.name === foodName && f.category === category)
    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 })

    const rowIndex = await addLogEntry(food, amount, date || new Date().toISOString().slice(0, 10))
    return NextResponse.json({ success: true, rowIndex })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { rowIndex, foodName, category, amount } = await req.json()
    if (rowIndex === undefined || !foodName || amount === undefined) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const foods = await getAllFoods()
    const food = foods.find(f => f.name === foodName && f.category === category)
    if (!food) return NextResponse.json({ error: 'Food not found' }, { status: 404 })

    await updateLogEntry(rowIndex, food, amount)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { rowIndex } = await req.json()
    if (rowIndex === undefined) return NextResponse.json({ error: 'Missing rowIndex' }, { status: 400 })

    await deleteLogEntry(rowIndex)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 })
  }
}
