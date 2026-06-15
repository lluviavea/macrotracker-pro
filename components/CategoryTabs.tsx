'use client'

import { useTranslations } from 'next-intl'
import type { FoodCategory } from '@/lib/types'

const CATEGORIES: { key: FoodCategory; color: string }[] = [
  { key: 'proteina', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' },
  { key: 'carbohidratos', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800' },
  { key: 'grasas', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' },
  { key: 'frutas', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' },
  { key: 'verduras', color: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' },
  { key: 'condimentos', color: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' },
  { key: 'suplementos', color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' },
]

interface CategoryTabsProps {
  selected: FoodCategory
  onSelect: (category: FoodCategory) => void
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  const t = useTranslations('CategoryTabs')

  return (
    <div className="sticky top-0 z-20 -mx-4 px-4 py-2 flex gap-2 overflow-x-auto bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-sm">
      {CATEGORIES.map(c => (
        <button
          key={c.key}
          onClick={() => onSelect(c.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${selected === c.key ? c.color : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500'}`}
        >
          {t(c.key)}
        </button>
      ))}
    </div>
  )
}
