import { db } from './index'
import { users } from './schema'
import { eq } from 'drizzle-orm'

export interface User {
  id: number
  email: string
  role: 'admin' | 'user'
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (rows.length === 0) return null
  const r = rows[0]
  return { id: r.id, email: r.email, role: r.role as 'admin' | 'user' }
}

export async function getUserWithPasswordByEmail(email: string): Promise<(User & { passwordHash: string }) | null> {
  const rows = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (rows.length === 0) return null
  const r = rows[0]
  return { id: r.id, email: r.email, role: r.role as 'admin' | 'user', passwordHash: r.passwordHash }
}

export async function getUserById(id: number): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
  if (rows.length === 0) return null
  const r = rows[0]
  return { id: r.id, email: r.email, role: r.role as 'admin' | 'user' }
}

export async function createUser(email: string, passwordHash: string, role: 'admin' | 'user' = 'user'): Promise<User> {
  const [row] = await db
    .insert(users)
    .values({ email, passwordHash, role })
    .returning({ id: users.id, email: users.email, role: users.role })

  return { id: row.id, email: row.email, role: row.role as 'admin' | 'user' }
}
