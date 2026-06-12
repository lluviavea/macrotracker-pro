'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Goals } from '@/lib/goals'
import { saveGoals } from '@/lib/goals'

interface GoalsModalProps {
  goals: Goals
  onSave: (goals: Goals) => void
  onClose: () => void
}

export function GoalsModal({ goals, onSave, onClose }: GoalsModalProps) {
  const t = useTranslations('Home')
  const [editGoals, setEditGoals] = useState<Goals>({ ...goals })

  const fields = ['calories', 'protein', 'fat', 'carbs'] as const
  const labels: Record<string, string> = {
    calories: t('calories'),
    protein: t('protein'),
    fat: t('fat'),
    carbs: t('carbs'),
  }
  const placeholders: Record<string, string> = {
    calories: '2000',
    protein: '100',
    fat: '65',
    carbs: '250',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-5 w-80 mx-4" onClick={e => e.stopPropagation()}>
        <p className="font-medium text-sm mb-4 dark:text-gray-100">{t('goalsTitle')}</p>
        <div className="space-y-3">
          {fields.map(key => (
            <div key={key}>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{labels[key]}</label>
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
                  placeholder={placeholders[key]}
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => { saveGoals(editGoals); onSave(editGoals); onClose() }}
            className="flex-1 bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            {t('save')}
          </button>
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
