import { db } from './index'
import { foods } from './schema'
import { eq, and } from 'drizzle-orm'
import type { FoodItem, FoodCategory } from '../types'
import { normalizeName, lookupNutrition } from '../nutrition-utils'

export async function getAllFoods(): Promise<FoodItem[]> {
  const rows = await db.select().from(foods).orderBy(foods.category, foods.name)
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
): Promise<FoodItem | null> {
  const rows = await db
    .select()
    .from(foods)
    .where(and(eq(foods.name, name), eq(foods.category, category as FoodCategory)))
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

export async function insertFood(data: {
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
  await db
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
    .where(eq(foods.id, id))
}

export async function deleteFood(id: number): Promise<void> {
  await db.delete(foods).where(eq(foods.id, id))
}

export { normalizeName, lookupNutrition }
