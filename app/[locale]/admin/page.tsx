'use client'

import { useEffect, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LangSwitcher } from '@/components/LangSwitcher'
import type { FoodCategory } from '@/lib/types'
import { lookupNutrition } from '@/lib/nutrition-utils'

const CATEGORIES: FoodCategory[] = [
  'proteina', 'carbohidratos', 'grasas', 'frutas', 'verduras', 'condimentos', 'suplementos',
]

interface FoodForm {
  name: string
  nameEn: string
  category: FoodCategory
  protein: string
  fat: string
  carbs: string
  sugar: string
  fiber: string
  calories: string
  measureType: 'gram' | 'unit'
  unitName: string
  unitGrams: string
  preparation: string
}

interface FoodRow extends FoodForm {
  id: number
}

const EMPTY_FORM: FoodForm = {
  name: '',
  nameEn: '',
  category: 'proteina',
  protein: '',
  fat: '',
  carbs: '',
  sugar: '',
  fiber: '',
  calories: '',
  measureType: 'gram',
  unitName: '',
  unitGrams: '',
  preparation: '',
}

export default function AdminPage() {
  const t = useTranslations('Admin')
  const [foods, setFoods] = useState<FoodRow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<FoodForm>(EMPTY_FORM)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const filteredAndSorted = useMemo(() => {
    let result = foods

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(f => f.name.toLowerCase().includes(q))
    }

    if (sortField) {
      result = [...result].sort((a, b) => {
        const aVal = parseFloat(a[sortField as keyof FoodRow] as string) || 0
        const bVal = parseFloat(b[sortField as keyof FoodRow] as string) || 0
        return sortDir === 'desc' ? bVal - aVal : aVal - bVal
      })
    }

    return result
  }, [foods, search, sortField, sortDir])

  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const mapFood = (f: { id: number; name: string; nameEn: string | null; category: string; protein: number; fat: number; carbs: number; sugar: number; fiber: number; calories: number; measureType: string; unitName: string | null; unitGrams: number | null; preparation: string | null }): FoodRow => ({
    id: f.id,
    name: f.name,
    nameEn: f.nameEn ?? '',
    category: f.category as FoodCategory,
    protein: String(f.protein),
    fat: String(f.fat),
    carbs: String(f.carbs),
    sugar: String(f.sugar),
    fiber: String(f.fiber),
    calories: String(f.calories),
    measureType: f.measureType as 'gram' | 'unit',
    unitName: f.unitName ?? '',
    unitGrams: f.unitGrams !== null ? String(f.unitGrams) : '',
    preparation: f.preparation ?? '',
  })

  async function loadFoods() {
    try {
      const r = await fetch('/api/foods')
      const d = await r.json()
      setFoods(d.foods.map(mapFood))
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    fetch('/api/foods')
      .then(r => r.json())
      .then(d => { if (!cancelled) setFoods(d.foods.map(mapFood)) })
      .catch(() => { if (!cancelled) setLoading(false) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(food: FoodRow) {
    setForm({
      name: food.name,
      nameEn: food.nameEn,
      category: food.category,
      protein: food.protein,
      fat: food.fat,
      carbs: food.carbs,
      sugar: food.sugar,
      fiber: food.fiber,
      calories: food.calories,
      measureType: food.measureType,
      unitName: food.unitName,
      unitGrams: food.unitGrams,
      preparation: food.preparation,
    })
    setEditingId(food.id)
    setShowModal(true)
  }

  function handleNameBlur() {
    if (!form.name.trim()) return

    const suggestion = lookupNutrition(form.name)
    const found = suggestion.protein !== 0 || suggestion.fat !== 0 || suggestion.carbs !== 0 || suggestion.calories !== 0

    if (found) {
      setForm(f => ({
        ...f,
        protein: String(suggestion.protein),
        fat: String(suggestion.fat),
        carbs: String(suggestion.carbs),
        sugar: String(suggestion.sugar),
        fiber: String(suggestion.fiber),
        calories: String(suggestion.calories),
        measureType: suggestion.measureType,
        unitName: suggestion.unitName ?? '',
        unitGrams: suggestion.unitGrams !== null ? String(suggestion.unitGrams) : '',
        preparation: suggestion.preparation ?? '',
      }))
    }
  }

  async function handleSave() {
    const payload = {
      name: form.name,
      nameEn: form.nameEn || null,
      category: form.category,
      protein: parseFloat(form.protein) || 0,
      fat: parseFloat(form.fat) || 0,
      carbs: parseFloat(form.carbs) || 0,
      sugar: parseFloat(form.sugar) || 0,
      fiber: parseFloat(form.fiber) || 0,
      calories: parseInt(form.calories) || 0,
      measureType: form.measureType,
      unitName: form.unitName || null,
      unitGrams: form.unitGrams ? parseFloat(form.unitGrams) : null,
      preparation: form.preparation || null,
    }

    if (editingId !== null) {
      await fetch('/api/foods', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...payload }),
      })
    } else {
      await fetch('/api/foods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }

    setShowModal(false)
    loadFoods()
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(t('deleteConfirm', { name }))) return
    await fetch('/api/foods', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    loadFoods()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    )
  }

  const tableLabels: Record<string, string> = {
    protein: t('protein'),
    fat: t('fat'),
    carbs: t('carbs'),
    sugar: t('sugar'),
    fiber: t('fiber'),
    calories: t('calories'),
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">{t('back')}</Link>
          <h1 className="text-2xl font-bold mt-1">{t('title')}</h1>
        </div>
        <div className="flex items-center gap-3">
          <LangSwitcher />
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full border border-gray-200 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <button
            onClick={openAdd}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 shrink-0"
          >
            {t('addFoodButton')}
          </button>
        </div>
      </header>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left p-3 font-medium text-gray-500">{t('name')}</th>
                <th className="text-left p-3 font-medium text-gray-500">{t('category')}</th>
                {(['protein', 'fat', 'carbs', 'sugar', 'fiber', 'calories'] as const).map(field => {
                  const isActive = sortField === field
                  return (
                    <th
                      key={field}
                      onClick={() => toggleSort(field)}
                      className="text-right p-3 font-medium text-gray-500 cursor-pointer hover:text-gray-700 select-none"
                    >
                      <span className="inline-flex items-center gap-1">
                        {tableLabels[field]}
                        {isActive && (
                          <svg className={`w-3 h-3 transition-transform ${sortDir === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                        )}
                      </span>
                    </th>
                  )
                })}
                <th className="text-center p-3 font-medium text-gray-500">{t('type')}</th>
                <th className="text-center p-3 font-medium text-gray-500 w-24">{t('action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAndSorted.map(food => (
                <tr key={food.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{food.name}</td>
                  <td className="p-3 text-gray-500 capitalize">{food.category}</td>
                  <td className="p-3 text-right">{food.protein}g</td>
                  <td className="p-3 text-right">{food.fat}g</td>
                  <td className="p-3 text-right">{food.carbs}g</td>
                  <td className="p-3 text-right text-pink-600">{food.sugar}g</td>
                  <td className="p-3 text-right text-green-600">{food.fiber}g</td>
                  <td className="p-3 text-right">{food.calories}</td>
                  <td className="p-3 text-center text-xs text-gray-400">{food.measureType === 'unit' ? food.unitName : t('gramUnit')}</td>
                  <td className="p-3 text-center">
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => openEdit(food)}
                        className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        {t('edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(food.id, food.name)}
                        className="text-xs px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-500"
                      >
                        {t('delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">
            {search ? t('noResults') : t('empty')}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400">
        {t('count', { count: filteredAndSorted.length, s: search ? 'true' : 'false', total: foods.length })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingId !== null ? t('editTitle') : t('addTitle')}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('nameLabel')} (ES)</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onBlur={handleNameBlur}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder={t('namePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('nameLabel')} (EN)</label>
                  <input
                    type="text"
                    value={form.nameEn}
                    onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="e.g. Chicken, Rice, Avocado"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('categoryLabel')}</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as FoodCategory }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 capitalize"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('proteinLabel')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.protein}
                    onChange={e => setForm(f => ({ ...f, protein: e.target.value }))}
                    placeholder={t('proteinPlaceholder')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('fatLabel')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.fat}
                    onChange={e => setForm(f => ({ ...f, fat: e.target.value }))}
                    placeholder={t('fatPlaceholder')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('carbsLabel')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.carbs}
                    onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))}
                    placeholder={t('carbsPlaceholder')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('sugarLabel')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.sugar}
                    onChange={e => setForm(f => ({ ...f, sugar: e.target.value }))}
                    placeholder={t('sugarPlaceholder')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('fiberLabel')}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.fiber}
                    onChange={e => setForm(f => ({ ...f, fiber: e.target.value }))}
                    placeholder={t('fiberPlaceholder')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('caloriesLabel')}</label>
                  <input
                    type="number"
                    step="1"
                    value={form.calories}
                    onChange={e => setForm(f => ({ ...f, calories: e.target.value }))}
                    placeholder={t('caloriesPlaceholder')}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('measureTypeLabel')}</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="measureType"
                      value="gram"
                      checked={form.measureType === 'gram'}
                      onChange={() => setForm(f => ({ ...f, measureType: 'gram' }))}
                      className="accent-black"
                    />
                    {t('gramOption')}
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="measureType"
                      value="unit"
                      checked={form.measureType === 'unit'}
                      onChange={() => setForm(f => ({ ...f, measureType: 'unit' }))}
                      className="accent-black"
                    />
                    {t('unitOption')}
                  </label>
                </div>
              </div>

              {form.measureType === 'unit' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('unitNameLabel')}</label>
                    <input
                      type="text"
                      value={form.unitName}
                      onChange={e => setForm(f => ({ ...f, unitName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                      placeholder={t('unitNamePlaceholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('unitGramsLabel')}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={form.unitGrams}
                      onChange={e => setForm(f => ({ ...f, unitGrams: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                      placeholder={t('unitGramsPlaceholder')}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('preparationLabel')}</label>
                <select
                  value={form.preparation}
                  onChange={e => setForm(f => ({ ...f, preparation: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                >
                  <option value="">{t('nonePrep')}</option>
                  <option value="crudo">{t('rawPrep')}</option>
                  <option value="cocido">{t('cookedPrep')}</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handleSave}
                className="flex-1 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
              >
                {editingId !== null ? t('saveChanges') : t('addFood')}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
