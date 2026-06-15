'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'

interface DateNavigatorProps {
  date: string
  onDateChange: (date: string) => void
  onPrevDay: () => void
  onNextDay: () => void
  onToday?: () => void
}

export function DateNavigator({ date, onDateChange, onPrevDay, onNextDay, onToday }: DateNavigatorProps) {
  const t = useTranslations('DateNavigator')
  const inputRef = useRef<HTMLInputElement>(null)
  const isToday = date === new Date().toISOString().slice(0, 10)

  const openPicker = () => {
    try {
      inputRef.current?.showPicker?.()
    } catch {
      inputRef.current?.focus()
    }
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
        <input
          ref={inputRef}
          type="date"
          value={date}
          onChange={e => onDateChange(e.target.value)}
          className={`min-w-[11rem] sm:min-w-[13rem] text-base sm:text-lg text-center border rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-gray-100 transition-shadow ${isToday ? 'border-blue-400 dark:border-blue-600 bg-blue-50/60 dark:bg-blue-900/25 font-semibold shadow-sm shadow-blue-100 dark:shadow-none' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:ring-black/10 dark:focus:ring-white/20'}`}
        />
        <button
          type="button"
          onClick={openPicker}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label={t('openCalendar')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        {isToday && (
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold border border-white dark:border-gray-800 whitespace-nowrap">
            {t('today')}
          </span>
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
          onClick={onToday}
          className="text-sm px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium transition-colors"
        >
          {t('today')}
        </button>
      )}
    </div>
  )
}
