import { NextResponse } from 'next/server'
import { getAllFoods } from '@/lib/google-sheets'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const foods = await getAllFoods()
    return NextResponse.json({ foods })
  } catch (error) {
    console.error('Error fetching foods:', error)
    return NextResponse.json({ error: 'Failed to fetch foods' }, { status: 500 })
  }
}
