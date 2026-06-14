'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { FoodItem, FoodCategory } from '@/lib/types'
import { useFoodLog } from '@/lib/useFoodLog'
import { DateNavigator } from '@/components/DateNavigator'
import { MacroSummary } from '@/components/MacroSummary'
import { LogEntryList } from '@/components/LogEntryList'
import { CategoryTabs } from '@/components/CategoryTabs'
import { FoodSearch } from '@/components/FoodSearch'
import { FoodGrid } from '@/components/FoodGrid'
import { LangSwitcher } from '@/components/LangSwitcher'
import { AddFoodModal } from '@/components/AddFoodModal'
import { GoalsModal } from '@/components/GoalsModal'
import { ThemeToggle } from '@/components/ThemeToggle'
import { showToast } from '@/components/Toast'

function getDate() {
  return new Date().toISOString().slice(0, 10)
}

interface HomeClientProps {
  user: {
    email: string
    role: 'admin' | 'user'
  }
}

export default function HomeClient({ user }: HomeClientProps) {
  const locale = useLocale()
  const router = useRouter()
  const t = useTranslations('Home')
  const ta = useTranslations('Auth')

  const {
    foods, loading, entries, logDate, goals, hasError, totals,
    setLogDate, setGoals, setHasError,
    createEntry, updateEntry, deleteEntry, reloadEntries,
    changeDate, handleAmountInputChange,
  } = useFoodLog()

  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('proteina')
  const [search, setSearch] = useState('')
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null)
  const [showGoals, setShowGoals] = useState(false)

  const displayName = (name: string, nameEn?: string | null) =>
    locale === 'en' && nameEn ? nameEn : name

  const handleAdd = async (food: FoodItem, amount: number, meal: string) => {
    const ok = await createEntry(food, amount, meal)
    const name = displayName(food.name, food.nameEn)
    if (ok) {
      showToast(t('added', { name }))
    } else {
      showToast(t('addError', { name }), 'error')
      reloadEntries()
    }
    setPendingFood(null)
  }

  const handleRemove = async (index: number) => {
    const entry = entries[index]
    const food = foods.find(f => f.name === entry.foodName && f.category === entry.category)
    const name = displayName(entry.foodName, food?.nameEn)
    const ok = await deleteEntry(index)
    if (ok) {
      showToast(t('removed', { name }), 'warning', food ? {
        label: t('undo'),
        onClick: () => { createEntry(food, Number(entry.amount), entry.meal) },
      } : undefined)
    } else {
      showToast(t('deleteError'), 'error')
    }
  }

  const handleUpdateAmount = async (index: number) => {
    const ok = await updateEntry(index)
    if (!ok) {
      showToast(t('updateError'), 'error')
    }
  }

  const handleSaveGoals = (newGoals: typeof goals) => {
    setGoals(newGoals)
    setShowGoals(false)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push(`/${locale}/login`)
    router.refresh()
  }

  const isSearching = search.trim().length > 0
  const filteredFoods = foods.filter(
    f =>
      (isSearching || f.category === selectedCategory) &&
      (f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.nameEn && f.nameEn.toLowerCase().includes(search.toLowerCase()))),
  )

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded" />
        </div>
        <div className="h-8 w-64 mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-28 bg-gray-200 dark:bg-gray-800 rounded-full" />
          ))}
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-[var(--muted-foreground)] sm:inline">{user.email}</span>
          <ThemeToggle />
          <LangSwitcher />
          <button onClick={() => setShowGoals(true)} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">{t('goals')}</button>
          {user.role === 'admin' && (
            <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">{t('admin')}</Link>
          )}
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">{ta('logout')}</button>
        </div>
      </header>

      {hasError && (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700 dark:text-red-400">{t('loadError')}</p>
          <button onClick={() => setHasError(false)} className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 text-lg leading-none shrink-0 ml-3">&times;</button>
        </div>
      )}

      <DateNavigator
        date={logDate}
        onDateChange={setLogDate}
        onPrevDay={() => changeDate(-1)}
        onNextDay={() => changeDate(1)}
        onToday={() => setLogDate(getDate())}
      />

      <MacroSummary
        calories={totals.calories}
        protein={totals.protein}
        fat={totals.fat}
        carbs={totals.carbs}
        sugar={totals.sugar}
        fiber={totals.fiber}
        goals={goals}
      />

      <LogEntryList
        entries={entries}
        foods={foods}
        onRemove={handleRemove}
        onAmountInputChange={handleAmountInputChange}
        onAmountBlur={handleUpdateAmount}
      />

      <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />

      <FoodSearch value={search} onChange={setSearch} />

      <FoodGrid foods={filteredFoods} onAdd={setPendingFood} showCategory={isSearching} />

      {pendingFood && (
        <AddFoodModal
          food={pendingFood}
          onAdd={handleAdd}
          onClose={() => setPendingFood(null)}
        />
      )}

      {showGoals && (
        <GoalsModal
          goals={goals}
          onSave={handleSaveGoals}
          onClose={() => setShowGoals(false)}
        />
      )}
    </div>
  )
}
