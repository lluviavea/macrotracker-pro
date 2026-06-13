import { db } from '../lib/db/index'
import { users } from '../lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

async function updateAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL
  const password = process.env.INITIAL_ADMIN_PASSWORD

  if (!email || !password) {
    console.error('INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set in .env.local')
    process.exit(1)
  }

  const existing = await db.select().from(users).where(eq(users.role, 'admin')).limit(1)

  if (existing.length === 0) {
    console.log('No admin user found. Run just db-seed to create one.')
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  await db
    .update(users)
    .set({ email, passwordHash })
    .where(eq(users.id, existing[0].id))

  console.log(`Admin user updated: ${email}`)
  process.exit(0)
}

updateAdmin().catch(err => {
  console.error('Failed to update admin:', err)
  process.exit(1)
})
