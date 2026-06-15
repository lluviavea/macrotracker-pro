'use client'

import { useTranslations } from 'next-intl'
import type { FoodCategory } from '@/lib/types'

const CATEGORIES: { key: FoodCategory; color: string }[] = [
  { key: 'proteina', color: 'cat-proteina' },
  { key: 'carbohidratos', color: 'cat-carbohidratos' },
  { key: 'grasas', color: 'cat-grasas' },
  { key: 'frutas', color: 'cat-frutas' },
  { key: 'verduras', color: 'cat-verduras' },
  { key: 'condimentos', color: 'cat-condimentos' },
  { key: 'suplementos', color: 'cat-suplementos' },
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
