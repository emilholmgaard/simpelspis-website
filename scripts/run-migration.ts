import * as dotenv from 'dotenv'
import postgres from 'postgres'
import { readFileSync } from 'fs'
import { join } from 'path'

dotenv.config({ path: '.env.local' })

// Try multiple possible environment variable names (including Vercel prefixed ones)
const connectionString = 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL ||
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  process.env.simpelspis_POSTGRES_URL ||
  process.env.simpelspis_POSTGRES_PRISMA_URL ||
  ''

if (!connectionString) {
  console.error('❌ No database connection string found')
  console.error('Please set POSTGRES_URL_NON_POOLING, POSTGRES_URL, or POSTGRES_PRISMA_URL in .env.local')
  process.exit(1)
}

async function runMigration() {
  const sql = postgres(connectionString)
  
  try {
    console.log('🔄 Running migration...')
    
    // Read migration file
    const migrationSQL = readFileSync(
      join(process.cwd(), 'drizzle', '0001_add_anonymous_reviews.sql'),
      'utf-8'
    )
    
    // Execute migration
    await sql.unsafe(migrationSQL)
    
    console.log('✅ Migration completed successfully!')
    console.log('   - user_id column is now nullable')
    console.log('   - anonymous_id column added')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

runMigration()

