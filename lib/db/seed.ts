import { db } from './index'
import { foods } from './schema'
import { NUTRITION_DATA } from '../nutrition'

const CATEGORY_RANGES: [number, number, string][] = [
  [0, 8, 'proteina'],
  [9, 19, 'carbohidratos'],
  [20, 27, 'grasas'],
  [28, 34, 'frutas'],
  [35, 53, 'verduras'],
  [54, 72, 'condimentos'],
  [73, 79, 'suplementos'],
]

function assignCategory(index: number): string {
  for (const [start, end, cat] of CATEGORY_RANGES) {
    if (index >= start && index <= end) return cat
  }
  return 'suplementos'
}

async function seed() {
  console.log('Seeding foods from NUTRITION_DATA...')

  for (let i = 0; i < NUTRITION_DATA.length; i++) {
    const entry = NUTRITION_DATA[i]
    const primaryName = entry.matches[0]
    const category = assignCategory(i)

    await db.insert(foods).values({
      name: primaryName,
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

  console.log(`Seeded ${NUTRITION_DATA.length} foods.`)
  console.log('Note: Log entries must be migrated separately from the legacy Google Sheets LOG sheet.')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed:', err)
  process.exit(1)
})
