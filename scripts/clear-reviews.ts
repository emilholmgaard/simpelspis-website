import * as dotenv from 'dotenv'
import postgres from 'postgres'

dotenv.config({ path: '.env.local' })

const connectionString = 
  process.env.POSTGRES_URL_NON_POOLING || 
  process.env.POSTGRES_URL || 
  process.env.POSTGRES_PRISMA_URL ||
  process.env.simpelspis_POSTGRES_URL_NON_POOLING ||
  process.env.simpelspis_POSTGRES_URL ||
  process.env.simpelspis_POSTGRES_PRISMA_URL ||
  ''

if (!connectionString) {
  console.error('❌ No database connection string found')
  process.exit(1)
}

const sql = postgres(connectionString)

async function clearReviews() {
  try {
    console.log('🗑️  Deleting all reviews...')
    const result = await sql`DELETE FROM reviews`
    console.log(`✅ Reviews deleted. Count: ${result.count}`)
  } catch (error) {
    console.error('❌ Failed to delete reviews:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

clearReviews()

