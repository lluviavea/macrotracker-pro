import { db } from './index'
import { foods, logEntries } from './schema'
import { eq, and } from 'drizzle-orm'
import type { FoodItem, FoodCategory } from '../types'
import { normalizeName, lookupNutrition } from '../nutrition-utils'
import { calculateMacros } from '../macros'
import { NUTRITION_DATA } from '../nutrition'

export async function getAllFoods(userId: number): Promise<FoodItem[]> {
  const rows = await db.select().from(foods).where(eq(foods.userId, userId)).orderBy(foods.category, foods.name)
  return rows.map(r => ({
    id: r.id,
    name: r.name,
    nameEn: r.nameEn,
    category: r.category as FoodCategory,
    protein: Number(r.protein),
    fat: Number(r.fat),
    carbs: Number(r.carbs),
    sugar: Number(r.sugar),
    fiber: Number(r.fiber),
    calories: r.calories,
    measureType: r.measureType as 'gram' | 'unit',
    unitName: r.unitName,
    unitGrams: r.unitGrams ? Number(r.unitGrams) : null,
    preparation: r.preparation as 'crudo' | 'cocido' | null,
  }))
}

export async function getFoodByNameAndCategory(
  name: string,
  category: string,
  userId: number,
): Promise<FoodItem | null> {
  const rows = await db
    .select()
    .from(foods)
    .where(and(eq(foods.userId, userId), eq(foods.name, name), eq(foods.category, category as FoodCategory)))
    .limit(1)

  if (rows.length === 0) return null

  const r = rows[0]
  return {
    id: r.id,
    name: r.name,
    nameEn: r.nameEn,
    category: r.category as FoodCategory,
    protein: Number(r.protein),
    fat: Number(r.fat),
    carbs: Number(r.carbs),
    sugar: Number(r.sugar),
    fiber: Number(r.fiber),
    calories: r.calories,
    measureType: r.measureType as 'gram' | 'unit',
    unitName: r.unitName,
    unitGrams: r.unitGrams ? Number(r.unitGrams) : null,
    preparation: r.preparation as 'crudo' | 'cocido' | null,
  }
}

export async function insertFood(userId: number, data: {
  name: string
  nameEn: string | null
  category: string
  protein: number
  fat: number
  carbs: number
  sugar: number
  fiber: number
  calories: number
  measureType: string
  unitName: string | null
  unitGrams: number | null
  preparation: string | null
}): Promise<number> {
  const [row] = await db
    .insert(foods)
    .values({
      userId,
      name: data.name,
      nameEn: data.nameEn,
      category: data.category,
      protein: String(data.protein),
      fat: String(data.fat),
      carbs: String(data.carbs),
      sugar: String(data.sugar),
      fiber: String(data.fiber),
      calories: data.calories,
      measureType: data.measureType,
      unitName: data.unitName,
      unitGrams: data.unitGrams !== null ? String(data.unitGrams) : null,
      preparation: data.preparation,
    })
    .returning({ id: foods.id })

  return row.id
}

export async function updateFood(
  id: number,
  userId: number,
  data: {
    name: string
    nameEn: string | null
    category: string
    protein: number
    fat: number
    carbs: number
    sugar: number
    fiber: number
    calories: number
    measureType: string
    unitName: string | null
    unitGrams: number | null
    preparation: string | null
  },
): Promise<void> {
  const result = await db
    .update(foods)
    .set({
      name: data.name,
      nameEn: data.nameEn,
      category: data.category,
      protein: String(data.protein),
      fat: String(data.fat),
      carbs: String(data.carbs),
      sugar: String(data.sugar),
      fiber: String(data.fiber),
      calories: data.calories,
      measureType: data.measureType,
      unitName: data.unitName,
      unitGrams: data.unitGrams !== null ? String(data.unitGrams) : null,
      preparation: data.preparation,
    })
    .where(and(eq(foods.id, id), eq(foods.userId, userId)))
    .returning({ id: foods.id })

  if (result.length === 0) {
    throw new Error('Food not found or access denied')
  }

  const foodItem: FoodItem = {
    id,
    name: data.name,
    nameEn: data.nameEn,
    category: data.category as FoodCategory,
    protein: data.protein,
    fat: data.fat,
    carbs: data.carbs,
    sugar: data.sugar,
    fiber: data.fiber,
    calories: data.calories,
    measureType: data.measureType as 'gram' | 'unit',
    unitName: data.unitName,
    unitGrams: data.unitGrams,
    preparation: data.preparation as 'crudo' | 'cocido' | null,
  }

  const logRows = await db
    .select()
    .from(logEntries)
    .where(
      and(
        eq(logEntries.userId, userId),
        eq(logEntries.foodName, data.name),
        eq(logEntries.category, data.category),
      ),
    )

  for (const row of logRows) {
    const amount = Number(row.amount)
    const macros = calculateMacros(foodItem, amount)
    await db
      .update(logEntries)
      .set({
        protein: String(macros.protein),
        fat: String(macros.fat),
        carbs: String(macros.carbs),
        sugar: String(macros.sugar),
        fiber: String(macros.fiber),
        calories: macros.calories,
      })
      .where(eq(logEntries.id, row.id))
  }
}

const CATEGORY_RANGES: [number, number, string][] = [
  [0, 21, 'proteina'],
  [22, 66, 'carbohidratos'],
  [67, 97, 'grasas'],
  [98, 128, 'frutas'],
  [129, 167, 'verduras'],
  [168, 187, 'condimentos'],
  [188, 194, 'suplementos'],
]

function assignCategory(index: number): string {
  for (const [start, end, cat] of CATEGORY_RANGES) {
    if (index >= start && index <= end) return cat
  }
  return 'suplementos'
}

export async function seedUserCatalog(userId: number): Promise<void> {
  for (let i = 0; i < NUTRITION_DATA.length; i++) {
    const entry = NUTRITION_DATA[i]
    const primaryName = entry.matches[0]
    const category = assignCategory(i)

    await db.insert(foods).values({
      userId,
      name: primaryName,
      nameEn: entry.nameEn,
      category,
      protein: String(entry.protein),
      fat: String(entry.fat),
      carbs: String(entry.carbs),
      sugar: String(entry.sugar ?? 0),
      fiber: String(entry.fiber ?? 0),
      calories: entry.calories,
      measureType: entry.measureType,
      unitName: entry.unitName ?? null,
      unitGrams: entry.unitGrams !== undefined ? String(entry.unitGrams) : null,
      preparation: entry.preparation ?? null,
    })
  }
}

export async function deleteFood(id: number, userId: number): Promise<void> {
  const result = await db
    .delete(foods)
    .where(and(eq(foods.id, id), eq(foods.userId, userId)))
    .returning({ id: foods.id })
  if (result.length === 0) {
    throw new Error('Food not found or access denied')
  }
}

export { normalizeName, lookupNutrition }
