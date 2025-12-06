import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { getAllRecipes, getAllRecipesWithData, type RecipeListItem, type Recipe } from '@/lib/recipes'

export const metadata: Metadata = {
  title: 'Alle Nemme Opskrifter',
  description:
    'Udforsk vores samling af nemme opskrifter fra hele verden. Fra klassiske retter som carbonara og tiramisu til moderne fusion-køkken. Find nemme opskrifter efter kategori, sværhedsgrad eller tid.',
  keywords: ['alle nemme opskrifter', 'nemme opskrifter samling', 'pasta nemme opskrifter', 'fisk nemme opskrifter', 'dessert nemme opskrifter', 'vegetarisk nemme opskrifter', 'dansk mad'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk'}/opskrifter`,
  },
  openGraph: {
    title: 'Alle Nemme Opskrifter',
    description: 'Udforsk vores samling af nemme opskrifter fra hele verden. Fra klassiske retter til moderne fusion-køkken.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk'}/opskrifter`,
    siteName: 'Simpel Spis',
    locale: 'da_DK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alle Nemme Opskrifter',
    description: 'Udforsk vores samling af nemme opskrifter fra hele verden.',
  },
}

const categories = [
  'Alle',
  'Dessert',
  'Fisk',
  'Hurtigt',
  'Kød',
  'Pasta',
  'Vegetarisk',
  'Laktosefri',
  'Glutenfri',
  'Low Carb / Keto',
  'Vegansk / Plantebaseret',
]

function RecipeCard({
  slug,
  title,
  category,
  time,
  prepTime,
  cookTime,
  difficulty,
  excerpt,
}: RecipeListItem) {
  return (
    <Link
      href={`/opskrifter/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-shadow data-hover:shadow-lg"
    >
      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center gap-3 text-sm/5 text-gray-600 dark:text-gray-400">
          <span className="font-medium">{category}</span>
          <span>•</span>
          <span>{difficulty}</span>
        </div>
        <h3 className="mt-3 text-xl/7 font-medium text-gray-950 dark:text-gray-50">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm/6 text-gray-500 dark:text-gray-400">{excerpt}</p>
        <div className="mt-6 space-y-2 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">I alt:</span>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Forberedelse:</span>
            <span>{prepTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">Tilberedning:</span>
            <span>{cookTime}</span>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-1 text-sm/5 font-medium text-gray-950 dark:text-gray-50">
          Se opskrift
          <ChevronRightIcon className="size-4 transition-transform group-data-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

function CategoryFilter({
  selectedCategory,
}: {
  selectedCategory: string
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const categorySlug = category.toLowerCase().replace(/\s+\/\s+/g, '-').replace(/\s+/g, '-')
        const isSelected =
          (category === 'Alle' && !selectedCategory) ||
          category.toLowerCase() === selectedCategory ||
          categorySlug === selectedCategory ||
          (selectedCategory === 'low-carb-keto' && category === 'Low Carb / Keto') ||
          (selectedCategory === 'vegansk-plantebaseret' && category === 'Vegansk / Plantebaseret')
        return (
        <Button
          key={category}
            variant={isSelected ? 'primary' : 'outline'}
            href={
              category === 'Alle'
                ? '/opskrifter'
                : `/opskrifter?kategori=${categorySlug}`
            }
          className="text-sm"
        >
          {category}
        </Button>
        )
      })}
    </div>
  )
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const searchQuery = (params.q as string)?.toLowerCase() || ''
  let selectedCategory = (params.category as string)?.toLowerCase() || (params.kategori as string)?.toLowerCase() || ''
  // Normalize category names from URL
  if (selectedCategory === 'low-carb-keto') {
    selectedCategory = 'low carb / keto'
  } else if (selectedCategory === 'vegansk-plantebaseret') {
    selectedCategory = 'vegansk / plantebaseret'
  }
  const timeParam = (params.time as string) || ''

  // Hent alle opskrifter fra JSON-filer
  // For de nye filtre skal vi bruge fulde opskrifter for at tjekke ingredienser
  const needsFullData = selectedCategory && ['laktosefri', 'glutenfri', 'low carb / keto', 'vegansk / plantebaseret'].includes(selectedCategory)
  const recipeList = getAllRecipes()
  const fullRecipes = needsFullData ? getAllRecipesWithData() : null
  const recipes = needsFullData 
    ? recipeList.map(item => {
        const full = fullRecipes?.find(r => r.slug === item.slug)
        return full ? { ...item, fullRecipe: full } : item
      })
    : recipeList

  // Filtrer opskrifter baseret på alle søgeparametre
  const filteredRecipes = recipes.filter((recipe) => {
    // Søg i titel og beskrivelse
    if (searchQuery) {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery) ||
        recipe.excerpt.toLowerCase().includes(searchQuery)
      if (!matchesSearch) return false
    }

    // Filtrer efter kategori
    if (selectedCategory) {
      const categoryLower = recipe.category.toLowerCase()
      const titleLower = recipe.title.toLowerCase()
      const excerptLower = recipe.excerpt.toLowerCase()
      const fullRecipe = 'fullRecipe' in recipe ? (recipe as RecipeListItem & { fullRecipe?: Recipe }).fullRecipe : undefined

      // Håndter "Hurtigt" kategori (opskrifter under eller lig 30 min)
      if (selectedCategory === 'hurtigt') {
        const timeStr = recipe.time.toLowerCase()
        // Håndter "4 timer" osv.
        if (timeStr.includes('timer') || timeStr.includes('time')) {
          return false
        }
        const timeMinutes = parseInt(recipe.time)
        if (isNaN(timeMinutes) || timeMinutes > 30) {
          return false
        }
      }
      // Håndter "Vegetarisk" kategori
      else if (selectedCategory === 'vegetarisk') {
        if (
          categoryLower !== 'vegetarisk' &&
          !titleLower.includes('vegetarisk')
        ) {
          return false
        }
      }
      // Håndter "Laktosefri" kategori
      else if (selectedCategory === 'laktosefri') {
        if (!fullRecipe) return false
        const recipeText = JSON.stringify(fullRecipe).toLowerCase()
        // Tjek om opskriften indeholder laktoseholdige ingredienser
        const hasLactose = /mælk|smør|ost|fløde|yoghurt|creme|cheese|butter|milk|cream/i.test(recipeText)
        if (hasLactose && !titleLower.includes('laktosefri') && !excerptLower.includes('laktosefri')) {
          return false
        }
      }
      // Håndter "Glutenfri" kategori
      else if (selectedCategory === 'glutenfri') {
        if (!fullRecipe) return false
        const recipeText = JSON.stringify(fullRecipe).toLowerCase()
        // Tjek om opskriften indeholder glutenholdige ingredienser
        const hasGluten = /hvedemel|rugmel|gluten|pasta|brød|boller|kage|wheat|flour|bread/i.test(recipeText)
        if (hasGluten && !titleLower.includes('glutenfri') && !excerptLower.includes('glutenfri')) {
          return false
        }
      }
      // Håndter "Low Carb / Keto" kategori
      else if (selectedCategory === 'low carb / keto') {
        if (!fullRecipe) return false
        // Tjek om opskriften har lave kulhydrater (under 20g per portion)
        const carbsMatch = fullRecipe.nutrition?.carbs?.match(/(\d+)g/)
        if (carbsMatch) {
          const carbs = parseInt(carbsMatch[1])
          if (carbs > 20 && !titleLower.includes('low carb') && !titleLower.includes('keto') && !excerptLower.includes('low carb') && !excerptLower.includes('keto')) {
            return false
          }
        } else {
          // Hvis vi ikke kan bestemme, filtrer ud baseret på ingredienser
          const recipeText = JSON.stringify(fullRecipe).toLowerCase()
          const hasHighCarbs = /mel|sukker|ris|pasta|brød|kartofler|kartofel|flour|sugar|rice|bread|potato/i.test(recipeText)
          if (hasHighCarbs && !titleLower.includes('low carb') && !titleLower.includes('keto') && !excerptLower.includes('low carb') && !excerptLower.includes('keto')) {
            return false
          }
        }
      }
      // Håndter "Vegansk / Plantebaseret" kategori
      else if (selectedCategory === 'vegansk / plantebaseret') {
        if (!fullRecipe) return false
        const recipeText = JSON.stringify(fullRecipe).toLowerCase()
        // Tjek om opskriften indeholder animalske produkter
        const hasAnimalProducts = /kød|okse|lam|svin|kylling|fisk|æg|mælk|smør|ost|fløde|yoghurt|creme|cheese|honning|meat|beef|lamb|pork|chicken|fish|egg|milk|butter|cheese|cream|honey/i.test(recipeText)
        if (hasAnimalProducts && !titleLower.includes('vegansk') && !titleLower.includes('plantebaseret') && !excerptLower.includes('vegansk') && !excerptLower.includes('plantebaseret')) {
          return false
        }
      }
      // Matcher kategori
      else if (categoryLower !== selectedCategory) {
        return false
      }
    }

    // Filtrer efter tid (max tid i minutter)
    if (timeParam) {
      const maxTime = parseInt(timeParam)
      if (!isNaN(maxTime)) {
        const timeStr = recipe.time.toLowerCase()
        // Håndter "4 timer" osv.
        if (timeStr.includes('timer') || timeStr.includes('time')) {
          return false
        }
        const recipeTime = parseInt(recipe.time)
        if (isNaN(recipeTime) || recipeTime > maxTime) {
          return false
        }
      }
    }

    return true
  }).map(recipe => {
    // Remove fullRecipe from the result
    if ('fullRecipe' in recipe) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fullRecipe: _fullRecipe, ...rest } = recipe as RecipeListItem & { fullRecipe?: Recipe }
      return rest
    }
    return recipe
  })

  return (
    <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <GradientBackground />
      <Navbar />
      <Container className="mt-28 pb-24">
        <Subheading>Nemme Opskrifter</Subheading>
        <Heading as="h1" className="mt-2">
          Udforsk vores samling af nemme opskrifter.
        </Heading>
        <Lead className="mt-6 max-w-3xl">
          Fra klassiske retter til moderne fusion-køkken. Simpel Spis.
        </Lead>
        <div className="mt-12">
          <CategoryFilter selectedCategory={selectedCategory} />
        </div>
        {(searchQuery || timeParam) && (
          <div className="mt-6 flex flex-wrap gap-2 items-center text-sm">
            <span className="font-semibold text-gray-900 dark:text-gray-50">
              Aktive filtre:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Søg: &quot;{searchQuery}&quot;
              </span>
            )}
            {timeParam && (
              <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                Max tid: {timeParam} min
              </span>
            )}
            <Link
              href="/opskrifter"
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 underline text-xs"
            >
              Ryd alle filtre
            </Link>
          </div>
        )}
        {filteredRecipes.length > 0 ? (
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.slug} {...recipe} />
          ))}
        </div>
        ) : (
          <div className="mt-16 text-center py-12">
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Ingen opskrifter fundet.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
              Prøv at ændre dine søgekriterier eller filtre.
            </p>
            <Button href="/opskrifter" className="mt-4">
              Se alle opskrifter
            </Button>
          </div>
        )}
      </Container>
    </main>
  )
}

