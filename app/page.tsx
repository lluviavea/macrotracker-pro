'use client'

import { useEffect, useState, useCallback } from 'react'
import type { FoodItem, FoodCategory, Entry } from '@/lib/types'
import { calculateTotals } from '@/lib/macros'
import { DateNavigator } from '@/components/DateNavigator'
import { MacroSummary } from '@/components/MacroSummary'
import { LogEntryList } from '@/components/LogEntryList'
import { CategoryTabs } from '@/components/CategoryTabs'
import { FoodSearch } from '@/components/FoodSearch'
import { FoodGrid } from '@/components/FoodGrid'

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
        (e: { rowIndex: number; food: string; category: string; amount: number }): Entry => ({
          rowIndex: e.rowIndex,
          foodName: e.food,
          category: e.category,
          amount: e.amount,
          amountInput: String(e.amount),
        }),
      )
    } catch {
      return []
    }
  }, [])

  useEffect(() => {
    loadEntries(logDate).then(setEntries)
  }, [logDate, loadEntries])

  const addToLog = async (food: FoodItem) => {
    const defaultAmount = food.measureType === 'unit' ? 1 : 100
    try {
      const r = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: logDate,
          foodName: food.name,
          category: food.category,
          amount: defaultAmount,
        }),
      })
      const d = await r.json()
      if (d.success && d.rowIndex) {
        setEntries(prev => [
          ...prev,
          {
            rowIndex: d.rowIndex,
            foodName: food.name,
            category: food.category,
            amount: defaultAmount,
            amountInput: String(defaultAmount),
          },
        ])
      } else {
        loadEntries(logDate).then(setEntries)
      }
    } catch {
      loadEntries(logDate).then(setEntries)
    }
  }

  const updateAmount = async (index: number) => {
    const entry = entries[index]
    const num = Number(entry.amountInput)
    if (isNaN(num) || num <= 0) return
    setEntries(prev => prev.map((e, i) => (i === index ? { ...e, amount: num } : e)))
    try {
      await fetch('/api/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rowIndex: entry.rowIndex,
          foodName: entry.foodName,
          category: entry.category,
          amount: num,
        }),
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold">MacroTracker</h1>
      </header>

      <DateNavigator
        date={logDate}
        onDateChange={setLogDate}
        onPrevDay={() => changeDate(-1)}
        onNextDay={() => changeDate(1)}
      />

      <MacroSummary
        calories={totals.calories}
        protein={totals.protein}
        fat={totals.fat}
        carbs={totals.carbs}
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

      <FoodGrid foods={filteredFoods} onAdd={addToLog} />
    </div>
  )
}
