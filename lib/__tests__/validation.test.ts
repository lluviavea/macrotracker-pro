import { describe, it, expect } from 'vitest'
import { createFoodSchema, updateFoodSchema, createLogEntrySchema, deleteLogEntrySchema, deleteFoodSchema, loginSchema, registerSchema } from '../validation'

describe('createFoodSchema', () => {
  it('accepts valid food with minimum fields', () => {
    const result = createFoodSchema.parse({
      name: 'Pollo',
      category: 'proteina',
      protein: 31,
      fat: 3.6,
      carbs: 0,
      sugar: 0,
      fiber: 0,
      calories: 165,
    })
    expect(result.name).toBe('Pollo')
    expect(result.measureType).toBe('gram')
    expect(result.preparation).toBeNull()
  })

  it('rejects empty name', () => {
    expect(() => createFoodSchema.parse({ name: '', category: 'proteina', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0 })).toThrow()
  })

  it('rejects invalid category', () => {
    expect(() => createFoodSchema.parse({ name: 'Test', category: 'invalid', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0 })).toThrow()
  })

  it('rejects negative protein', () => {
    expect(() => createFoodSchema.parse({ name: 'Test', category: 'proteina', protein: -1, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0 })).toThrow()
  })

  it('applies defaults for optional fields', () => {
    const result = createFoodSchema.parse({
      name: 'Arroz',
      category: 'carbohidratos',
      protein: 2.6,
      fat: 0.3,
      carbs: 28,
      sugar: 0.1,
      fiber: 0.4,
      calories: 130,
    })
    expect(result.nameEn).toBeNull()
    expect(result.unitName).toBeNull()
    expect(result.unitGrams).toBeNull()
  })
})

describe('updateFoodSchema', () => {
  it('accepts valid update with id', () => {
    const result = updateFoodSchema.parse({
      id: 1,
      name: 'Pollo',
      category: 'proteina',
      protein: 31,
      fat: 3.6,
      carbs: 0,
      sugar: 0,
      fiber: 0,
      calories: 165,
    })
    expect(result.id).toBe(1)
  })

  it('rejects negative id', () => {
    expect(() => updateFoodSchema.parse({ id: -1, name: 'Pollo', category: 'proteina', protein: 0, fat: 0, carbs: 0, sugar: 0, fiber: 0, calories: 0 })).toThrow()
  })
})

describe('createLogEntrySchema', () => {
  it('accepts valid log entry with required fields', () => {
    const result = createLogEntrySchema.parse({
      foodName: 'Pollo',
      category: 'proteina',
      amount: 100,
    })
    expect(result.foodName).toBe('Pollo')
    expect(result.meal).toBe('')
  })

  it('rejects empty food name', () => {
    expect(() => createLogEntrySchema.parse({ foodName: '', category: 'proteina', amount: 100 })).toThrow()
  })

  it('rejects negative amount', () => {
    expect(() => createLogEntrySchema.parse({ foodName: 'Pollo', category: 'proteina', amount: -1 })).toThrow()
  })

  it('rejects zero amount', () => {
    expect(() => createLogEntrySchema.parse({ foodName: 'Pollo', category: 'proteina', amount: 0 })).toThrow()
  })
})

describe('deleteLogEntrySchema', () => {
  it('accepts valid id', () => {
    const result = deleteLogEntrySchema.parse({ id: 1 })
    expect(result.id).toBe(1)
  })

  it('rejects zero id', () => {
    expect(() => deleteLogEntrySchema.parse({ id: 0 })).toThrow()
  })
})

describe('deleteFoodSchema', () => {
  it('accepts valid id', () => {
    const result = deleteFoodSchema.parse({ id: 5 })
    expect(result.id).toBe(5)
  })
})

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.parse({ email: 'test@example.com', password: 'password123' })
    expect(result.email).toBe('test@example.com')
  })

  it('rejects invalid email', () => {
    expect(() => loginSchema.parse({ email: 'not-an-email', password: 'password123' })).toThrow()
  })
})

describe('registerSchema', () => {
  it('accepts valid registration', () => {
    const result = registerSchema.parse({
      email: 'test@example.com',
      password: 'password123',
      inviteCode: 'invite-me',
    })
    expect(result.email).toBe('test@example.com')
  })

  it('rejects short password', () => {
    expect(() =>
      registerSchema.parse({ email: 'test@example.com', password: 'short', inviteCode: 'invite-me' }),
    ).toThrow()
  })
})
