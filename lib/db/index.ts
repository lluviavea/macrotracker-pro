import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

// On Vercel (serverless) each function instance is a short-lived process.
// Open a single connection, disable prepared statements (required for
// Neon's PgBouncer pooled endpoint), and time out fast so cold starts and
// exhausted pools surface as clean errors instead of hanging requests.
const client = postgres(connectionString, {
  prepare: false,
  ...(process.env.VERCEL && {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  }),
})

export const db = drizzle(client)
