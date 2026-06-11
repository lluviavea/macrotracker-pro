'use client'

import { useEffect, useState, useCallback } from 'react'
import type { FoodItem, FoodCategory } from '@/lib/types'

const CATEGORIES: { key: FoodCategory; label: string; color: string }[] = [
  { key: 'proteina', label: 'Proteína', color: 'bg-red-100 text-red-800 border-red-200' },
  { key: 'carbohidratos', label: 'Carbohidratos', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { key: 'grasas', label: 'Grasas', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { key: 'frutas', label: 'Frutas', color: 'bg-green-100 text-green-800 border-green-200' },
  { key: 'verduras', label: 'Verduras', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { key: 'condimentos', label: 'Condimentos', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { key: 'suplementos', label: 'Suplementos', color: 'bg-blue-100 text-blue-800 border-blue-200' },
]

interface Entry {
  rowIndex: number
  foodName: string
  category: string
  amount: number
  amountInput: string
}

function getDate() { return new Date().toISOString().slice(0, 10) }

export default function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('proteina')
  const [entries, setEntries] = useState<Entry[]>([])
  const [logDate, setLogDate] = useState(getDate())
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/foods')
      .then(r => r.json())
      .then(d => { setFoods(d.foods); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const loadEntries = useCallback(async (date: string): Promise<Entry[]> => {
    try {
      const r = await fetch(`/api/log?date=${date}`)
      const d = await r.json()
      return d.entries.map((e: { rowIndex: number; food: string; category: string; amount: number }): Entry => ({
        rowIndex: e.rowIndex,
        foodName: e.food,
        category: e.category,
        amount: e.amount,
        amountInput: String(e.amount),
      }))
    } catch {
      return []
    }
  }, [])

  useEffect(() => {
    loadEntries(logDate).then(setEntries)
  }, [logDate, loadEntries])

  const findFood = (name: string, cat: string) =>
    foods.find(f => f.name === name && f.category === cat)

  const addToLog = async (food: FoodItem) => {
    const defaultAmount = food.measureType === 'unit' ? 1 : 100
    try {
      const r = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: logDate, foodName: food.name, category: food.category, amount: defaultAmount }),
      })
      const d = await r.json()
      if (d.success && d.rowIndex) {
        setEntries(prev => [...prev, { rowIndex: d.rowIndex, foodName: food.name, category: food.category, amount: defaultAmount, amountInput: String(defaultAmount) }])
      } else { loadEntries(logDate).then(setEntries) }
    } catch { loadEntries(logDate).then(setEntries) }
  }

  const updateAmount = async (index: number) => {
    const entry = entries[index]
    const num = Number(entry.amountInput)
    if (isNaN(num) || num <= 0) return
    setEntries(prev => prev.map((e, i) => i === index ? { ...e, amount: num } : e))
    try {
      await fetch('/api/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex: entry.rowIndex, foodName: entry.foodName, category: entry.category, amount: num }),
      })
    } catch {}
  }

  const removeFromLog = async (index: number) => {
    const entry = entries[index]
    setEntries(prev => prev.filter((_, i) => i !== index))
    try {
      await fetch('/api/log', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex: entry.rowIndex }),
      })
    } catch {}
  }

  const changeDate = (days: number) => {
    const d = new Date(logDate + 'T12:00:00')
    d.setDate(d.getDate() + days)
    setLogDate(d.toISOString().slice(0, 10))
  }

  const getMacros = (entry: Entry) => {
    const food = findFood(entry.foodName, entry.category)
    if (!food) return { protein: 0, fat: 0, carbs: 0, calories: 0 }
    const factor = food.measureType === 'unit' && food.unitGrams
      ? (entry.amount * food.unitGrams) / 100
      : entry.amount / 100
    return {
      protein: Math.round(food.protein * factor * 10) / 10,
      fat: Math.round(food.fat * factor * 10) / 10,
      carbs: Math.round(food.carbs * factor * 10) / 10,
      calories: Math.round(food.calories * factor),
    }
  }

  const totals = entries.reduce((acc, e) => {
    const m = getMacros(e)
    return { protein: acc.protein + m.protein, fat: acc.fat + m.fat, carbs: acc.carbs + m.carbs, calories: acc.calories + m.calories }
  }, { protein: 0, fat: 0, carbs: 0, calories: 0 })

  const filteredFoods = foods.filter(f =>
    f.category === selectedCategory &&
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">Cargando...</p></div>

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <header className="text-center"><h1 className="text-2xl font-bold">MacroTracker</h1></header>

      <div className="flex items-center justify-center gap-4">
        <button onClick={() => changeDate(-1)} className="text-sm text-gray-400 hover:text-gray-600">&larr;</button>
        <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5" />
        <button onClick={() => changeDate(1)} className="text-sm text-gray-400 hover:text-gray-600">&rarr;</button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Calorías', value: Math.round(totals.calories), unit: 'kcal', color: 'text-gray-900' },
          { label: 'Proteína', value: Math.round(totals.protein * 10) / 10, unit: 'g', color: 'text-red-600' },
          { label: 'Grasa', value: Math.round(totals.fat * 10) / 10, unit: 'g', color: 'text-orange-600' },
          { label: 'Carbs', value: Math.round(totals.carbs * 10) / 10, unit: 'g', color: 'text-yellow-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-500 uppercase">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400">{s.unit}</p>
          </div>
        ))}
      </div>

      {entries.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold">Registro</h2>
            <span className="text-xs text-gray-400">{entries.length} alimentos</span>
          </div>
          <div className="divide-y divide-gray-100">
            {entries.map((entry, i) => {
              const m = getMacros(entry)
              const food = findFood(entry.foodName, entry.category)
              const isUnit = food?.measureType === 'unit' && food?.unitName
              return (
                <div key={entry.rowIndex} className="p-3 flex items-center gap-3">
                  <button onClick={() => removeFromLog(i)} className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{entry.foodName}</p>
                    <div className="flex gap-1 mt-0.5">
                      <span className="text-xs text-gray-400">{entry.category}</span>
                      {food?.preparation && (
                        <span className={`text-[10px] px-1.5 rounded-full font-medium ${food.preparation === 'crudo' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{food.preparation}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" value={entry.amountInput}
                      onChange={e => setEntries(prev => prev.map((e2, i2) => i2 === i ? { ...e2, amountInput: e.target.value } : e2))}
                      onBlur={() => updateAmount(i)}
                      className="w-20 text-center border border-gray-200 rounded-lg px-2 py-1 text-sm" min={0} step={isUnit ? 1 : 10} />
                    <span className="text-xs text-gray-500 w-8">{isUnit ? food?.unitName : 'g'}</span>
                  </div>
                  <div className="text-right text-xs text-gray-500 w-24 leading-tight">
                    <p>{m.protein}P</p><p>{m.fat}F</p><p>{m.carbs}C</p>
                    <p className="font-medium">{m.calories}kcal</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-sm text-gray-400">Sin alimentos registrados</div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setSelectedCategory(c.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${selectedCategory === c.key ? c.color : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Buscar..." className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filteredFoods.map(f => (
          <button key={`${f.category}-${f.name}`} onClick={() => addToLog(f)}
            className="bg-white rounded-xl p-3 border border-gray-200 text-left hover:border-blue-300 hover:shadow-sm transition-all text-sm">
            <p className="font-medium truncate">{f.name}</p>
            <p className="text-xs text-gray-400 mt-1">{f.protein}P · {f.fat}F · {f.carbs}C · {f.calories}kcal</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] text-gray-400">/100{f.measureType === 'unit' && f.unitName ? f.unitName : 'g'}</span>
              {f.preparation && <span className={`text-[10px] px-1.5 rounded-full font-medium ${f.preparation === 'crudo' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{f.preparation}</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
