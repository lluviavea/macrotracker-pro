'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Calendar } from './Calendar'
import { formatISODate, parseISODate } from '@/lib/calendar'

interface DateNavigatorProps {
  date: string
  onDateChange: (date: string) => void
  onPrevDay: () => void
  onNextDay: () => void
  onToday?: () => void
}

function formatDisplayDate(locale: string, date: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(parseISODate(date))
}

function getTodayString(): string {
  const d = new Date()
  return formatISODate(d.getFullYear(), d.getMonth(), d.getDate())
}

export function DateNavigator({ date, onDateChange, onPrevDay, onNextDay, onToday }: DateNavigatorProps) {
  const t = useTranslations('DateNavigator')
  const locale = useLocale()
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const today = getTodayString()
  const isToday = date === today

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (selected: string) => {
    onDateChange(selected)
    setIsOpen(false)
  }

  const handleToday = () => {
    onToday?.()
    setIsOpen(false)
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      <button
        onClick={onPrevDay}
        className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        aria-label={t('prevDay')}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(open => !open)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className={`
            flex items-center gap-2 min-w-[12rem] sm:min-w-[14rem] justify-center
            text-base sm:text-lg text-center border rounded-xl px-4 py-2.5
            focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100
            transition-shadow
            ${isToday
              ? 'border-blue-400 dark:border-blue-600 bg-blue-50/60 dark:bg-blue-900/25 font-semibold shadow-sm shadow-blue-100 dark:shadow-none'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:ring-black/10 dark:focus:ring-white/20'}
          `}
        >
          <span>{formatDisplayDate(locale, date)}</span>
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {isToday && (
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold border border-white dark:border-gray-800 whitespace-nowrap">
            {t('today')}
          </span>
        )}

        {isOpen && (
          <div
            ref={popoverRef}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50"
          >
            <Calendar
              value={date}
              today={today}
              onChange={handleSelect}
              onClose={() => setIsOpen(false)}
            />
          </div>
        )}
      </div>

      <button
        onClick={onNextDay}
        className="p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
        aria-label={t('nextDay')}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {!isToday && (
        <button
          onClick={handleToday}
          className="text-sm px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium transition-colors"
        >
          {t('today')}
        </button>
      )}
    </div>
  )
}
