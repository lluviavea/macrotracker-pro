import { describe, it, expect } from 'vitest'
import {
  parseISODate,
  formatISODate,
  isSameDay,
  addDays,
  getCalendarDays,
  getMonthName,
  getWeekdayNames,
} from '../calendar'

describe('parseISODate', () => {
  it('parses YYYY-MM-DD without timezone shift', () => {
    const d = parseISODate('2026-06-15')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(5) // June is month 5 (0-indexed)
    expect(d.getDate()).toBe(15)
  })
})

describe('formatISODate', () => {
  it('pads month and day with zeros', () => {
    expect(formatISODate(2026, 0, 5)).toBe('2026-01-05')
    expect(formatISODate(2026, 11, 31)).toBe('2026-12-31')
  })
})

describe('isSameDay', () => {
  it('returns true for same calendar day', () => {
    expect(isSameDay(new Date(2026, 5, 15), new Date(2026, 5, 15))).toBe(true)
  })

  it('returns false for different days', () => {
    expect(isSameDay(new Date(2026, 5, 15), new Date(2026, 5, 16))).toBe(false)
  })
})

describe('addDays', () => {
  it('adds days across month boundaries', () => {
    expect(addDays('2026-06-15', 1)).toBe('2026-06-16')
    expect(addDays('2026-06-30', 1)).toBe('2026-07-01')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('handles leap years', () => {
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29')
    expect(addDays('2024-02-29', 1)).toBe('2024-03-01')
  })
})

describe('getCalendarDays', () => {
  it('returns a 6-week grid for June 2026', () => {
    const days = getCalendarDays(2026, 5, '2026-06-15')
    expect(days).toHaveLength(42)
  })

  it('marks current month days correctly', () => {
    const days = getCalendarDays(2026, 5, '2026-06-15')
    const currentMonthDays = days.filter(d => d.isCurrentMonth)
    expect(currentMonthDays).toHaveLength(30)
    expect(currentMonthDays[0].day).toBe(1)
    expect(currentMonthDays.at(-1)?.day).toBe(30)
  })

  it('marks today correctly', () => {
    const days = getCalendarDays(2026, 5, '2026-06-15')
    const today = days.find(d => d.date === '2026-06-15')
    expect(today?.isToday).toBe(true)
  })

  it('handles month boundaries across years', () => {
    const days = getCalendarDays(2025, 11, '2025-12-31')
    const currentMonthDays = days.filter(d => d.isCurrentMonth)
    expect(currentMonthDays).toHaveLength(31)
    expect(days.some(d => d.date === '2026-01-01' && !d.isCurrentMonth)).toBe(true)
  })
})

describe('getMonthName', () => {
  it('formats month and year for locale', () => {
    expect(getMonthName('en-US', 2026, 5)).toContain('June')
    expect(getMonthName('es-ES', 2026, 5)).toContain('junio')
  })
})

describe('getWeekdayNames', () => {
  it('returns 7 narrow weekday names', () => {
    const names = getWeekdayNames('en-US')
    expect(names).toHaveLength(7)
    expect(names[0]).toMatch(/^[SMTWF]$/i)
  })
})
