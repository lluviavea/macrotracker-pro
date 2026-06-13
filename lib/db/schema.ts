import { pgTable, serial, varchar, decimal, integer, date, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const foods = pgTable('foods', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }),
  category: varchar('category', { length: 50 }).notNull(),
  protein: decimal('protein', { precision: 10, scale: 2 }).notNull(),
  fat: decimal('fat', { precision: 10, scale: 2 }).notNull(),
  carbs: decimal('carbs', { precision: 10, scale: 2 }).notNull(),
  sugar: decimal('sugar', { precision: 10, scale: 2 }).notNull().default('0'),
  fiber: decimal('fiber', { precision: 10, scale: 2 }).notNull().default('0'),
  calories: integer('calories').notNull(),
  measureType: varchar('measure_type', { length: 10 }).notNull().default('gram'),
  unitName: varchar('unit_name', { length: 255 }),
  unitGrams: decimal('unit_grams', { precision: 10, scale: 2 }),
  preparation: varchar('preparation', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export const logEntries = pgTable('log_entries', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  foodName: varchar('food_name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 50 }).notNull().default('g'),
  protein: decimal('protein', { precision: 10, scale: 2 }).notNull(),
  fat: decimal('fat', { precision: 10, scale: 2 }).notNull(),
  carbs: decimal('carbs', { precision: 10, scale: 2 }).notNull(),
  sugar: decimal('sugar', { precision: 10, scale: 2 }).notNull().default('0'),
  fiber: decimal('fiber', { precision: 10, scale: 2 }).notNull().default('0'),
  calories: integer('calories').notNull(),
  preparation: varchar('preparation', { length: 50 }).default(''),
  meal: varchar('meal', { length: 20 }).default(''),
  createdAt: timestamp('created_at').defaultNow(),
})
