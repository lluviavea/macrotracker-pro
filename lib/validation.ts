import { z } from 'zod'

const foodCategoryEnum = z.enum([
  'proteina', 'carbohidratos', 'grasas', 'frutas', 'verduras', 'condimentos', 'suplementos',
])

const measureTypeEnum = z.enum(['gram', 'unit'])

const preparationEnum = z.enum(['crudo', 'cocido']).nullable()

const macroFields = {
  protein: z.number().min(0).default(0),
  fat: z.number().min(0).default(0),
  carbs: z.number().min(0).default(0),
  sugar: z.number().min(0).default(0),
  fiber: z.number().min(0).default(0),
  calories: z.number().int().min(0).default(0),
}

export const createFoodSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameEn: z.string().nullable().default(null),
  category: foodCategoryEnum,
  ...macroFields,
  measureType: measureTypeEnum.default('gram'),
  unitName: z.string().nullable().default(null),
  unitGrams: z.number().min(0).nullable().default(null),
  preparation: preparationEnum.default(null),
})

export const updateFoodSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, 'Name is required'),
  nameEn: z.string().nullable().default(null),
  category: foodCategoryEnum,
  ...macroFields,
  measureType: measureTypeEnum.default('gram'),
  unitName: z.string().nullable().default(null),
  unitGrams: z.number().min(0).nullable().default(null),
  preparation: preparationEnum.default(null),
})

export const deleteFoodSchema = z.object({
  id: z.number().int().positive(),
})

export const createLogEntrySchema = z.object({
  date: z.string().optional(),
  foodName: z.string().min(1, 'Food name is required'),
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  meal: z.string().optional().default(''),
})

export const updateLogEntrySchema = z.object({
  id: z.number().int().positive(),
  foodName: z.string().min(1),
  category: z.string().min(1),
  amount: z.number().positive(),
})

export const deleteLogEntrySchema = z.object({
  id: z.number().int().positive(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
