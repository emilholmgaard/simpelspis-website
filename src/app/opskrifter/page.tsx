import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { ChevronRightIcon } from '@heroicons/react/16/solid'
import type { Metadata } from 'next'
import { getAllRecipes, type RecipeListItem } from '@/lib/recipes'

export const metadata: Metadata = {
  title: 'Alle Nemme Opskrifter',
  description:
    'Udforsk vores samling af nemme opskrifter fra hele verden. Fra klassiske retter som carbonara og tiramisu til moderne fusion-køkken. Find nemme opskrifter efter kategori, sværhedsgrad eller tid.',
  keywords: ['alle nemme opskrifter', 'nemme opskrifter samling', 'pasta nemme opskrifter', 'fisk nemme opskrifter', 'dessert nemme opskrifter', 'vegetarisk nemme opskrifter', 'dansk mad'],
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk'}/opskrifter`,
  },
  openGraph: {
    title: 'Alle Nemme Opskrifter | Simpel Spis',
    description: 'Udforsk vores samling af nemme opskrifter fra hele verden. Fra klassiske retter til moderne fusion-køkken.',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk'}/opskrifter`,
    siteName: 'Simpel Spis',
    locale: 'da_DK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alle Nemme Opskrifter | Simpel Spis',
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
        const isSelected =
          (category === 'Alle' && !selectedCategory) ||
          category.toLowerCase() === selectedCategory
        return (
        <Button
          key={category}
            variant={isSelected ? 'primary' : 'outline'}
            href={
              category === 'Alle'
                ? '/opskrifter'
                : `/opskrifter?kategori=${category.toLowerCase()}`
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
  const selectedCategory = (params.category as string)?.toLowerCase() || (params.kategori as string)?.toLowerCase() || ''
  const timeParam = (params.time as string) || ''

  // Hent alle opskrifter fra JSON-filer
  const recipes = getAllRecipes()

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
          !recipe.title.toLowerCase().includes('vegetarisk')
        ) {
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

