'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { lookupNutritionMatches } from '@/lib/nutrition-utils'
import type { NutritionEntry } from '@/lib/nutrition'
import type { NutritionHint } from '@/lib/nutrition-utils'

export interface FoodSuggestion extends NutritionHint {
  name: string
}

interface FoodAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (suggestion: FoodSuggestion) => void
  onBlur?: () => void
  placeholder?: string
}

function entryToSuggestion(entry: NutritionEntry): FoodSuggestion {
  return {
    name: entry.matches[0],
    nameEn: entry.nameEn,
    protein: entry.protein,
    fat: entry.fat,
    carbs: entry.carbs,
    sugar: entry.sugar ?? 0,
    fiber: entry.fiber ?? 0,
    calories: entry.calories,
    measureType: entry.measureType,
    unitName: entry.unitName ?? null,
    unitGrams: entry.unitGrams ?? null,
    preparation: entry.preparation ?? null,
  }
}

export function FoodAutocomplete({ value, onChange, onSelect, onBlur, placeholder }: FoodAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestions = value.trim().length > 0 ? lookupNutritionMatches(value, 5).map(entryToSuggestion) : []

  const close = useCallback(() => {
    setIsOpen(false)
    setHighlightedIndex(0)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        close()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, close])

  function handleSelect(suggestion: FoodSuggestion) {
    onSelect(suggestion)
    close()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(i => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(i => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(suggestions[highlightedIndex])
    } else if (e.key === 'Escape') {
      close()
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setHighlightedIndex(0)
          setIsOpen(true)
        }}
        onFocus={() => value.trim().length > 0 && setIsOpen(true)}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 dark:bg-gray-800 dark:text-gray-100"
      />

      {isOpen && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion.name}
              role="option"
              aria-selected={index === highlightedIndex}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`cursor-pointer px-3 py-2 text-sm ${
                index === highlightedIndex
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium dark:text-gray-100">{suggestion.name}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{suggestion.nameEn}</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {suggestion.protein}P · {suggestion.fat}F · {suggestion.carbs}C · {suggestion.calories} kcal
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
