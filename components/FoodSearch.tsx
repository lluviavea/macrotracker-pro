'use client'

import { useTranslations } from 'next-intl'

interface FoodSearchProps {
  value: string
  onChange: (value: string) => void
}

export function FoodSearch({ value, onChange }: FoodSearchProps) {
  const t = useTranslations('FoodSearch')

  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={t('placeholder')}
      className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 animate-slide-up"
    />
  )
}
