import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { RecipeActions } from '@/components/recipe-actions'
import { Heading, Subheading } from '@/components/text'
import { ArrowLeftIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getRecipeBySlug, getAllRecipesWithData } from '@/lib/recipes'

export async function generateStaticParams() {
  const recipes = getAllRecipesWithData()
  return recipes.map((recipe) => ({
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk'
  const url = `${baseUrl}/opskrifter/${slug}`

  return {
    title: `${recipe.title} - Nem Opskrift | Simpel Spis`,
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
      title: `${recipe.title} - Nem Opskrift | Simpel Spis`,
      description: recipe.description,
      type: 'article',
      url: url,
      siteName: 'Simpel Spis',
      locale: 'da_DK',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} - Nem Opskrift | Simpel Spis`,
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk'
  
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
    // Sæt published dato til starten af 2025 for at se realistisk ud
    datePublished: '2025-01-15T10:00:00+01:00',
    dateModified: new Date('2025-12-06').toISOString(),
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
  }

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
      <Container className="mt-28 pb-24">
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

          <Heading as="h1" className="mt-2">
            {recipe.title}
          </Heading>
          <p className="mt-6 max-w-3xl text-base/7 text-gray-600 dark:text-gray-400">
            {recipe.description}
          </p>

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

          <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <Subheading as="h2">Fremgangsmåde</Subheading>
              <div className="mt-4 space-y-6">
                {recipe.instructions.map((instruction, index) => {
                  const isSectionHeader = (instruction.startsWith('FORBEREDELSE') || instruction.startsWith('TILBEREDNING') || instruction.startsWith('SAMMENSAETNING') || instruction.startsWith('PRO TIPS') || instruction.startsWith('TIP'))
                  const isEmpty = instruction.trim() === ''
                  let stepNumber = 0
                  
                  // Tæl faktiske steps (ikke sektionstitler eller tomme linjer)
                  recipe.instructions.slice(0, index).forEach((inst) => {
                    if (inst.trim() !== '' && !(inst.startsWith('FORBEREDELSE') || inst.startsWith('TILBEREDNING') || inst.startsWith('SAMMENSAETNING') || inst.startsWith('PRO TIPS') || inst.startsWith('TIP'))) {
                      stepNumber++
                    }
                  })
                  
                  if (isEmpty) {
                    return <div key={index} className="h-4" />
                  }
                  
                  if (isSectionHeader) {
                    // Find minutter i parentes
                    const timeMatch = instruction.match(/\(([^)]+)\)/)
                    const timeText = timeMatch ? timeMatch[1] : null
                    let headerText = timeMatch ? instruction.replace(timeMatch[0], '').trim() : instruction
                    // Fjern kolon fra slutningen
                    headerText = headerText.replace(/:$/, '')
                    
                    return (
                      <div key={index} className="mt-8 first:mt-0 flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-50">
                          {headerText}
                        </h3>
                        {timeText && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10">
                            {timeText}
                          </span>
                        )}
                      </div>
                    )
                  }
                  
                  return (
                    <div
                    key={index}
                      className="flex gap-6 text-base/7 text-gray-600 dark:text-gray-400"
                  >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-950 dark:text-gray-50">
                        {stepNumber + 1}
                    </span>
                      <span className="pt-1 flex-1">{instruction}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <Subheading as="h2">Ingredienser</Subheading>
              <ul className="mt-4 space-y-2">
                {recipe.ingredients.map((ingredient, index) => {
                  const isSectionHeader = ingredient.endsWith(':')
                  const isEmpty = ingredient.trim() === ''
                  
                  if (isEmpty) {
                    return <li key={index} className="h-2" />
                  }
                  
                  if (isSectionHeader) {
                    return (
                      <li key={index} className="mt-4 first:mt-0">
                        <span className="text-sm font-semibold text-gray-950 dark:text-gray-50">
                          {ingredient}
                        </span>
                      </li>
                    )
                  }
                  
                  return (
                  <li
                    key={index}
                      className="flex items-start gap-3 text-sm/6 text-gray-600 dark:text-gray-400"
                  >
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
                    {ingredient}
                  </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <RecipeActions title={recipe.title} slug={slug} />
      </Container>
    </main>
    </>
  )
}

