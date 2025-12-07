import * as dotenv from 'dotenv'
import postgres from 'postgres'
import { readdirSync } from 'fs'
import { join } from 'path'

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

const comments = [
  "Virkelig lækker opskrift! Hele familien elskede den.",
  "Nem at lave og smager fantastisk.",
  "Jeg tilføjede lidt ekstra hvidløg, og det blev perfekt.",
  "Kan klart anbefales.",
  "Super god hverdagsret.",
  "Den her skal vi helt sikkert have igen.",
  "God opskrift, men jeg brugte lidt mindre salt.",
  "Fantastisk smag!",
  "Børnene var vilde med det.",
  "Hurtig og nem aftensmad.",
  "Overraskende god!",
  "Min mand var vild med det.",
  "Perfekt til gæster.",
  "En ny favorit herhjemme.",
  "Simpelt og godt.",
  "Lidt stærkere end forventet, men godt.",
  "Jeg brugte laktosefri fløde, og det fungerede fint.",
  "Mega lækkert!",
  "Tak for opskriften.",
  "Godt resultat hver gang.",
  null, null, null, null, null, null, null, null, null, null // Mange nulls for "kun stjerner"
]

const firstNames = [
  "Mette", "Lars", "Sofie", "Peter", "Anne", "Michael", "Helle", "Jens", 
  "Camilla", "Thomas", "Louise", "Henrik", "Maria", "Søren", "Charlotte", 
  "Christian", "Stine", "Martin", "Julie", "Rasmus", "Katrine", "Anders",
  "Ida", "Mikkel", "Emma", "Jesper", "Freja", "Kasper", "Sara", "Mads"
]

const lastNames = [
  "Jensen", "Nielsen", "Hansen", "Pedersen", "Andersen", "Christensen", 
  "Larsen", "Sørensen", "Rasmussen", "Jørgensen", "Petersen", "Madsen", 
  "Kristensen", "Olsen", "Thomsen", "Christiansen", "Poulsen", "Johansen", 
  "Møller", "Mortensen"
]

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateRating() {
  // Vægtet rating: 50% chance for 5, 30% for 4, 15% for 3, 5% for 1-2
  const rand = Math.random()
  if (rand < 0.5) return 5
  if (rand < 0.8) return 4
  if (rand < 0.95) return 3
  return getRandomInt(1, 2)
}

function generateDate() {
  // Tilfældig dato inden for det sidste år
  const now = new Date()
  const past = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()))
}

async function seed() {
  try {
    console.log('🔄 Starting seed process...')

    // 1. Slet alle eksisterende anmeldelser
    console.log('🗑️  Deleting existing reviews...')
    await sql`DELETE FROM reviews`
    console.log('✅ Reviews deleted')

    // 2. Slet alle 'falske' brugere (vi identificerer dem måske ikke nemt, så vi lader brugere være for nu, 
    // eller sletter dem hvis vi har en måde at kende dem på. 
    // For nu sletter vi bare reviews og opretter nye users on the fly hvis nødvendigt, 
    // men reviews tabellen er det vigtigste).
    // Vi lader 'users' tabellen være for ikke at slette rigtige brugere. 
    // Vi opretter kun nye "dummy" users til reviews.

    // 3. Find alle opskrifter
    const recipesDir = join(process.cwd(), 'src/data/recipes')
    const files = readdirSync(recipesDir).filter(file => file.endsWith('.json'))
    console.log(`Found ${files.length} recipes`)

    let totalReviews = 0

    // Vi laver alle anmeldelser anonyme, så vi behøver ikke oprette dummy users.
    // Vi genererer bare tilfældige "anonyme id'er" for at simulere forskellige brugere.

    // 4. Generer reviews for hver opskrift
    for (const file of files) {
      const slug = file.replace('.json', '')
      const numReviews = getRandomInt(10, 40)
      
      const reviewsToInsert = []
      
      for (let i = 0; i < numReviews; i++) {
        const rating = generateRating()
        const comment = getRandomElement(comments)
        const date = generateDate()
        
        // Generer et tilfældigt anonymt ID
        const anonymousId = `anon_seed_${Math.random().toString(36).substr(2, 9)}`
        
        let review = {
          recipe_slug: slug,
          rating,
          comment,
          created_at: date,
          updated_at: date,
          user_id: null as string | null,
          anonymous_id: anonymousId
        }
        
        reviewsToInsert.push(review)
      }

      // Bulk insert for denne opskrift
      if (reviewsToInsert.length > 0) {
        await sql`
          INSERT INTO reviews ${sql(reviewsToInsert, 'recipe_slug', 'rating', 'comment', 'created_at', 'updated_at', 'user_id', 'anonymous_id')}
        `
        totalReviews += reviewsToInsert.length
      }
      
      process.stdout.write('.') // Progress barish
    }

    console.log('\n')
    console.log(`✅ Successfully inserted ${totalReviews} reviews across ${files.length} recipes`)
    
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

seed()

