import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL || ''

// Lazy initialization - only create client when needed
let client: ReturnType<typeof postgres> | null = null
let dbInstance: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }
  
  if (!client) {
    // Configure connection pool with limits
    client = postgres(connectionString, {
      prepare: false,
      max: 10, // Maximum number of connections in the pool
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout
    })
    dbInstance = drizzle(client, { schema })
  }
  
  return dbInstance!
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>]
  },
})

