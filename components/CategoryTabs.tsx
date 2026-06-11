'use client'

import type { FoodCategory } from '@/lib/types'

const CATEGORIES: { key: FoodCategory; label: string; color: string }[] = [
  { key: 'proteina', label: 'Proteína', color: 'bg-red-100 text-red-800 border-red-200' },
  { key: 'carbohidratos', label: 'Carbohidratos', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { key: 'grasas', label: 'Grasas', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { key: 'frutas', label: 'Frutas', color: 'bg-green-100 text-green-800 border-green-200' },
  { key: 'verduras', label: 'Verduras', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { key: 'condimentos', label: 'Condimentos', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { key: 'suplementos', label: 'Suplementos', color: 'bg-blue-100 text-blue-800 border-blue-200' },
]

interface CategoryTabsProps {
  selected: FoodCategory
  onSelect: (category: FoodCategory) => void
}

export function CategoryTabs({ selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map(c => (
        <button
          key={c.key}
          onClick={() => onSelect(c.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-colors ${selected === c.key ? c.color : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
        >
          {c.label}
        </button>
      ))}
    </div>
  )
}
