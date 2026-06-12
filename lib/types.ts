export type FoodCategory =
  | 'proteina'
  | 'carbohidratos'
  | 'grasas'
  | 'frutas'
  | 'verduras'
  | 'condimentos'
  | 'suplementos'

export interface FoodItem {
  id: number
  name: string
  nameEn: string | null
  category: FoodCategory
  protein: number
  fat: number
  carbs: number
  sugar: number
  fiber: number
  calories: number
  measureType: 'gram' | 'unit'
  unitName: string | null
  unitGrams: number | null
  preparation: 'crudo' | 'cocido' | null
}

export interface Entry {
  id: number
  foodName: string
  category: string
  amount: number
  amountInput: string
  meal: string
}
