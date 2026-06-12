import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { createFoodSchema, updateFoodSchema, deleteFoodSchema } from '@/lib/validation'
import { getAllFoods, insertFood, updateFood, deleteFood } from '@/lib/db/foods'

export const revalidate = 3600

export async function GET() {
  try {
    const foods = await getAllFoods()
    return NextResponse.json({ foods })
  } catch (error) {
    console.error('Error fetching foods:', error)
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 })
  }
}

function revalidateCatalog() {
  revalidatePath('/api/foods')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createFoodSchema.parse(body)

    const id = await insertFood(parsed)
    revalidateCatalog()
    return NextResponse.json({ success: true, id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    console.error('Error inserting food:', error)
    return NextResponse.json({ error: 'Failed to create food' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = updateFoodSchema.parse(body)

    await updateFood(parsed.id, parsed)
    revalidateCatalog()
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    console.error('Error updating food:', error)
    return NextResponse.json({ error: 'Failed to update food' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = deleteFoodSchema.parse(body)

    await deleteFood(parsed.id)
    revalidateCatalog()
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    console.error('Error deleting food:', error)
    return NextResponse.json({ error: 'Failed to delete food' }, { status: 500 })
  }
}
