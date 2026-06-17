'use client'

import { useEffect, useState, useCallback } from 'react'
import type { FoodItem, Entry } from '@/lib/types'
import { calculateTotals } from '@/lib/macros'
import { getGoals } from '@/lib/goals'
import type { Goals } from '@/lib/goals'
import type { RecentFoodRef } from '@/lib/recents'
import { getLocalISODate, addDays } from '@/lib/calendar'

function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.assign('/login')
  }
}

function getDate() {
  return getLocalISODate()
}

export type LoadError = 'auth' | 'load-foods' | 'load-entries' | null

export function useFoodLog() {
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [entriesLoading, setEntriesLoading] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])
  const [logDate, setLogDate] = useState(getDate())
  const [goals, setGoals] = useState<Goals>(getGoals)
  const [error, setError] = useState<LoadError>(null)
  const [recents, setRecents] = useState<FoodItem[]>([])
  const [recentsLoading, setRecentsLoading] = useState(false)

  useEffect(() => {
    fetch('/api/foods')
      .then(r => {
        if (r.status === 401) { redirectToLogin(); throw new Error('Unauthorized') }
        if (!r.ok) throw new Error('Failed to fetch foods')
        return r.json()
      })
      .then(d => {
        setFoods(d.foods)
        setLoading(false)
        setError(null)
      })
      .catch(() => {
        setError('load-foods')
        setLoading(false)
      })
  }, [])

  const loadRecents = useCallback(async (currentFoods: FoodItem[]): Promise<FoodItem[]> => {
    const r = await fetch('/api/log/recents?limit=8')
    if (r.status === 401) { redirectToLogin(); throw new Error('Unauthorized') }
    if (!r.ok) throw new Error('Failed to load recents')
    const d = await r.json()
    const refs: RecentFoodRef[] = d.recents
    return refs
      .map(ref => currentFoods.find(f => f.name === ref.name && f.category === ref.category))
      .filter((f): f is FoodItem => f !== undefined)
  }, [])

  useEffect(() => {
    if (foods.length === 0) return
    let cancelled = false
    const run = async () => {
      setRecentsLoading(true)
      try {
        const next = await loadRecents(foods)
        if (!cancelled) setRecents(next)
      } catch {
        // Recents are non-critical; leave empty on failure
      } finally {
        if (!cancelled) setRecentsLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [foods, loadRecents])

  const loadEntries = useCallback(async (date: string): Promise<Entry[]> => {
    const r = await fetch(`/api/log?date=${date}`)
    if (r.status === 401) { redirectToLogin(); throw new Error('Unauthorized') }
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
    const run = async () => {
      setEntriesLoading(true)
      try {
        const entries = await loadEntries(logDate)
        if (!cancelled) {
          setEntries(entries)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('load-entries')
      } finally {
        if (!cancelled) setEntriesLoading(false)
      }
    }
    run()
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
      if (r.status === 401) { redirectToLogin(); return false }
      const d = await r.json()
      if (d.success && d.id) {
        setEntries(prev => [...prev, { id: d.id, foodName: food.name, category: food.category, amount, amountInput: String(amount), meal }])
        setRecents(prev => {
          const next = [food, ...prev.filter(f => !(f.name === food.name && f.category === food.category))]
          return next.slice(0, 8)
        })
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
      setError(null)
    } catch {
      setError('load-entries')
    }
  }, [logDate, loadEntries])

  const reloadFoods = useCallback(async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/foods')
      if (r.status === 401) { redirectToLogin(); return }
      if (!r.ok) throw new Error('Failed to fetch foods')
      const d = await r.json()
      setFoods(d.foods)
      setError(null)
    } catch {
      setError('load-foods')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEntry = useCallback(async (index: number): Promise<boolean> => {
    const entry = entries[index]
    const num = Number(entry.amountInput)
    if (isNaN(num) || num <= 0) return false
    const snapshot = entries
    setEntries(prev => prev.map((e, i) => (i === index ? { ...e, amount: num } : e)))
    try {
      const r = await fetch('/api/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id, foodName: entry.foodName, category: entry.category, amount: num, meal: entry.meal }),
      })
      if (r.status === 401) { redirectToLogin(); return false }
      if (!r.ok) { setEntries(snapshot); return false }
      return true
    } catch {
      setEntries(snapshot)
      return false
    }
  }, [entries])

  const changeMeal = useCallback(async (index: number, meal: string): Promise<boolean> => {
    const entry = entries[index]
    const snapshot = entries
    setEntries(prev => prev.map((e, i) => (i === index ? { ...e, meal } : e)))
    try {
      const r = await fetch('/api/log', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id, foodName: entry.foodName, category: entry.category, amount: entry.amount, meal }),
      })
      if (r.status === 401) { redirectToLogin(); return false }
      if (!r.ok) { setEntries(snapshot); return false }
      return true
    } catch {
      setEntries(snapshot)
      return false
    }
  }, [entries])

  const deleteEntry = useCallback(async (index: number): Promise<boolean> => {
    const entry = entries[index]
    const snapshot = entries
    setEntries(prev => prev.filter((_, i) => i !== index))
    try {
      const r = await fetch('/api/log', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entry.id }),
      })
      if (r.status === 401) { redirectToLogin(); return false }
      if (!r.ok) { setEntries(snapshot); return false }
      return true
    } catch {
      setEntries(snapshot)
      return false
    }
  }, [entries])

  const copyPreviousDay = useCallback(async (): Promise<number> => {
    try {
      const r = await fetch('/api/log/copy-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetDate: logDate }),
      })
      if (r.status === 401) { redirectToLogin(); return 0 }
      const d = await r.json()
      if (d.success && d.count > 0) {
        const fresh = await loadEntries(logDate)
        setEntries(fresh)
        setRecents(prev => {
          const copiedNames = new Set(fresh.map(e => `${e.category}|${e.foodName}`))
          const merged = foods.filter(f => copiedNames.has(`${f.category}|${f.name}`))
          const next = [...merged, ...prev.filter(f => !copiedNames.has(`${f.category}|${f.name}`))]
          return next.slice(0, 8)
        })
      }
      return d.count ?? 0
    } catch {
      return 0
    }
  }, [logDate, loadEntries, foods])

  const changeDate = useCallback((days: number) => {
    setLogDate(addDays(logDate, days))
  }, [logDate])

  const handleAmountInputChange = useCallback((index: number, value: string) => {
    setEntries(prev => prev.map((e, i) => (i === index ? { ...e, amountInput: value } : e)))
  }, [])

  const totals = calculateTotals(foods, entries)

  return {
    foods, loading, entriesLoading, entries, logDate, goals, error, totals,
    recents, recentsLoading,
    setLogDate, setGoals, setError,
    createEntry, updateEntry, deleteEntry, copyPreviousDay, reloadEntries, reloadFoods,
    changeDate, handleAmountInputChange, changeMeal,
  }
}
