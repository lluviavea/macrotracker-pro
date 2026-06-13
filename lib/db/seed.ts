import { db } from './index'
import { foods, logEntries } from './schema'
import { createUser, getUserByEmail } from './users'
import { seedUserCatalog } from './foods'
import bcrypt from 'bcryptjs'

async function setupAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL
  const password = process.env.INITIAL_ADMIN_PASSWORD

  if (!email || !password) {
    console.error('INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD must be set in .env.local')
    process.exit(1)
  }

  if (!process.env.SESSION_SECRET) {
    console.error('SESSION_SECRET must be set in .env.local')
    process.exit(1)
  }

  let user = await getUserByEmail(email)
  if (!user) {
    const passwordHash = await bcrypt.hash(password, 12)
    user = await createUser(email, passwordHash, 'admin')
    console.log(`Created admin user: ${user.email}`)
  } else {
    console.log(`Admin user already exists: ${user.email}`)
  }

  console.log('Removing unowned log entries...')
  await db.delete(logEntries)

  console.log('Removing unowned foods...')
  await db.delete(foods)

  console.log('Seeding admin catalog...')
  await seedUserCatalog(user.id)

  console.log('Admin setup complete.')
  process.exit(0)
}

setupAdmin().catch(err => {
  console.error('Admin setup failed:', err)
  process.exit(1)
})
