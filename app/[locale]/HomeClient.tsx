'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
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
import { RecentFoods } from '@/components/RecentFoods'
import { FavoriteFoods } from '@/components/FavoriteFoods'
import { CopyPreviousDay } from '@/components/CopyPreviousDay'
import { LangSwitcher } from '@/components/LangSwitcher'
import { AddFoodModal } from '@/components/AddFoodModal'
import { GoalsModal } from '@/components/GoalsModal'
import { WeeklySummaryModal } from '@/components/WeeklySummaryModal'
import { ThemeToggle } from '@/components/ThemeToggle'
import { showToast } from '@/components/Toast'
import { getLocalISODate } from '@/lib/calendar'
import { saveLastMeal } from '@/lib/last-meal'
import { getFavorites, toggleFavorite, type FavoriteRef } from '@/lib/favorites'

function getDate() {
  return getLocalISODate()
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
    foods, loading, entriesLoading, entries, logDate, goals, error, totals,
    recents, recentsLoading,
    setLogDate, setGoals, setError,
    createEntry, updateEntry, deleteEntry, copyPreviousDay, reloadEntries, reloadFoods,
    changeDate, handleAmountInputChange, changeMeal,
  } = useFoodLog()

  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('proteina')
  const [search, setSearch] = useState('')
  const [pendingFood, setPendingFood] = useState<FoodItem | null>(null)
  const [showGoals, setShowGoals] = useState(false)
  const [showWeekly, setShowWeekly] = useState(false)
  const [copying, setCopying] = useState(false)
  const [favorites, setFavorites] = useState<FavoriteRef[]>(getFavorites)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const displayName = (name: string, nameEn?: string | null) =>
    locale === 'en' && nameEn ? nameEn : name

  const handleAdd = async (food: FoodItem, amount: number, meal: string) => {
    const ok = await createEntry(food, amount, meal)
    const name = displayName(food.name, food.nameEn)
    if (ok) {
      saveLastMeal(food.category, food.name, meal)
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

  const handleMealChange = async (index: number, meal: string) => {
    const ok = await changeMeal(index, meal)
    if (!ok) {
      showToast(t('updateError'), 'error')
    }
  }

  const handleSaveGoals = (newGoals: typeof goals) => {
    setGoals(newGoals)
    setShowGoals(false)
  }

  const handleCopyPreviousDay = async () => {
    setCopying(true)
    const count = await copyPreviousDay()
    setCopying(false)
    if (count > 0) {
      showToast(t('copied', { count }))
    } else {
      showToast(t('nothingToCopy'), 'warning')
    }
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

  const isFavoriteFood = useCallback(
    (food: FoodItem) => favorites.some(f => f.category === food.category && f.name === food.name),
    [favorites],
  )

  const handleToggleFavorite = useCallback((food: FoodItem) => {
    setFavorites(toggleFavorite(food.category, food.name))
  }, [])

  const favoriteFoods = foods.filter(isFavoriteFood)

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
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="hidden text-sm text-[var(--muted-foreground)] sm:inline self-center">{user.email}</span>
          <ThemeToggle />
          <LangSwitcher />
          <button
            onClick={() => setShowGoals(true)}
            className="text-sm px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t('goals')}
          </button>
          <button
            onClick={() => setShowWeekly(true)}
            className="text-sm px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t('weekly')}
          </button>
          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="text-sm px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {t('admin')}
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="text-sm px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {ta('logout')}
          </button>
        </div>
      </header>

      {error && (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700 dark:text-red-400">
            {error === 'load-foods' ? t('loadFoodsError') : error === 'load-entries' ? t('loadEntriesError') : t('loadError')}
          </p>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <button
              onClick={() => { if (error === 'load-foods') { reloadFoods() } else { reloadEntries() } }}
              className="text-xs px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-medium hover:bg-red-200 dark:hover:bg-red-900 transition-colors"
            >
              {t('retry')}
            </button>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 text-lg leading-none">&times;</button>
          </div>
        </div>
      )}

      <DateNavigator
        date={logDate}
        onDateChange={setLogDate}
        onPrevDay={() => changeDate(-1)}
        onNextDay={() => changeDate(1)}
        onToday={() => setLogDate(getDate())}
      />

      <div className="flex justify-center -mt-2">
        <CopyPreviousDay onCopy={handleCopyPreviousDay} disabled={copying || entriesLoading} />
      </div>

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
        loading={entriesLoading}
        onRemove={handleRemove}
        onAmountInputChange={handleAmountInputChange}
        onAmountBlur={handleUpdateAmount}
        onMealChange={handleMealChange}
      />

      <FavoriteFoods
        foods={favoriteFoods}
        onAdd={setPendingFood}
        isFavorite={isFavoriteFood}
        onToggleFavorite={handleToggleFavorite}
      />

      <RecentFoods
        foods={recents}
        loading={recentsLoading}
        onAdd={setPendingFood}
        isFavorite={isFavoriteFood}
        onToggleFavorite={handleToggleFavorite}
      />

      <div className="sticky top-0 z-30 -mx-4 px-4 py-2 bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-sm">
        <FoodSearch ref={searchRef} value={search} onChange={setSearch} />
      </div>

      <CategoryTabs selected={selectedCategory} onSelect={setSelectedCategory} />

      <FoodGrid
        foods={filteredFoods}
        onAdd={setPendingFood}
        showCategory={isSearching}
        searchQuery={search}
        isFavorite={isFavoriteFood}
        onToggleFavorite={handleToggleFavorite}
      />

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

      {showWeekly && (
        <WeeklySummaryModal
          currentDate={logDate}
          goals={goals}
          onClose={() => setShowWeekly(false)}
        />
      )}
    </div>
  )
}
