import { GoogleAuth } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import type { FoodCategory, FoodItem } from './types'
import { NUTRITION_DATA } from './nutrition'

const SHEET_ID = '1-gLdhqGva8eBhJb6xTzvUmUysj49mv4n_5hb2f7SSMo'

const CATEGORY_MAP: Record<string, FoodCategory> = {
  PROTEINA: 'proteina',
  CARBOHIDRATOS: 'carbohidratos',
  GRASAS: 'grasas',
  FRUTAS: 'frutas',
  VERDURAS: 'verduras',
  CONDIMENTOS: 'condimentos',
  SUPLEMENTOS: 'suplementos',
}

function getAuth() {
  return new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

function lookupNutrition(name: string) {
  const normalized = normalizeName(name)

  for (const entry of NUTRITION_DATA) {
    if (entry.matches.some(m => normalized.includes(m))) {
      return {
        protein: entry.protein,
        fat: entry.fat,
        carbs: entry.carbs,
        calories: entry.calories,
        measureType: entry.measureType,
        unitName: entry.unitName ?? null,
        unitGrams: entry.unitGrams ?? null,
        preparation: entry.preparation ?? null,
      }
    }
  }

  return {
    protein: 0,
    fat: 0,
    carbs: 0,
    calories: 0,
    measureType: 'gram' as const,
    unitName: null,
    unitGrams: null,
    preparation: null,
  }
}

export async function getAllFoods(): Promise<FoodItem[]> {
  const doc = new GoogleSpreadsheet(SHEET_ID, getAuth())
  await doc.loadInfo()

  const foods: FoodItem[] = []

  for (const [sheetTitle, category] of Object.entries(CATEGORY_MAP)) {
    const sheet = doc.sheetsByTitle[sheetTitle]
    if (!sheet) continue

    const rows = await sheet.getCellsInRange('A1:Z100')
    const seen = new Set<string>()

    for (const row of rows) {
      if (!row[0]) continue
      const name = row[0].trim()
      if (!name || seen.has(normalizeName(name))) continue
      seen.add(normalizeName(name))

      const nutrition = lookupNutrition(name)
      foods.push({
        name,
        category,
        ...nutrition,
      })
    }
  }

  return foods
}
