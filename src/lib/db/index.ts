import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Support multiple environment variable names for Vercel/Supabase
// Vercel provides POSTGRES_URL variants (including prefixed ones like simpelspis_POSTGRES_URL)
const connectionString = 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL ||
  process.env['simpelspis_POSTGRES_URL_NON_POOLING'] ||
  process.env['simpelspis_POSTGRES_URL'] ||
  process.env['simpelspis_POSTGRES_PRISMA_URL'] ||
  ''

// Lazy initialization - only create client when needed
let client: ReturnType<typeof postgres> | null = null
let dbInstance: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (!connectionString) {
    // Return a mock db object that won't crash if database connection is not configured
    return {
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([]),
        }),
      }),
      insert: () => Promise.resolve({}),
      update: () => ({
        where: () => Promise.resolve({}),
      }),
      delete: () => ({
        where: () => Promise.resolve({}),
      }),
    } as unknown as ReturnType<typeof drizzle>
  }
  
  if (!client) {
    try {
      // Configure connection pool with limits
      client = postgres(connectionString, {
        prepare: false,
        max: 10, // Maximum number of connections in the pool
        idle_timeout: 20, // Close idle connections after 20 seconds
        connect_timeout: 10, // Connection timeout
      })
      dbInstance = drizzle(client, { schema })
    } catch (error) {
      console.error('Error initializing database:', error)
      // Return mock db object if initialization fails
      return {
        select: () => ({
          from: () => ({
            where: () => Promise.resolve([]),
          }),
        }),
        insert: () => Promise.resolve({}),
        update: () => ({
          where: () => Promise.resolve({}),
        }),
        delete: () => ({
          where: () => Promise.resolve({}),
        }),
      } as unknown as ReturnType<typeof drizzle>
    }
  }
  
  return dbInstance!
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle>]
  },
})

