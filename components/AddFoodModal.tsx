'use client'

import { useState, useMemo } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import type { FoodItem } from '@/lib/types'
import { calculateMacros } from '@/lib/macros'

interface AddFoodModalProps {
  food: FoodItem
  onAdd: (food: FoodItem, amount: number, meal: string) => void
  onClose: () => void
}

export function AddFoodModal({ food, onAdd, onClose }: AddFoodModalProps) {
  const locale = useLocale()
  const t = useTranslations('Home')
  const displayName = locale === 'en' && food.nameEn ? food.nameEn : food.name

  const [amount, setAmount] = useState(String(food.measureType === 'unit' ? 1 : 100))
  const [meal, setMeal] = useState('')

  const preview = useMemo(() => {
    const num = parseFloat(amount) || 0
    if (num <= 0) return null
    return calculateMacros(food, num)
  }, [amount, food])

  const mealOptions = [
    { value: '', label: t('noMeal') },
    { value: 'desayuno', label: t('breakfast') },
    { value: 'comida', label: t('lunch') },
    { value: 'cena', label: t('dinner') },
    { value: 'snack', label: t('snack') },
  ]

  const handleConfirm = () => {
    const num = parseFloat(amount) || 0
    if (num <= 0) return
    onAdd(food, num, meal)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/60" onClick={onClose}>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-5 w-72 mx-4" onClick={e => e.stopPropagation()}>
        <p className="font-medium text-sm mb-3 dark:text-gray-100">{t('addModalTitle', { name: displayName })}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleConfirm() }}
            placeholder="0"
            className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 dark:bg-gray-800 dark:text-gray-100"
            autoFocus
            min={0}
            step={food.measureType === 'unit' ? 1 : 10}
          />
          <span className="text-sm text-gray-500 dark:text-gray-400 w-10">
            {food.measureType === 'unit' && food.unitName ? food.unitName : t('gram')}
          </span>
        </div>
        {preview && (
          <div className="mt-3 p-2.5 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-xs text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-1 dark:text-gray-300">{t('previewLabel')}</p>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {preview.protein}P · {preview.fat}F · {preview.carbs}C · {preview.calories}kcal
            </p>
          </div>
        )}
        <div className="mt-3">
          <select
            value={meal}
            onChange={e => setMeal(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 dark:bg-gray-800 dark:text-gray-100"
          >
            {mealOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={handleConfirm} className="flex-1 bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200">
            {t('add')}
          </button>
          <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
