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
    { label: t('calories'), value: Math.round(calories), unit: t('kcal'), goal: goals?.calories, color: 'macro-calories', barColor: 'bg-macro-calories' },
    { label: t('protein'), value: Math.round(protein * 10) / 10, unit: t('g'), goal: goals?.protein, color: 'macro-protein', barColor: 'bg-macro-protein' },
    { label: t('fat'), value: Math.round(fat * 10) / 10, unit: t('g'), goal: goals?.fat, color: 'macro-fat', barColor: 'bg-macro-fat' },
    { label: t('carbs'), value: Math.round(carbs * 10) / 10, unit: t('g'), goal: goals?.carbs, color: 'macro-carbs', barColor: 'bg-macro-carbs' },
    { label: t('sugar'), value: sugar !== undefined ? Math.round(sugar * 10) / 10 : 0, unit: t('g'), color: 'macro-sugar', barColor: 'bg-macro-sugar' },
    { label: t('fiber'), value: fiber !== undefined ? Math.round(fiber * 10) / 10 : 0, unit: t('g'), color: 'macro-fiber', barColor: 'bg-macro-fiber' },
  ]

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {items.map(s => {
        const rawPct = s.goal && s.goal > 0 ? Math.round((s.value / s.goal) * 100) : 0
        const pct = Math.min(100, rawPct)
        const barColor = rawPct > 100 ? 'bg-red-500' : rawPct === 100 ? 'bg-green-500' : s.barColor
        return (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 text-center shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{s.unit}</p>
            {s.goal && s.goal > 0 && (
              <div className="mt-2">
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${barColor}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{rawPct}% &middot; {s.goal}{s.unit}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
