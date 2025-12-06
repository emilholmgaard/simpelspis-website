import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { ChevronRightIcon, FunnelIcon } from '@heroicons/react/24/outline'
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

// Måltidskategorier
const mealTypes = [
  { label: 'Alle', value: 'alle' },
  { label: 'Morgenmad', value: 'morgenmad' },
  { label: 'Frokost', value: 'frokost' },
  { label: 'Aftensmad', value: 'aftensmad' },
  { label: 'Dessert', value: 'dessert' },
  { label: 'Snack', value: 'snack' },
  { label: 'Julemad', value: 'julemad' },
  { label: 'Sæsonmad', value: 'sæsonmad' },
]

// Rettyper
const dishTypes = [
  { label: 'Alle', value: 'alle' },
  { label: 'Kød', value: 'kød' },
  { label: 'Fisk', value: 'fisk' },
  { label: 'Vegetarisk', value: 'vegetarisk' },
  { label: 'Pasta', value: 'pasta' },
  { label: 'Salat', value: 'salat' },
  { label: 'Sovs', value: 'sovs' },
  { label: 'Brød & Bageri', value: 'brød-bageri' },
]

// Tilberedningsmetoder
const cookingMethods = [
  { label: 'Alle', value: 'alle' },
  { label: 'Airfryer', value: 'airfryer' },
  { label: 'Ovn', value: 'ovn' },
  { label: 'Pande', value: 'pande' },
  { label: 'Gril', value: 'gril' },
]

// Diæt & Præferencer
const dietaryOptions = [
  { label: 'Laktosefri', value: 'laktosefri' },
  { label: 'Glutenfri', value: 'glutenfri' },
  { label: 'Low Carb / Keto', value: 'low-carb-keto' },
  { label: 'Vegansk / Plantebaseret', value: 'vegansk-plantebaseret' },
]


// Tid filtre
const timeFilters = [
  { label: 'Alle', value: 'alle' },
  { label: 'Under 15 min', value: '15' },
  { label: 'Under 30 min', value: '30' },
  { label: 'Under 45 min', value: '45' },
  { label: 'Under 60 min', value: '60' },
]

// Sværhedsgrad filtre
const difficultyFilters = [
  { label: 'Alle', value: 'alle' },
  { label: 'Nem', value: 'nem' },
  { label: 'Mellem', value: 'mellem' },
  { label: 'Svær', value: 'svær' },
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

function FilterSection({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function FilterButton({
  label,
  isSelected,
  href,
}: {
  label: string
  isSelected: boolean
  href: string
}) {
        return (
        <Button
            variant={isSelected ? 'primary' : 'outline'}
      href={href}
          className="text-sm"
        >
      {label}
        </Button>
  )
}


export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const searchQuery = (params.q as string)?.toLowerCase() || ''
  const mealType = (params.maaltid as string)?.toLowerCase() || ''
  const dishType = (params.rettype as string)?.toLowerCase() || ''
  const cookingMethod = (params.tilberedning as string)?.toLowerCase() || ''
  const dietary = (params.diaet as string)?.toLowerCase() || ''
  const timeFilter = (params.tid as string) || ''
  const difficultyFilter = (params.svaerhed as string)?.toLowerCase() || ''
  const currentPage = Math.max(1, parseInt((params.page as string) || '1', 10))
  const recipesPerPage = 10

  // Normalize dietary options
  let normalizedDietary = dietary
  if (dietary === 'low-carb-keto') {
    normalizedDietary = 'low carb / keto'
  } else if (dietary === 'vegansk-plantebaseret') {
    normalizedDietary = 'vegansk / plantebaseret'
  }

  // Hent alle opskrifter fra JSON-filer
  const needsFullData = (normalizedDietary && ['laktosefri', 'glutenfri', 'low carb / keto', 'vegansk / plantebaseret'].includes(normalizedDietary)) || 
                        (cookingMethod && cookingMethod !== 'alle')
  const recipeList = getAllRecipes()
  const fullRecipes = needsFullData ? getAllRecipesWithData() : null
  const recipes = needsFullData 
    ? recipeList.map(item => {
        const full = fullRecipes?.find(r => r.slug === item.slug)
        return full ? { ...item, fullRecipe: full } : item
      })
    : recipeList

  // Helper function to determine meal type from recipe
  function getMealType(recipe: RecipeListItem): string {
    const titleLower = recipe.title.toLowerCase()
    const excerptLower = recipe.excerpt.toLowerCase()
    const categoryLower = recipe.category.toLowerCase()

    // Julemad
    if (titleLower.includes('jule') || excerptLower.includes('jule') || titleLower.includes('gløgg') || titleLower.includes('æbleskiver') || titleLower.includes('risengrød')) {
      return 'julemad'
    }

    // Morgenmad
    if (titleLower.includes('pandekage') || titleLower.includes('omelet') || titleLower.includes('æggekage') || titleLower.includes('granola') || titleLower.includes('boller') || titleLower.includes('brød') || titleLower.includes('bagel') || categoryLower === 'morgenmad') {
      return 'morgenmad'
    }

    // Frokost
    if (titleLower.includes('sandwich') || titleLower.includes('salat') || categoryLower === 'frokost') {
      return 'frokost'
    }

    // Dessert
    if (categoryLower === 'dessert' || titleLower.includes('kage') || titleLower.includes('cookie') || titleLower.includes('is') || titleLower.includes('dessert') || titleLower.includes('chokolade') || titleLower.includes('pudding')) {
      return 'dessert'
    }

    // Snack
    if (titleLower.includes('snack') || titleLower.includes('chips') || titleLower.includes('nuggets') || titleLower.includes('tender')) {
      return 'snack'
    }

    // Default to aftensmad
    return 'aftensmad'
  }

  // Helper function to determine dish type
  function getDishType(recipe: RecipeListItem, fullRecipe?: Recipe): string {
    const categoryLower = recipe.category.toLowerCase()
    const titleLower = recipe.title.toLowerCase()

    if (categoryLower === 'kød') return 'kød'
    if (categoryLower === 'fisk') return 'fisk'
    if (categoryLower === 'vegetarisk') return 'vegetarisk'
    if (categoryLower === 'pasta' || titleLower.includes('pasta')) return 'pasta'
    if (titleLower.includes('salat')) return 'salat'
    if (titleLower.includes('sovs')) return 'sovs'
    if (titleLower.includes('brød') || titleLower.includes('boller') || titleLower.includes('bagel') || titleLower.includes('bageri')) return 'brød-bageri'
    
    return 'alle'
  }

  // Helper function to determine cooking method
  function getCookingMethod(recipe: RecipeListItem & { fullRecipe?: Recipe }): string {
    const titleLower = recipe.title.toLowerCase()
    const excerptLower = recipe.excerpt.toLowerCase()
    const fullRecipe = 'fullRecipe' in recipe ? recipe.fullRecipe : undefined
    const recipeText = fullRecipe ? JSON.stringify(fullRecipe).toLowerCase() : ''

    // Check for airfryer
    if (titleLower.includes('airfryer') || titleLower.includes('air fryer') || titleLower.includes('air-fryer') || 
        titleLower.includes('luftfritør') || titleLower.includes('luft fritør') ||
        excerptLower.includes('airfryer') || excerptLower.includes('air fryer') || excerptLower.includes('air-fryer') ||
        excerptLower.includes('luftfritør') || excerptLower.includes('luft fritør') ||
        recipeText.includes('airfryer') || recipeText.includes('air fryer') || recipeText.includes('air-fryer') ||
        recipeText.includes('luftfritør') || recipeText.includes('luft fritør')) {
      return 'airfryer'
    }

    // Check for oven
    if (titleLower.includes('ovn') || excerptLower.includes('ovn') || 
        recipeText.includes('ovn') || recipeText.includes('bages') || 
        recipeText.includes('bagt') || recipeText.includes('oven')) {
      return 'ovn'
    }

    // Check for pan
    if (titleLower.includes('pande') || excerptLower.includes('pande') || 
        recipeText.includes('pande') || recipeText.includes('stege') ||
        recipeText.includes('pan')) {
      return 'pande'
    }

    // Check for grill
    if (titleLower.includes('gril') || excerptLower.includes('gril') || 
        recipeText.includes('gril') || recipeText.includes('grill')) {
      return 'gril'
    }

    return 'alle'
  }

  // Filtrer opskrifter baseret på alle søgeparametre
  let filteredRecipes = recipes.filter((recipe) => {
    // Søg i titel og beskrivelse
    if (searchQuery) {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery) ||
        recipe.excerpt.toLowerCase().includes(searchQuery)
      if (!matchesSearch) return false
    }

    // Filtrer efter måltidstype
    if (mealType && mealType !== 'alle') {
      const recipeMealType = getMealType(recipe)
      if (recipeMealType !== mealType) return false
    }

    // Filtrer efter rettype
    if (dishType && dishType !== 'alle') {
      const fullRecipe = 'fullRecipe' in recipe ? (recipe as RecipeListItem & { fullRecipe?: Recipe }).fullRecipe : undefined
      const recipeDishType = getDishType(recipe, fullRecipe)
      if (recipeDishType !== dishType) return false
    }

    // Filtrer efter tilberedningsmetode
    if (cookingMethod && cookingMethod !== 'alle') {
      const recipeCookingMethod = getCookingMethod(recipe as RecipeListItem & { fullRecipe?: Recipe })
      if (recipeCookingMethod !== cookingMethod) return false
    }

    // Filtrer efter diæt
    if (normalizedDietary) {
      const titleLower = recipe.title.toLowerCase()
      const excerptLower = recipe.excerpt.toLowerCase()
      const fullRecipe = 'fullRecipe' in recipe ? (recipe as RecipeListItem & { fullRecipe?: Recipe }).fullRecipe : undefined

      if (normalizedDietary === 'laktosefri') {
        if (!fullRecipe) return false
        const recipeText = JSON.stringify(fullRecipe).toLowerCase()
        const hasLactose = /mælk|smør|ost|fløde|yoghurt|creme|cheese|butter|milk|cream/i.test(recipeText)
        if (hasLactose && !titleLower.includes('laktosefri') && !excerptLower.includes('laktosefri')) {
          return false
        }
      } else if (normalizedDietary === 'glutenfri') {
        if (!fullRecipe) return false
        const recipeText = JSON.stringify(fullRecipe).toLowerCase()
        const hasGluten = /hvedemel|rugmel|gluten|pasta|brød|boller|kage|wheat|flour|bread/i.test(recipeText)
        if (hasGluten && !titleLower.includes('glutenfri') && !excerptLower.includes('glutenfri')) {
          return false
        }
      } else if (normalizedDietary === 'low carb / keto') {
        if (!fullRecipe) return false
        const carbsMatch = fullRecipe.nutrition?.carbs?.match(/(\d+)g/)
        if (carbsMatch) {
          const carbs = parseInt(carbsMatch[1])
          if (carbs > 20 && !titleLower.includes('low carb') && !titleLower.includes('keto') && !excerptLower.includes('low carb') && !excerptLower.includes('keto')) {
            return false
          }
        } else {
          const recipeText = JSON.stringify(fullRecipe).toLowerCase()
          const hasHighCarbs = /mel|sukker|ris|pasta|brød|kartofler|kartofel|flour|sugar|rice|bread|potato/i.test(recipeText)
          if (hasHighCarbs && !titleLower.includes('low carb') && !titleLower.includes('keto') && !excerptLower.includes('low carb') && !excerptLower.includes('keto')) {
          return false
        }
      }
      } else if (normalizedDietary === 'vegansk / plantebaseret') {
        if (!fullRecipe) return false
        const recipeText = JSON.stringify(fullRecipe).toLowerCase()
        const hasAnimalProducts = /kød|okse|lam|svin|kylling|fisk|æg|mælk|smør|ost|fløde|yoghurt|creme|cheese|honning|meat|beef|lamb|pork|chicken|fish|egg|milk|butter|cheese|cream|honey/i.test(recipeText)
        if (hasAnimalProducts && !titleLower.includes('vegansk') && !titleLower.includes('plantebaseret') && !excerptLower.includes('vegansk') && !excerptLower.includes('plantebaseret')) {
          return false
        }
      }
    }

    // Filtrer efter tid
    if (timeFilter && timeFilter !== 'alle') {
      const maxTime = parseInt(timeFilter)
      if (!isNaN(maxTime)) {
        const timeStr = recipe.time.toLowerCase()
        if (timeStr.includes('timer') || timeStr.includes('time')) {
          return false
        }
        const recipeTime = parseInt(recipe.time)
        if (isNaN(recipeTime) || recipeTime > maxTime) {
          return false
        }
      }
    }

    // Filtrer efter sværhedsgrad
    if (difficultyFilter && difficultyFilter !== 'alle') {
      const difficultyLower = recipe.difficulty.toLowerCase()
      if (difficultyLower !== difficultyFilter) {
        return false
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


  // Build URL with params
  function buildUrl(newParams: Record<string, string | null>, resetPage = false) {
    const params = new URLSearchParams()
    const allParams = { 
      mealType: newParams.mealType !== undefined ? newParams.mealType : mealType,
      dishType: newParams.dishType !== undefined ? newParams.dishType : dishType,
      cookingMethod: newParams.cookingMethod !== undefined ? newParams.cookingMethod : cookingMethod,
      dietary: newParams.dietary !== undefined ? newParams.dietary : dietary,
      timeFilter: newParams.timeFilter !== undefined ? newParams.timeFilter : timeFilter,
      difficultyFilter: newParams.difficultyFilter !== undefined ? newParams.difficultyFilter : difficultyFilter,
      page: newParams.page !== undefined ? newParams.page : (resetPage ? null : (currentPage > 1 ? currentPage.toString() : null)),
    }
    
    Object.entries(allParams).forEach(([key, value]) => {
      if (value && value !== 'alle') {
        const paramKey = key === 'mealType' ? 'maaltid' : 
                        key === 'dishType' ? 'rettype' :
                        key === 'cookingMethod' ? 'tilberedning' :
                        key === 'dietary' ? 'diaet' :
                        key === 'timeFilter' ? 'tid' :
                        key === 'difficultyFilter' ? 'svaerhed' :
                        key === 'page' ? 'page' : key
        // Only include page if it's not 1
        if (key === 'page' && value === '1') {
          return
        }
        params.set(paramKey, value)
      }
    })
    
    const queryString = params.toString()
    return queryString ? `/opskrifter?${queryString}` : '/opskrifter'
  }

  const hasActiveFilters = mealType || dishType || cookingMethod || dietary || timeFilter || difficultyFilter

  // Pagination calculations
  const totalRecipes = filteredRecipes.length
  const totalPages = Math.ceil(totalRecipes / recipesPerPage)
  const startIndex = (currentPage - 1) * recipesPerPage
  const endIndex = startIndex + recipesPerPage
  const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex)

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

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

        {/* Filtreringssektion */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filtrer</h2>
          </div>

          <div className="space-y-6">
            <FilterSection title="Måltid">
              {mealTypes.map((type) => (
                <FilterButton
                  key={type.value}
                  label={type.label}
                  isSelected={type.value === 'alle' ? !mealType : mealType === type.value}
                  href={buildUrl({ mealType: type.value === 'alle' ? null : type.value }, true)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Rettype">
              {dishTypes.map((type) => (
                <FilterButton
                  key={type.value}
                  label={type.label}
                  isSelected={type.value === 'alle' ? !dishType : dishType === type.value}
                  href={buildUrl({ dishType: type.value === 'alle' ? null : type.value }, true)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Tilberedningsmetode">
              {cookingMethods.map((method) => (
                <FilterButton
                  key={method.value}
                  label={method.label}
                  isSelected={method.value === 'alle' ? !cookingMethod : cookingMethod === method.value}
                  href={buildUrl({ cookingMethod: method.value === 'alle' ? null : method.value }, true)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Diæt & Præferencer">
              {dietaryOptions.map((option) => (
                <FilterButton
                  key={option.value}
                  label={option.label}
                  isSelected={dietary === option.value}
                  href={buildUrl({ dietary: dietary === option.value ? null : option.value }, true)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Tid">
              {timeFilters.map((filter) => (
                <FilterButton
                  key={filter.value}
                  label={filter.label}
                  isSelected={filter.value === 'alle' ? !timeFilter : timeFilter === filter.value}
                  href={buildUrl({ timeFilter: filter.value === 'alle' ? null : filter.value }, true)}
                />
              ))}
            </FilterSection>

            <FilterSection title="Sværhedsgrad">
              {difficultyFilters.map((filter) => (
                <FilterButton
                  key={filter.value}
                  label={filter.label}
                  isSelected={filter.value === 'alle' ? !difficultyFilter : difficultyFilter === filter.value}
                  href={buildUrl({ difficultyFilter: filter.value === 'alle' ? null : filter.value }, true)}
                />
              ))}
            </FilterSection>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="font-semibold text-gray-900 dark:text-gray-50">
                Aktive filtre:
              </span>
              {mealType && mealType !== 'alle' && (
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {mealTypes.find(m => m.value === mealType)?.label}
                </span>
              )}
              {dishType && dishType !== 'alle' && (
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {dishTypes.find(d => d.value === dishType)?.label}
                </span>
              )}
              {cookingMethod && cookingMethod !== 'alle' && (
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {cookingMethods.find(m => m.value === cookingMethod)?.label}
                </span>
              )}
              {dietary && (
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {dietaryOptions.find(d => d.value === dietary)?.label}
                </span>
              )}
              {timeFilter && timeFilter !== 'alle' && (
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  Max {timeFilter} min
                </span>
              )}
              {difficultyFilter && difficultyFilter !== 'alle' && (
                <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
                  {difficultyFilters.find(d => d.value === difficultyFilter)?.label}
                </span>
              )}
            </div>
            <Link
              href="/opskrifter"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 underline"
            >
              Ryd alle filtre
            </Link>
          </div>
        )}

        {/* Resultater */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {totalRecipes} {totalRecipes === 1 ? 'opskrift fundet' : 'opskrifter fundet'}
            {totalPages > 1 && (
              <span className="ml-2">
                (Side {currentPage} af {totalPages})
              </span>
            )}
          </p>
        </div>

        {paginatedRecipes.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {paginatedRecipes.map((recipe) => (
                <RecipeCard key={recipe.slug} {...recipe} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                {/* Previous Button */}
                {currentPage > 1 ? (
                  <Button
                    href={buildUrl({ page: (currentPage - 1).toString() })}
                    variant="outline"
                  >
                    Forrige
                  </Button>
                ) : (
                  <span className="inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)] rounded-full border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/20 text-base font-medium whitespace-nowrap text-gray-950 dark:text-gray-50 opacity-50 cursor-not-allowed">
                    Forrige
                  </span>
                )}

                {/* Page Numbers */}
                <div className="flex items-center gap-1 flex-wrap justify-center">
                  {getPageNumbers().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 dark:text-gray-400">
                          ...
                        </span>
                      )
                    }
                    const pageNum = page as number
                    const isActive = pageNum === currentPage
                    return (
                      <Button
                        key={pageNum}
                        href={pageNum === 1 ? buildUrl({ page: null }) : buildUrl({ page: pageNum.toString() })}
                        variant={isActive ? 'primary' : 'outline'}
                        className={isActive ? '' : 'min-w-[2.5rem]'}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                {/* Next Button */}
                {currentPage < totalPages ? (
                  <Button
                    href={buildUrl({ page: (currentPage + 1).toString() })}
                    variant="outline"
                  >
                    Næste
                  </Button>
                ) : (
                  <span className="inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)] rounded-full border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/20 text-base font-medium whitespace-nowrap text-gray-950 dark:text-gray-50 opacity-50 cursor-not-allowed">
                    Næste
                  </span>
                )}
              </div>
            )}
          </>
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
