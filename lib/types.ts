export type FoodCategory =
  | 'proteina'
  | 'carbohidratos'
  | 'grasas'
  | 'frutas'
  | 'verduras'
  | 'condimentos'
  | 'suplementos'

export interface FoodItem {
  name: string
  category: FoodCategory
  protein: number
  fat: number
  carbs: number
  calories: number
  measureType: 'gram' | 'unit'
  unitName: string | null
  unitGrams: number | null
  preparation: 'crudo' | 'cocido' | null
}

export interface Entry {
  rowIndex: number
  foodName: string
  category: string
  amount: number
  amountInput: string
}
