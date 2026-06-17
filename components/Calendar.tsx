'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  getCalendarDays,
  getWeekdayNames,
  parseISODate,
} from '@/lib/calendar'

interface CalendarProps {
  value: string
  today: string
  onChange: (date: string) => void
  onClose?: () => void
}

const MONTHS = Array.from({ length: 12 }, (_, i) => i)
const YEAR_RANGE = 10

export function Calendar({ value, today, onChange, onClose }: CalendarProps) {
  const t = useTranslations('Calendar')
  const locale = useLocale()
  const selectedDate = parseISODate(value)

  const [viewDate, setViewDate] = useState(selectedDate)
  const viewYear = viewDate.getFullYear()
  const viewMonth = viewDate.getMonth()

  const days = useMemo(
    () => getCalendarDays(viewYear, viewMonth, today),
    [viewYear, viewMonth, today]
  )
  const weekdayNames = useMemo(() => getWeekdayNames(locale), [locale])

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear()
    return Array.from({ length: YEAR_RANGE * 2 + 1 }, (_, i) => currentYear - YEAR_RANGE + i)
  }, [])

  const handleSelect = (date: string) => {
    onChange(date)
    onClose?.()
  }

  const handlePrevMonth = () => setViewDate(new Date(viewYear, viewMonth - 1))
  const handleNextMonth = () => setViewDate(new Date(viewYear, viewMonth + 1))

  return (
    <div
      role="dialog"
      aria-label={t('calendarDialog')}
      className="w-[18rem] sm:w-[20rem] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={t('prevMonth')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-1.5">
          <select
            value={viewMonth}
            onChange={e => setViewDate(new Date(viewYear, Number(e.target.value)))}
            aria-label={t('selectMonth')}
            className="text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none rounded-lg py-1 pl-2 pr-6 focus:ring-2 focus:ring-blue-500/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {MONTHS.map(m => (
              <option key={m} value={m}>
                {new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, m))}
              </option>
            ))}
          </select>
          <select
            value={viewYear}
            onChange={e => setViewDate(new Date(Number(e.target.value), viewMonth))}
            aria-label={t('selectYear')}
            className="text-sm font-semibold bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none rounded-lg py-1 pl-2 pr-6 focus:ring-2 focus:ring-blue-500/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          aria-label={t('nextMonth')}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdayNames.map(name => (
          <div
            key={name}
            className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 py-1"
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(({ date, day, isCurrentMonth, isToday }) => {
          const isSelected = date === value
          return (
            <button
              key={date}
              type="button"
              onClick={() => handleSelect(date)}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-full transition-colors
                ${isSelected
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : isToday
                    ? 'border border-blue-500 text-blue-600 dark:text-blue-400 font-semibold'
                    : isCurrentMonth
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-gray-300 dark:text-gray-600'}
              `}
              aria-label={date}
              aria-pressed={isSelected}
            >
              {day}
            </button>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-center">
        <button
          type="button"
          onClick={() => handleSelect(today)}
          className="text-sm px-4 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
        >
          {t('today')}
        </button>
      </div>
    </div>
  )
}
