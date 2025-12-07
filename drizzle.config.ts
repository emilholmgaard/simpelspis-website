import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 
         process.env.POSTGRES_URL_NON_POOLING || 
         process.env.POSTGRES_URL || 
         process.env.POSTGRES_PRISMA_URL || 
         '',
  },
})



