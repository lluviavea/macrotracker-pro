'use client'

import { useEffect, useState, useCallback } from 'react'
import type { FoodItem, Entry } from '@/lib/types'
import { calculateTotals } from '@/lib/macros'
import { getGoals } from '@/lib/goals'
import type { Goals } from '@/lib/goals'

function getDate() {
  return new Date().toISOString().slice(0, 10)
}

export function useFoodLog() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [entries, setEntries] = useState<Entry[]>([])
  const [logDate, setLogDate] = useState(getDate())
  const [goals, setGoals] = useState<Goals>(getGoals)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    fetch('/api/foods')
      .then(r => { if (!r.ok) throw new Error('Failed to fetch foods'); return r.json() })
      .then(d => {
        setFoods(d.foods)
        setLoading(false)
        setHasError(false)
      })
      .catch(() => {
        setHasError(true)
        setLoading(false)
      })
  }, [])

  const loadEntries = useCallback(async (date: string): Promise<Entry[]> => {
    const r = await fetch(`/api/log?date=${date}`)
    if (!r.ok) throw new Error('Failed to load entries')
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
  }, [])

  useEffect(() => {
    let cancelled = false
    loadEntries(logDate).then(entries => { if (!cancelled) setEntries(entries) }).catch(() => { if (!cancelled) setHasError(true) })
    return () => { cancelled = true }
  }, [logDate, loadEntries])

  const createEntry = useCallback(async (food: FoodItem, amount: number, meal: string): Promise<boolean> => {
    try {
      const r = await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: logDate,
          foodName: food.name,
          category: food.category,
          amount,
          meal,
        }),
      })
      const d = await r.json()
      if (d.success && d.id) {
        setEntries(prev => [...prev, { id: d.id, foodName: food.name, category: food.category, amount, amountInput: String(amount), meal }])
        return true
      }
      return false
    } catch {
      return false
    }
  }, [logDate])

  const reloadEntries = useCallback(async () => {
    try {
      const fresh = await loadEntries(logDate)
      setEntries(fresh)
      setHasError(false)
    } catch {
      setHasError(true)
    }
  }, [logDate, loadEntries])

  const updateEntry = useCallback(async (index: number): Promise<boolean> => {
    const entry = entries[index]
    const num = Number(entry.amountInput)
    if (isNaN(num) || num <= 0) return false
    setEntries(prev => prev.map((e, i) => (i === index ? { ...e, amount: num } : e)))
    try {
      const r = await fetch('/api/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id, foodName: entry.foodName, category: entry.category, amount: num }),
      })
      if (!r.ok) {
        await reloadEntries()
        return false
      }
      return true
    } catch {
      await reloadEntries()
      return false
    }
  }, [entries, reloadEntries])

  const deleteEntry = useCallback(async (index: number): Promise<boolean> => {
    const entry = entries[index]
    setEntries(prev => prev.filter((_, i) => i !== index))
    try {
      const r = await fetch('/api/log', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id }),
      })
      if (!r.ok) {
        await reloadEntries()
        return false
      }
      return true
    } catch {
      await reloadEntries()
      return false
    }
  }, [entries, reloadEntries])

  const changeDate = useCallback((days: number) => {
    const d = new Date(logDate + 'T12:00:00')
    d.setDate(d.getDate() + days)
    setLogDate(d.toISOString().slice(0, 10))
  }, [logDate])

  const handleAmountInputChange = useCallback((index: number, value: string) => {
    setEntries(prev => prev.map((e, i) => (i === index ? { ...e, amountInput: value } : e)))
  }, [])

  const totals = calculateTotals(foods, entries)

  return {
    foods, loading, entries, logDate, goals, hasError, totals,
    setLogDate, setGoals, setHasError,
    createEntry, updateEntry, deleteEntry, reloadEntries,
    changeDate, handleAmountInputChange,
  }
}
