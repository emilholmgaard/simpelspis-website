import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { RecipeActions } from '@/components/recipe-actions'
import { Heading, Subheading } from '@/components/text'
import { ArrowLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRecipeBySlug, getAllRecipes, getAllRecipesWithData, type RecipeListItem, type Recipe } from '@/lib/recipes'
import { ReviewForm } from '@/components/reviews/review-form'
import { ReviewList } from '@/components/reviews/review-list'
import { ReviewStatsDisplay } from '@/components/reviews/review-stats-display'
import { db } from '@/lib/db'
import { reviews } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { AnimatedRecipeCard } from '@/components/animated-recipe-card'
import { RecipeIngredients } from '@/components/recipe/recipe-ingredients'
import { RecipeInstructions } from '@/components/recipe/recipe-instructions'

export async function generateStaticParams() {
  const recipes = getAllRecipesWithData()
  return recipes.map((recipe: Recipe) => ({
    slug: recipe.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)

  if (!recipe) {
    return {
      title: 'Nem Opskrift ikke fundet',
      description: 'Den ønskede nemme opskrift kunne ikke findes.',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.simpelspis.dk'
  const url = `${baseUrl}/opskrifter/${slug}`

  return {
    title: `${recipe.title} - Nem Opskrift`,
    description: `${recipe.description} Få den komplette nemme opskrift med ingredienser, fremgangsmåde og næringsindhold. ${recipe.time} • ${recipe.difficulty} sværhedsgrad.`,
    keywords: [
      recipe.title.toLowerCase(),
      recipe.category.toLowerCase(),
      'nem opskrift',
      'nem madopskrift',
      recipe.difficulty.toLowerCase(),
      `${recipe.time} nem opskrift`,
      'simpel spis',
      'dansk opskrift',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${recipe.title} - Nem Opskrift`,
      description: recipe.description,
      type: 'article',
      url: url,
      siteName: 'Simpel Spis',
      locale: 'da_DK',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} - Nem Opskrift`,
      description: recipe.description,
    },
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)

  if (!recipe) {
    notFound()
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.simpelspis.dk'
  
  // Fetch review stats for AggregateRating schema
  let reviewStats = null
  try {
    // Check if database connection is available before attempting database query
    const hasDbConnection = 
      process.env.POSTGRES_URL || 
      process.env.POSTGRES_URL_NON_POOLING ||
      process.env.POSTGRES_PRISMA_URL ||
      process.env['simpelspis_POSTGRES_URL'] ||
      process.env['simpelspis_POSTGRES_URL_NON_POOLING'] ||
      process.env['simpelspis_POSTGRES_PRISMA_URL']
    
    if (hasDbConnection) {
      const stats = await db
        .select({
          averageRating: sql<number>`COALESCE(AVG(${reviews.rating})::numeric, 0)`,
          totalReviews: sql<number>`COUNT(*)::int`,
        })
        .from(reviews)
        .where(eq(reviews.recipeSlug, slug))
      
      const result = stats[0]
      if (result && result.totalReviews && result.totalReviews > 0) {
        reviewStats = {
          averageRating: parseFloat(result.averageRating?.toString() || '0'),
          totalReviews: result.totalReviews || 0,
        }
      }
    }
  } catch (error) {
    // Ignore errors - reviews are optional
    console.error('Error fetching review stats:', error)
  }
  
  // Konverter tid til ISO 8601 format (PT90M for 90 min, PT2H for 2 timer)
  function parseTimeToISO(timeStr: string): string {
    if (!timeStr) return 'PT30M'
    
    // Håndter "2 timer 30 min" format
    const hoursMatch = timeStr.match(/(\d+)\s*(timer|time)/i)
    const minutesMatch = timeStr.match(/(\d+)\s*min/i)
    
    let hours = 0
    let minutes = 0
    
    if (hoursMatch) {
      hours = parseInt(hoursMatch[1])
    }
    if (minutesMatch) {
      minutes = parseInt(minutesMatch[1])
    }
    
    // Hvis ingen timer, prøv kun minutter
    if (!hoursMatch && minutesMatch) {
      minutes = parseInt(minutesMatch[1])
    }
    
    // Hvis ingen match, prøv at parse direkte tal
    if (!hoursMatch && !minutesMatch) {
      const numMatch = timeStr.match(/(\d+)/)
      if (numMatch) {
        const num = parseInt(numMatch[1])
        if (timeStr.toLowerCase().includes('timer') || timeStr.toLowerCase().includes('time')) {
          hours = num
        } else {
          minutes = num
        }
      }
    }
    
    if (hours > 0 && minutes > 0) {
      return `PT${hours}H${minutes}M`
    } else if (hours > 0) {
      return `PT${hours}H`
    } else if (minutes > 0) {
      return `PT${minutes}M`
    }
    
    return 'PT30M' // default
  }

  // Filtrer og formater ingredienser (fjern sektion headers som "Til kødet:")
  const formattedIngredients = recipe.ingredients
    .filter(ing => ing && ing.trim() && !ing.endsWith(':'))
    .map(ing => ing.trim())

  // Filtrer og formater instruktioner (fjern sektion headers)
  const formattedInstructions = recipe.instructions
    .filter(inst => inst && inst.trim() && !inst.match(/^(FORBEREDELSE|TILBEREDNING|SAMMENSAETNING|PRO TIPS)/i))
    .map((instruction, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      text: instruction.trim(),
    }))

  // JSON-LD strukturerede data for Recipe schema - fuldt kompatibel med Google's krav
  const recipeSchema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    // Obligatoriske properties
    name: recipe.title,
    image: [
      // Google anbefaler flere billeder med forskellige aspect ratios
      // Når I får billeder, tilføj dem her som array
      `${baseUrl}/images/recipes/${slug}-16x9.jpg`,
      `${baseUrl}/images/recipes/${slug}-4x3.jpg`,
      `${baseUrl}/images/recipes/${slug}-1x1.jpg`,
    ],
    recipeIngredient: formattedIngredients,
    recipeInstructions: formattedInstructions,
    // Anbefalede properties for rich results
    description: recipe.description,
    prepTime: parseTimeToISO(recipe.prepTime),
    cookTime: parseTimeToISO(recipe.cookTime),
    totalTime: parseTimeToISO(recipe.time),
    // Date published - brug fra opskrift hvis tilgængelig, ellers fallback
    datePublished: recipe.datePublished || '2025-12-07T10:00:00+01:00',
    dateModified: recipe.dateModified || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Simpel Spis',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Simpel Spis',
      url: baseUrl,
    },
    // Yderligere properties
    recipeCategory: recipe.category,
    recipeCuisine: 'Danish', // Tilpas efter behov
    recipeYield: '4', // Standard - tilpas hvis I har servings data
    // Nutrition information
    nutrition: {
      '@type': 'NutritionInformation',
      calories: recipe.nutrition.energy,
      fatContent: recipe.nutrition.fat,
      saturatedFatContent: recipe.nutrition.saturatedFat,
      carbohydrateContent: recipe.nutrition.carbs,
      sugarContent: recipe.nutrition.sugar,
      fiberContent: recipe.nutrition.fiber,
      proteinContent: recipe.nutrition.protein,
      sodiumContent: recipe.nutrition.salt,
    },
    // Keywords for SEO
    keywords: `${recipe.title}, ${recipe.category}, nem opskrift, dansk mad, ${recipe.difficulty}`,
    // AggregateRating for reviews (if reviews exist)
    ...(reviewStats && reviewStats.totalReviews > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: reviewStats.averageRating.toFixed(1),
            reviewCount: reviewStats.totalReviews,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  }

  // Find lignende opskrifter baseret på kategori
  function getSimilarRecipes(currentSlug: string, category: string, limit: number = 4): RecipeListItem[] {
    const allRecipes = getAllRecipes()
    return allRecipes
      .filter(r => r.slug !== currentSlug && r.category === category)
      .slice(0, limit)
  }

  const similarRecipes = getSimilarRecipes(slug, recipe.category)

  // BreadcrumbList schema for bedre SEO og navigation
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Forside',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Nemme Opskrifter',
        item: `${baseUrl}/opskrifter`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: recipe.title,
        item: `${baseUrl}/opskrifter/${slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <div className="no-print">
      <GradientBackground />
      <Navbar />
      </div>
      <Container className="mt-12 pb-24 print:mt-0">
        {/* Breadcrumbs */}
        <nav className="no-print mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="data-hover:text-gray-950 dark:data-hover:text-gray-50">
                Forside
              </Link>
            </li>
            <li>
              <ChevronRightIcon className="size-4" />
            </li>
            <li>
              <Link href="/opskrifter" className="data-hover:text-gray-950 dark:data-hover:text-gray-50">
                Opskrifter
              </Link>
            </li>
            <li>
              <ChevronRightIcon className="size-4" />
            </li>
            <li className="text-gray-950 dark:text-gray-50 font-medium" aria-current="page">
              {recipe.title}
            </li>
          </ol>
        </nav>

        <Link
          href="/opskrifter"
          className="no-print mb-8 inline-flex items-center gap-2 text-sm/6 font-medium text-gray-600 dark:text-gray-400 data-hover:text-gray-950 dark:data-hover:text-gray-50"
        >
          <ArrowLeftIcon className="size-4" />
          Tilbage til opskrifter
        </Link>

        <div className="max-w-7xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10">
              I alt {recipe.time}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10">
              Forberedelse {recipe.prepTime}
            </span>
            <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10">
              Tilberedning {recipe.cookTime}
            </span>
            <span className="text-sm/5 text-gray-600 dark:text-gray-400">
              <span className="font-medium">{recipe.category}</span>
              <span> • </span>
              <span>{recipe.difficulty}</span>
            </span>
          </div>

          <div className="mt-2">
            <Heading as="h1">
              {recipe.title}
            </Heading>
          <ReviewStatsDisplay
            averageRating={reviewStats?.averageRating || 0}
            totalReviews={reviewStats?.totalReviews || 0}
            recipeSlug={slug}
          />
          </div>
          <p className="mt-6 max-w-3xl text-base/7 text-gray-600 dark:text-gray-400">
            {recipe.description}
          </p>

          <RecipeActions recipe={recipe} />

          <div className="mt-8">
            <Subheading as="h2">Næringsindhold per portion</Subheading>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm/6 font-medium text-gray-950 dark:text-gray-50">
                  Energi
                </span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">
                  {recipe.nutrition.energy}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm/6 font-medium text-gray-950 dark:text-gray-50">Fedt</span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">
                  {recipe.nutrition.fat}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm/6 font-medium text-gray-950 dark:text-gray-50">
                  Heraf mættet
                </span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">
                  {recipe.nutrition.saturatedFat}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm/6 font-medium text-gray-950 dark:text-gray-50">
                  Kulhydrat
                </span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">
                  {recipe.nutrition.carbs}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm/6 font-medium text-gray-950 dark:text-gray-50">
                  Heraf sukker
                </span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">
                  {recipe.nutrition.sugar}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm/6 font-medium text-gray-950 dark:text-gray-50">
                  Fiber
                </span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">
                  {recipe.nutrition.fiber}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm/6 font-medium text-gray-950 dark:text-gray-50">
                  Protein
                </span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">
                  {recipe.nutrition.protein}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm/6 font-medium text-gray-950 dark:text-gray-50">Salt</span>
                <span className="text-sm/6 text-gray-600 dark:text-gray-400">
                  {recipe.nutrition.salt}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 recipe-section">
            <RecipeInstructions instructions={recipe.instructions} />
            <RecipeIngredients ingredients={recipe.ingredients} defaultPortions={1} />
          </div>
        </div>
      </Container>

      <Container className="pb-24 no-print">
        <div className="max-w-4xl">
          <Subheading className="mt-12 mb-8">Anmeldelser</Subheading>
          <ReviewList recipeSlug={slug} />
          <div className="mt-8">
            <ReviewForm recipeSlug={slug} />
          </div>
        </div>
      </Container>

      {/* Lignende opskrifter */}
      {similarRecipes.length > 0 && (
        <Container className="pb-24 no-print">
          <div className="max-w-7xl">
            <Subheading className="mb-8">Lignende opskrifter</Subheading>
            <div className="grid grid-cols-1 gap-8">
              {similarRecipes.map((similarRecipe, index) => (
                <AnimatedRecipeCard key={similarRecipe.slug} {...similarRecipe} index={index} />
              ))}
            </div>
          </div>
        </Container>
      )}
    </main>
    </>
  )
}

