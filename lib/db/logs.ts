import { db } from './index'
import { logEntries } from './schema'
import { eq } from 'drizzle-orm'
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

export async function getLogForDate(targetDate: string): Promise<LogEntry[]> {
  const rows = await db
    .select()
    .from(logEntries)
    .where(eq(logEntries.date, targetDate))
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

export async function addLogEntry(food: FoodItem, amount: number, targetDate: string, meal?: string): Promise<number> {
  const isUnit = food.measureType === 'unit' && food.unitName
  const macros = calculateMacros(food, amount)

  const [row] = await db
    .insert(logEntries)
    .values({
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

export async function updateLogEntry(id: number, food: FoodItem, amount: number): Promise<void> {
  const isUnit = food.measureType === 'unit' && food.unitName
  const macros = calculateMacros(food, amount)

  await db
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
    .where(eq(logEntries.id, id))
}

export async function deleteLogEntry(id: number): Promise<void> {
  await db.delete(logEntries).where(eq(logEntries.id, id))
}
