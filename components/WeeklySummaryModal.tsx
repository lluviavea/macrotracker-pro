'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { Goals } from '@/lib/goals'
import { useFocusTrap } from '@/lib/useFocusTrap'

interface Entry {
  id: number
  date: string
  protein: number
  fat: number
  carbs: number
  sugar: number
  fiber: number
  calories: number
}

interface WeeklySummaryModalProps {
  currentDate: string
  goals: Goals
  onClose: () => void
}

function formatISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function getWeekBounds(anchor: string, offsetWeeks: number) {
  const base = new Date(anchor + 'T00:00:00')
  const day = base.getDay()
  const mondayDate = base.getDate() - day + (day === 0 ? -6 : 1) + offsetWeeks * 7
  const monday = new Date(base.setDate(mondayDate))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return { monday, sunday }
}

function formatRange(locale: string, start: Date, end: Date): string {
  const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })
  return `${formatter.format(start)} - ${formatter.format(end)}`
}

const DAY_LETTERS: Record<string, string[]> = {
  en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
  es: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
}

export function WeeklySummaryModal({ currentDate, goals, onClose }: WeeklySummaryModalProps) {
  const t = useTranslations('WeeklySummary')
  const locale = useLocale()
  const [weekOffset, setWeekOffset] = useState(0)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const trapRef = useFocusTrap(true)

  const { monday, sunday } = useMemo(() => getWeekBounds(currentDate, weekOffset), [currentDate, weekOffset])
  const startStr = formatISODate(monday)
  const endStr = formatISODate(sunday)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    let cancelled = false
    fetch(`/api/log/range?start=${startStr}&end=${endStr}`)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) {
          setEntries(data.entries || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEntries([])
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [startStr, endStr])

  const dailyTotals = useMemo(() => {
    const totals: Record<string, { calories: number; protein: number; fat: number; carbs: number }> = {}
    const current = new Date(monday)
    for (let i = 0; i < 7; i++) {
      totals[formatISODate(current)] = { calories: 0, protein: 0, fat: 0, carbs: 0 }
      current.setDate(current.getDate() + 1)
    }
    for (const entry of entries) {
      const day = entry.date
      if (!totals[day]) totals[day] = { calories: 0, protein: 0, fat: 0, carbs: 0 }
      totals[day].calories += entry.calories
      totals[day].protein += entry.protein
      totals[day].fat += entry.fat
      totals[day].carbs += entry.carbs
    }
    return totals
  }, [entries, monday])

  const averages = useMemo(() => {
    const total = entries.reduce(
      (acc, e) => {
        acc.protein += e.protein
        acc.fat += e.fat
        acc.carbs += e.carbs
        acc.calories += e.calories
        return acc
      },
      { protein: 0, fat: 0, carbs: 0, calories: 0 },
    )
    return {
      protein: Math.round((total.protein / 7) * 10) / 10,
      fat: Math.round((total.fat / 7) * 10) / 10,
      carbs: Math.round((total.carbs / 7) * 10) / 10,
      calories: Math.round(total.calories / 7),
    }
  }, [entries])

  const days = useMemo(() => {
    const result = []
    const current = new Date(monday)
    for (let i = 0; i < 7; i++) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return result
  }, [monday])

  const maxCalories = Math.max(goals.calories || 1, ...Object.values(dailyTotals).map(d => d.calories), 1)
  const calorieGoal = goals.calories || 0
  const letters = DAY_LETTERS[locale] ?? DAY_LETTERS.es

  return (
    <div
      ref={trapRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="weekly-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 id="weekly-title" className="text-lg font-semibold dark:text-gray-100">{t('title')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatRange(locale, monday, sunday)}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setLoading(true); setWeekOffset(o => o - 1) }}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('prevWeek')}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => { setLoading(true); setWeekOffset(0) }}
              className="text-sm px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {t('thisWeek')}
            </button>
            <button
              onClick={() => { setLoading(true); setWeekOffset(o => o + 1) }}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={t('nextWeek')}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 text-2xl leading-none"
              aria-label={t('close')}
            >
              &times;
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {calorieGoal > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('calorieGoal', { goal: calorieGoal })}
            </p>
          )}

          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('empty')}</p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">{t('caloriesByDay')}</h3>
                <div className="flex items-end justify-between gap-2 h-48">
                  {days.map((day, i) => {
                    const key = formatISODate(day)
                    const total = dailyTotals[key]?.calories || 0
                    const height = Math.round((total / maxCalories) * 100)
                    const isToday = key === currentDate
                    return (
                      <div key={key} className="flex-1 flex flex-col items-center gap-1.5">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400">{total}</span>
                        <div className="w-full flex items-end justify-center">
                          <div
                            className={`w-full max-w-[2.5rem] rounded-t-lg transition-all duration-500 ${
                              isToday
                                ? 'bg-macro-calories'
                                : 'bg-gray-200 dark:bg-gray-800'
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-500">{letters[i]}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('avgProtein')}</p>
                  <p className="text-xl font-bold macro-protein">{averages.protein}g</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('avgFat')}</p>
                  <p className="text-xl font-bold macro-fat">{averages.fat}g</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('avgCarbs')}</p>
                  <p className="text-xl font-bold macro-carbs">{averages.carbs}g</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('avgCalories')}</p>
                  <p className="text-xl font-bold macro-calories">{averages.calories}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
