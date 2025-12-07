import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { env } from '../env'

const connectionString = env.POSTGRES_URL

if (!connectionString) {
  // In production, we want to fail hard if the database URL is missing
  if (env.isProduction) {
    throw new Error('Missing database connection string (POSTGRES_URL)')
  }
  console.warn('⚠️ Missing POSTGRES_URL. Database features will not work.')
}

// Global object cache to prevent connection exhaustion in development
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined
}

const client = globalForDb.conn ?? postgres(connectionString, {
  prepare: false,
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  // Ensure SSL is used in production (Supabase/Neon usually require it)
  ssl: env.isProduction ? 'require' : undefined,
})

if (!env.isProduction) {
  globalForDb.conn = client
}

export const db = drizzle(client, { schema })
