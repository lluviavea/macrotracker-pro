'use client'

import { useTranslations } from 'next-intl'

interface Goals {
  calories: number
  protein: number
  fat: number
  carbs: number
}

interface MacroSummaryProps {
  calories: number
  protein: number
  fat: number
  carbs: number
  sugar?: number
  fiber?: number
  goals?: Goals
}

export function MacroSummary({ calories, protein, fat, carbs, sugar, fiber, goals }: MacroSummaryProps) {
  const t = useTranslations('MacroSummary')

  const items = [
    { label: t('calories'), value: Math.round(calories), unit: t('kcal'), goal: goals?.calories, color: 'text-gray-900', barColor: 'bg-gray-800' },
    { label: t('protein'), value: Math.round(protein * 10) / 10, unit: t('g'), goal: goals?.protein, color: 'text-red-600', barColor: 'bg-red-500' },
    { label: t('fat'), value: Math.round(fat * 10) / 10, unit: t('g'), goal: goals?.fat, color: 'text-orange-600', barColor: 'bg-orange-500' },
    { label: t('carbs'), value: Math.round(carbs * 10) / 10, unit: t('g'), goal: goals?.carbs, color: 'text-yellow-600', barColor: 'bg-yellow-500' },
    { label: t('sugar'), value: sugar !== undefined ? Math.round(sugar * 10) / 10 : 0, unit: t('g'), color: 'text-pink-600', barColor: 'bg-pink-400' },
    { label: t('fiber'), value: fiber !== undefined ? Math.round(fiber * 10) / 10 : 0, unit: t('g'), color: 'text-green-600', barColor: 'bg-green-500' },
  ]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {items.map(s => {
        const pct = s.goal && s.goal > 0 ? Math.min(100, Math.round((s.value / s.goal) * 100)) : 0
        return (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{s.unit}</p>
            {s.goal && s.goal > 0 && (
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${pct >= 100 ? 'bg-green-500' : s.barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{pct}% &middot; {s.goal}{s.unit}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
