'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine,
  PieChart, Pie,
} from 'recharts'
import type { Goals } from '@/lib/goals'
import { useFocusTrap } from '@/lib/useFocusTrap'
import { getLocalISODate } from '@/lib/calendar'

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

const MACRO_COLORS = {
  protein: '#b52e56',
  fat: '#c98a2e',
  carbs: '#4caf50',
}



const MACRO_CALORIES_PER_GRAM = { protein: 4, fat: 9, carbs: 4 }

function GoalRing({ value, goal, label, unit, colorClass }: {
  value: number
  goal: number
  label: string
  unit: string
  colorClass: string
}) {
  const pct = goal > 0 ? Math.min((value / goal) * 100, 150) : 0
  const radius = 32
  const circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ
  const overGoal = pct > 100

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={radius} fill="none" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={radius} fill="none"
          className={overGoal ? 'stroke-red-500' : colorClass}
          style={{ strokeDasharray: circ, strokeDashoffset: offset, transform: 'rotate(-90deg)', transformOrigin: '40px 40px', transition: 'stroke-dashoffset 0.6s ease' }}
          strokeWidth="6" strokeLinecap="round"
        />
        <text x="40" y="36" textAnchor="middle" className="fill-current dark:text-gray-200" fontSize="14" fontWeight="700">
          {goal > 0 ? Math.round(pct) : 0}%
        </text>
        <text x="40" y="50" textAnchor="middle" className="fill-gray-400" fontSize="9">
          {Math.round(value)}{unit}
        </text>
      </svg>
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      {goal > 0 && (
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{Math.round(value)}/{Math.round(goal)}{unit}</span>
      )}
    </div>
  )
}

export function WeeklySummaryModal({ currentDate, goals, onClose }: WeeklySummaryModalProps) {
  const t = useTranslations('WeeklySummary')
  const locale = useLocale()
  const [weekOffset, setWeekOffset] = useState(0)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const trapRef = useFocusTrap(true)

  const { monday, sunday } = useMemo(() => getWeekBounds(currentDate, weekOffset), [currentDate, weekOffset])
  const startStr = getLocalISODate(monday)
  const endStr = getLocalISODate(sunday)

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
      totals[getLocalISODate(current)] = { calories: 0, protein: 0, fat: 0, carbs: 0 }
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
    const daysWithEntries = Object.values(dailyTotals).filter(d => d.calories > 0)
    const n = daysWithEntries.length || 1
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
      protein: Math.round((total.protein / n) * 10) / 10,
      fat: Math.round((total.fat / n) * 10) / 10,
      carbs: Math.round((total.carbs / n) * 10) / 10,
      calories: Math.round(total.calories / n),
    }
  }, [entries, dailyTotals])

  const days = useMemo(() => {
    const result = []
    const current = new Date(monday)
    for (let i = 0; i < 7; i++) {
      result.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return result
  }, [monday])

  const calorieGoal = goals.calories || 0
  const letters = DAY_LETTERS[locale] ?? DAY_LETTERS.es

  const barData = useMemo(() =>
    days.map((day, i) => {
      const key = getLocalISODate(day)
      const d = dailyTotals[key] || { calories: 0, protein: 0, fat: 0, carbs: 0 }
      return {
        name: letters[i],
        protein: Math.round(d.protein),
        fat: Math.round(d.fat),
        carbs: Math.round(d.carbs),
        calories: d.calories,
        isToday: key === currentDate,
      }
    }),
  [days, dailyTotals, letters, currentDate])

  const macroDistribution = useMemo(() => {
    const proteinCalories = averages.protein * MACRO_CALORIES_PER_GRAM.protein
    const fatCalories = averages.fat * MACRO_CALORIES_PER_GRAM.fat
    const carbsCalories = averages.carbs * MACRO_CALORIES_PER_GRAM.carbs
    const total = proteinCalories + fatCalories + carbsCalories
    if (total === 0) return { data: [], totalCalories: 0, proteinPct: 0, fatPct: 0, carbsPct: 0 }
    return {
      data: [
        { name: t('avgProtein'), value: Math.round(proteinCalories), gramValue: averages.protein, color: MACRO_COLORS.protein },
        { name: t('avgFat'), value: Math.round(fatCalories), gramValue: averages.fat, color: MACRO_COLORS.fat },
        { name: t('avgCarbs'), value: Math.round(carbsCalories), gramValue: averages.carbs, color: MACRO_COLORS.carbs },
      ],
      totalCalories: Math.round(averages.calories),
      proteinPct: Math.round((proteinCalories / total) * 100),
      fatPct: Math.round((fatCalories / total) * 100),
      carbsPct: Math.round((carbsCalories / total) * 100),
    }
  }, [averages, t])

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
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('empty')}</p>
            </div>
          ) : (
            <>
              {/* Stacked bar chart: macros per day */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('macrosByDay')}</h3>
                <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={barData} barCategoryGap="20%" margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, className: 'fill-gray-500 dark:fill-gray-400' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, className: 'fill-gray-400 dark:fill-gray-500' }}
                        width={40}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-background)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.75rem',
                          fontSize: '0.75rem',
                        }}
                        itemStyle={{ padding: '2px 0' }}
                        formatter={(value: unknown, name: unknown) => {
                          const labels: Record<string, string> = {
                            protein: t('avgProtein'),
                            fat: t('avgFat'),
                            carbs: t('avgCarbs'),
                          }
                          return [`${value}g`, labels[String(name)] || String(name)]
                        }}
                      />
                      {calorieGoal > 0 && (
                        <ReferenceLine y={calorieGoal} stroke="#9a9cea" strokeDasharray="4 4" strokeWidth={1.5} />
                      )}
                      <Bar dataKey="protein" stackId="macros" radius={[0, 0, 0, 0]}>
                        {barData.map((entry) => (
                          <Cell key={entry.name} fill={entry.isToday ? MACRO_COLORS.protein : '#d4a0b0'} />
                        ))}
                      </Bar>
                      <Bar dataKey="fat" stackId="macros" radius={[0, 0, 0, 0]}>
                        {barData.map((entry) => (
                          <Cell key={entry.name} fill={entry.isToday ? MACRO_COLORS.fat : '#e0c9a0'} />
                        ))}
                      </Bar>
                      <Bar dataKey="carbs" stackId="macros" radius={[4, 4, 0, 0]}>
                        {barData.map((entry) => (
                          <Cell key={entry.name} fill={entry.isToday ? MACRO_COLORS.carbs : '#a8d5a8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {calorieGoal > 0 && (
                    <div className="flex items-center gap-2 mt-1 px-2">
                      <div className="w-4 h-0 border-t-2 border-dashed" style={{ borderColor: '#9a9cea' }} />
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('calorieGoalLine')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Donut chart: macro distribution */}
              {macroDistribution.data.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('macroSplit')}</h3>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <ResponsiveContainer width={140} height={140}>
                        <PieChart>
                          <Pie
                            data={macroDistribution.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={65}
                            dataKey="value"
                            stroke="none"
                            paddingAngle={2}
                          >
                            {macroDistribution.data.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="text-center">
                        <p className="text-2xl font-bold dark:text-gray-100">{macroDistribution.totalCalories}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('avgCalories')}</p>
                      </div>
                      <div className="space-y-1.5">
                        {macroDistribution.data.map((entry) => (
                          <div key={entry.name} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs text-gray-600 dark:text-gray-300 flex-1">{entry.name}</span>
                            <span className="text-xs font-medium dark:text-gray-200">{entry.gramValue}g</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 w-8 text-right">
                              {Math.round((entry.value / (macroDistribution.totalCalories || 1)) * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Goal progress rings */}
              {averages.calories > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('vsGoals')}</h3>
                  <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-around">
                    <GoalRing
                      value={averages.calories}
                      goal={goals.calories}
                      label={t('avgCalories')}
                      unit=""
                      colorClass="stroke-[var(--macro-calories)]"
                    />
                    <GoalRing
                      value={averages.protein}
                      goal={goals.protein}
                      label={t('avgProtein')}
                      unit="g"
                      colorClass="stroke-[var(--macro-protein)]"
                    />
                    <GoalRing
                      value={averages.fat}
                      goal={goals.fat}
                      label={t('avgFat')}
                      unit="g"
                      colorClass="stroke-[var(--macro-fat)]"
                    />
                    <GoalRing
                      value={averages.carbs}
                      goal={goals.carbs}
                      label={t('avgCarbs')}
                      unit="g"
                      colorClass="stroke-[var(--macro-carbs)]"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
