import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { createFoodSchema, updateFoodSchema, deleteFoodSchema } from '@/lib/validation'
import { getAllFoods, insertFood, updateFood, deleteFood } from '@/lib/db/foods'
import { requireSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await requireSession()
    const foods = await getAllFoods(session.userId)
    console.log('[GET /api/foods] userId=', session.userId, 'count=', foods.length)
    return NextResponse.json({ foods })
  } catch (error) {
    console.error('Error fetching foods:', error)
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = await req.json()
    console.log('[POST /api/foods] userId=', session.userId, 'body=', JSON.stringify(body))
    const parsed = createFoodSchema.parse(body)

    const id = await insertFood(session.userId, parsed)
    console.log('[POST /api/foods] inserted id=', id)
    return NextResponse.json({ success: true, id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error inserting food:', error)
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = await req.json()
    console.log('[PUT /api/foods] userId=', session.userId, 'body=', JSON.stringify(body))
    const parsed = updateFoodSchema.parse(body)

    await updateFood(parsed.id, session.userId, parsed)
    console.log('[PUT /api/foods] updated id=', parsed.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error updating food:', error)
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireSession()
    const body = await req.json()
    const parsed = deleteFoodSchema.parse(body)

    await deleteFood(parsed.id, session.userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Error deleting food:', error)
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 })
  }
}
