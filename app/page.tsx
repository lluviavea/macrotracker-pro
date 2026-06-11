'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type { FoodItem, FoodCategory, Entry } from '@/lib/types'
import { calculateTotals } from '@/lib/macros'
import { DateNavigator } from '@/components/DateNavigator'
import { MacroSummary } from '@/components/MacroSummary'
import { LogEntryList } from '@/components/LogEntryList'
import { CategoryTabs } from '@/components/CategoryTabs'
import { FoodSearch } from '@/components/FoodSearch'
import { FoodGrid } from '@/components/FoodGrid'
import { showToast } from '@/components/Toast'
import { getGoals, saveGoals } from '@/lib/goals'
import type { Goals } from '@/lib/goals'

function getDate() {
  return new Date().toISOString().slice(0, 10)
}

export default function Home() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('proteina')
  const [entries, setEntries] = useState<Entry[]>([])
  const [logDate, setLogDate] = useState(getDate())
  const [search, setSearch] = useState('')
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null)
  const [pendingAmount, setPendingAmount] = useState('')
  const [pendingMeal, setPendingMeal] = useState('')
  const [goals, setGoals] = useState<Goals>(getGoals)
  const [showGoals, setShowGoals] = useState(false)
  const [editGoals, setEditGoals] = useState<Goals>(getGoals)

  useEffect(() => {
    fetch('/api/foods')
      .then(r => r.json())
      .then(d => {
        setFoods(d.foods)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const loadEntries = useCallback(async (date: string): Promise<Entry[]> => {
    try {
      const r = await fetch(`/api/log?date=${date}`)
      const d = await r.json()
      return d.entries.map(
        (e: { id: number; food: string; category: string; amount: number; meal: string }): Entry => ({
          id: e.id,
          foodName: e.food,
          category: e.category,
          amount: e.amount,
          amountInput: String(e.amount),
          meal: e.meal ?? '',
        }),
      )
    } catch {
      return []
    }
  }, [])

  useEffect(() => {
    loadEntries(logDate).then(setEntries)
  }, [logDate, loadEntries])

  const addToLog = async (food: FoodItem, customAmount?: number, meal?: string) => {
    const amount = customAmount ?? (food.measureType === 'unit' ? 1 : 100)
    try {
      const r = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: logDate,
          foodName: food.name,
          category: food.category,
          amount,
          meal: meal ?? '',
        }),
      })
      const d = await r.json()
      if (d.success && d.id) {
        setEntries(prev => [
          ...prev,
          {
            id: d.id,
            foodName: food.name,
            category: food.category,
            amount,
            amountInput: String(amount),
            meal: meal ?? '',
          },
        ])
        showToast(`Agregado: ${food.name}`)
      } else {
        showToast(`Error al agregar ${food.name}`, 'error')
        loadEntries(logDate).then(setEntries)
      }
    } catch {
      showToast(`Error al agregar ${food.name}`, 'error')
      loadEntries(logDate).then(setEntries)
    }
  }

  const updateAmount = async (index: number) => {
    const entry = entries[index]
    const num = Number(entry.amountInput)
    if (isNaN(num) || num <= 0) return
    setEntries(prev => prev.map((e, i) => (i === index ? { ...e, amount: num } : e)))
    try {
      const r = await fetch('/api/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: entry.id,
          foodName: entry.foodName,
          category: entry.category,
          amount: num,
        }),
      })
      if (!r.ok) {
        showToast('Error al actualizar cantidad', 'error')
        loadEntries(logDate).then(setEntries)
      }
    } catch {
      showToast('Error al actualizar cantidad', 'error')
      loadEntries(logDate).then(setEntries)
    }
  }

  const removeFromLog = async (index: number) => {
    const entry = entries[index]
    setEntries(prev => prev.filter((_, i) => i !== index))
    try {
      const r = await fetch('/api/log', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id }),
      })
      if (r.ok) {
        showToast(`Eliminado: ${entry.foodName}`, 'warning')
      } else {
        showToast('Error al eliminar', 'error')
        loadEntries(logDate).then(setEntries)
      }
    } catch {
      showToast('Error al eliminar', 'error')
      loadEntries(logDate).then(setEntries)
    }
  }

  const changeDate = (days: number) => {
    const d = new Date(logDate + 'T12:00:00')
    d.setDate(d.getDate() + days)
    setLogDate(d.toISOString().slice(0, 10))
  }

  const handleFoodSelect = (food: FoodItem) => {
    setPendingFood(food)
    setPendingAmount(String(food.measureType === 'unit' ? 1 : 100))
    setPendingMeal('')
  }

  const confirmAdd = () => {
    if (!pendingFood) return
    const num = parseFloat(pendingAmount) || 0
    if (num <= 0) return
    addToLog(pendingFood, num, pendingMeal)
    setPendingFood(null)
  }

  const handleAmountInputChange = (index: number, value: string) => {
    setEntries(prev => prev.map((e, i) => (i === index ? { ...e, amountInput: value } : e)))
  }

  const totals = calculateTotals(foods, entries)

  const filteredFoods = foods.filter(
    f =>
      f.category === selectedCategory &&
      f.name.toLowerCase().includes(search.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-gray-200 rounded-lg" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-64 mx-auto bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-28 bg-gray-200 rounded-full" />
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">MacroTracker</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => { setEditGoals({ ...goals }); setShowGoals(true) }} className="text-sm text-gray-400 hover:text-gray-600">Metas</button>
          <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600">Admin</Link>
        </div>
      </header>

      <DateNavigator
        date={logDate}
        onDateChange={setLogDate}
        onPrevDay={() => changeDate(-1)}
        onNextDay={() => changeDate(1)}
        onToday={() => setLogDate(getDate())}
      />

      <MacroSummary
        calories={totals.calories}
        protein={totals.protein}
        fat={totals.fat}
        carbs={totals.carbs}
        sugar={totals.sugar}
        fiber={totals.fiber}
        goals={goals}
      />

      <LogEntryList
        entries={entries}
        foods={foods}
        onRemove={removeFromLog}
        onAmountInputChange={handleAmountInputChange}
        onAmountBlur={updateAmount}
      />

      <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />

      <FoodSearch value={search} onChange={setSearch} />

      <FoodGrid foods={filteredFoods} onAdd={handleFoodSelect} />

      {pendingFood && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setPendingFood(null)}>
          <div className="bg-white rounded-xl shadow-xl p-5 w-72 mx-4" onClick={e => e.stopPropagation()}>
            <p className="font-medium text-sm mb-3">Agregar {pendingFood.name}</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={pendingAmount}
                onChange={e => setPendingAmount(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') confirmAdd() }}
                placeholder="0"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                autoFocus
                min={0}
                step={pendingFood.measureType === 'unit' ? 1 : 10}
              />
              <span className="text-sm text-gray-500 w-10">
                {pendingFood.measureType === 'unit' && pendingFood.unitName ? pendingFood.unitName : 'g'}
              </span>
            </div>
            <div className="mt-2">
              <select
                value={pendingMeal}
                onChange={e => setPendingMeal(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                <option value="">Sin comida</option>
                <option value="desayuno">Desayuno</option>
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={confirmAdd} className="flex-1 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
                Agregar
              </button>
              <button onClick={() => setPendingFood(null)} className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showGoals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={() => setShowGoals(false)}>
          <div className="bg-white rounded-xl shadow-xl p-5 w-80 mx-4" onClick={e => e.stopPropagation()}>
            <p className="font-medium text-sm mb-4">Metas diarias</p>
            <div className="space-y-3">
              {(['calories', 'protein', 'fat', 'carbs'] as const).map(key => {
                const labels: Record<string, string> = { calories: 'Calorías', protein: 'Proteína (g)', fat: 'Grasa (g)', carbs: 'Carbs (g)' }
                return (
                  <div key={key}>
                    <label className="block text-xs text-gray-500 mb-1">{labels[key]}</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={editGoals[key] || ''}
                        onChange={e => {
                          const raw = e.target.value
                          if (raw === '') { setEditGoals(g => ({ ...g, [key]: 0 })); return }
                          const cleaned = raw.replace(/^0+/, '')
                          setEditGoals(g => ({ ...g, [key]: parseInt(cleaned, 10) || 0 }))
                        }}
                        placeholder={key === 'calories' ? '2000' : key === 'protein' ? '100' : key === 'fat' ? '65' : '250'}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                      />
                  </div>
                )
              })}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => { saveGoals(editGoals); setGoals(editGoals); setShowGoals(false) }}
                className="flex-1 bg-black text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
              >
                Guardar
              </button>
              <button onClick={() => setShowGoals(false)} className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
