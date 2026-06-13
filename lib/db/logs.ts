import { db } from './index'
import { logEntries } from './schema'
import { eq, and } from 'drizzle-orm'
import { calculateMacros } from '../macros'
import type { FoodItem } from '../types'

export interface LogEntry {
  id: number
  date: string
  food: string
  category: string
  amount: number
  unit: string
  protein: number
  fat: number
  carbs: number
  sugar: number
  fiber: number
  calories: number
  preparation: string
  meal: string
}

export async function getLogForDate(userId: number, targetDate: string): Promise<LogEntry[]> {
  const rows = await db
    .select()
    .from(logEntries)
    .where(and(eq(logEntries.userId, userId), eq(logEntries.date, targetDate)))
    .orderBy(logEntries.createdAt)

  return rows.map(r => ({
    id: r.id,
    date: r.date,
    food: r.foodName,
    category: r.category,
    amount: Number(r.amount),
    unit: r.unit,
    protein: Number(r.protein),
    fat: Number(r.fat),
    carbs: Number(r.carbs),
    sugar: Number(r.sugar),
    fiber: Number(r.fiber),
    calories: r.calories,
    preparation: r.preparation ?? '',
    meal: r.meal ?? '',
  }))
}

export async function addLogEntry(
  userId: number,
  food: FoodItem,
  amount: number,
  targetDate: string,
  meal?: string,
): Promise<number> {
  const isUnit = food.measureType === 'unit' && food.unitName
  const macros = calculateMacros(food, amount)

  const [row] = await db
    .insert(logEntries)
    .values({
      userId,
      date: targetDate,
      foodName: food.name,
      category: food.category,
      amount: String(amount),
      unit: isUnit ? food.unitName! : 'g',
      protein: String(macros.protein),
      fat: String(macros.fat),
      carbs: String(macros.carbs),
      sugar: String(macros.sugar),
      fiber: String(macros.fiber),
      calories: macros.calories,
      preparation: food.preparation ?? '',
      meal: meal ?? '',
    })
    .returning({ id: logEntries.id })

  return row.id
}

export async function updateLogEntry(userId: number, id: number, food: FoodItem, amount: number): Promise<void> {
  const isUnit = food.measureType === 'unit' && food.unitName
  const macros = calculateMacros(food, amount)

  const result = await db
    .update(logEntries)
    .set({
      amount: String(amount),
      unit: isUnit ? food.unitName! : 'g',
      protein: String(macros.protein),
      fat: String(macros.fat),
      carbs: String(macros.carbs),
      sugar: String(macros.sugar),
      fiber: String(macros.fiber),
      calories: macros.calories,
    })
    .where(and(eq(logEntries.id, id), eq(logEntries.userId, userId)))
    .returning({ id: logEntries.id })

  if (result.length === 0) {
    throw new Error('Log entry not found or access denied')
  }
}

export async function deleteLogEntry(userId: number, id: number): Promise<void> {
  const result = await db
    .delete(logEntries)
    .where(and(eq(logEntries.id, id), eq(logEntries.userId, userId)))
    .returning({ id: logEntries.id })
  if (result.length === 0) {
    throw new Error('Log entry not found or access denied')
  }
}
