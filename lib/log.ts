import { GoogleAuth } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import type { FoodItem } from './types'

const SHEET_ID = '1-gLdhqGva8eBhJb6xTzvUmUysj49mv4n_5hb2f7SSMo'

function parseNum(val: string): number {
  if (!val) return 0
  const parsed = Number(val.replace(',', '.'))
  return isNaN(parsed) ? 0 : parsed
}

function getAuth() {
  return new GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export interface LogEntry {
  date: string
  food: string
  category: string
  amount: number
  unit: string
  protein: number
  fat: number
  carbs: number
  calories: number
  preparation: string
  rowIndex?: number
}

export async function getLogForDate(date: string): Promise<LogEntry[]> {
  const doc = new GoogleSpreadsheet(SHEET_ID, getAuth())
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle['LOG']
  if (!sheet) return []

  const rows = await sheet.getCellsInRange('A1:J1000')
  if (rows.length <= 1) return []

  const entries: LogEntry[] = []
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i]
    if (!r[0]) continue
    if (r[0] !== date) continue

    entries.push({
      date: r[0],
      food: r[1] || '',
      category: r[2] || '',
      amount: parseNum(r[3]),
      unit: r[4] || 'g',
      protein: parseNum(r[5]),
      fat: parseNum(r[6]),
      carbs: parseNum(r[7]),
      calories: parseNum(r[8]),
      preparation: r[9] || '',
      rowIndex: i,
    })
  }

  return entries
}

export async function addLogEntry(food: FoodItem, amount: number, date: string): Promise<number> {
  const doc = new GoogleSpreadsheet(SHEET_ID, getAuth())
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle['LOG']
  if (!sheet) return -1

  const isUnit = food.measureType === 'unit' && food.unitName
  const factor = isUnit && food.unitGrams
    ? (amount * food.unitGrams) / 100
    : amount / 100

  await sheet.addRow({
    Fecha: date,
    Alimento: food.name,
    Categoria: food.category,
    Cantidad: amount,
    Unidad: isUnit ? food.unitName! : 'g',
    Proteina: Math.round(food.protein * factor * 10) / 10,
    Grasa: Math.round(food.fat * factor * 10) / 10,
    Carbs: Math.round(food.carbs * factor * 10) / 10,
    Calorias: Math.round(food.calories * factor),
    Preparacion: food.preparation || '',
  })

  const rows = await sheet.getCellsInRange('A:J')
  return rows.length - 1
}

export async function updateLogEntry(rowIndex: number, food: FoodItem, amount: number): Promise<void> {
  const doc = new GoogleSpreadsheet(SHEET_ID, getAuth())
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle['LOG']
  if (!sheet) return

  const rows = await sheet.getCellsInRange(`A${rowIndex + 1}:J${rowIndex + 1}`)
  if (rows.length === 0) return

  const isUnit = food.measureType === 'unit' && food.unitName
  const factor = isUnit && food.unitGrams
    ? (amount * food.unitGrams) / 100
    : amount / 100

  const cell = rows[0]
  cell[3] = String(amount)
  cell[4] = isUnit ? food.unitName! : 'g'
  cell[5] = String(Math.round(food.protein * factor * 10) / 10)
  cell[6] = String(Math.round(food.fat * factor * 10) / 10)
  cell[7] = String(Math.round(food.carbs * factor * 10) / 10)
  cell[8] = String(Math.round(food.calories * factor))

  await sheet.saveUpdatedCells()
}

export async function deleteLogEntry(rowIndex: number): Promise<void> {
  const doc = new GoogleSpreadsheet(SHEET_ID, getAuth())
  await doc.loadInfo()

  const sheet = doc.sheetsByTitle['LOG']
  if (!sheet) return

  const rows = await sheet.getCellsInRange(`A${rowIndex + 1}:J${rowIndex + 1}`)
  if (rows.length === 0) return

  const cell = rows[0]
  for (let i = 0; i < cell.length; i++) {
    cell[i] = ''
  }
  await sheet.saveUpdatedCells()
}
