export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
}

export function parseISODate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatISODate(year: number, month: number, day: number): string {
  const d = new Date(year, month, day)
  const y = String(d.getFullYear()).padStart(4, '0')
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const da = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${da}`
}

export function addDays(date: string, days: number): string {
  const d = parseISODate(date)
  d.setDate(d.getDate() + days)
  return formatISODate(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getLocalISODate(d = new Date()): string {
  return formatISODate(d.getFullYear(), d.getMonth(), d.getDate())
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function getCalendarDays(year: number, month: number, today: string): CalendarDay[] {
  const todayDate = parseISODate(today)
  const firstDayOfMonth = new Date(year, month, 1)
  const startDayOfWeek = firstDayOfMonth.getDay()

  const days: CalendarDay[] = []

  // Previous month filler days
  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDate - i
    const date = formatISODate(year, month - 1, day)
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(parseISODate(date), todayDate),
    })
  }

  // Current month days
  const currentMonthLastDate = new Date(year, month + 1, 0).getDate()
  for (let day = 1; day <= currentMonthLastDate; day++) {
    const date = formatISODate(year, month, day)
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isSameDay(parseISODate(date), todayDate),
    })
  }

  // Next month filler days to complete the last week
  const remainingCells = 42 - days.length
  for (let day = 1; day <= remainingCells; day++) {
    const date = formatISODate(year, month + 1, day)
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isSameDay(parseISODate(date), todayDate),
    })
  }

  return days
}

export function getMonthName(locale: string, year: number, month: number): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(
    new Date(year, month)
  )
}

export function getWeekdayNames(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
  return Array.from({ length: 7 }, (_, i) =>
    formatter.format(new Date(2024, 0, 7 + i))
  )
}
