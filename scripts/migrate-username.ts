import postgres from 'postgres'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const connectionString = process.env.DATABASE_URL!

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const client = postgres(connectionString, { prepare: false })

async function migrateUsername() {
  try {
    console.log('Migrating name column to username...')
    
    // Check if name column exists and rename it to username
    await client`
      DO $$ 
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'name') THEN
          ALTER TABLE users RENAME COLUMN name TO username;
          RAISE NOTICE 'Renamed column name to username';
        ELSE
          RAISE NOTICE 'Column name does not exist, checking if username exists';
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                        WHERE table_name = 'users' AND column_name = 'username') THEN
            ALTER TABLE users ADD COLUMN username TEXT;
            RAISE NOTICE 'Added username column';
          ELSE
            RAISE NOTICE 'Username column already exists';
          END IF;
        END IF;
      END $$;
    `
    
    console.log('✅ Username migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

migrateUsername()



