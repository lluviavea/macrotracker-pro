'use client'

import { forwardRef } from 'react'
import { useTranslations } from 'next-intl'

interface FoodSearchProps {
  value: string
  onChange: (value: string) => void
}

export const FoodSearch = forwardRef<HTMLInputElement, FoodSearchProps>(function FoodSearch({ value, onChange }, ref) {
  const t = useTranslations('FoodSearch')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      e.preventDefault()
      onChange('')
    }
  }

  return (
    <div className="relative animate-slide-up">
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('placeholder')}
        aria-label={t('placeholder')}
        className="w-full px-4 py-2 pr-9 rounded-xl border border-gray-200 dark:border-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg leading-none"
          aria-label={t('clear')}
        >
          &times;
        </button>
      )}
    </div>
  )
})
