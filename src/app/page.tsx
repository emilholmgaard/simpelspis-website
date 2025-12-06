import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Lead } from '@/components/text'
import { getAllRecipes } from '@/lib/recipes'
import { HomeSearchInput } from '@/components/home-search-input'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nemme Opskrifter',
  description:
    'Søg efter nemme opskrifter baseret på ingredienser, kategori eller tid. Udforsk over 211.000 nemme opskrifter fra hele verden. Fra klassiske retter til moderne fusion-køkken.',
  keywords: ['nemme opskrifter', 'søg nemme opskrifter', 'nemme madopskrifter', 'nemme opskrifter', 'hurtige nemme opskrifter', 'nemme opskrifter efter ingredienser', 'dansk mad', 'kogebog'],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk',
  },
  openGraph: {
    title: 'Nemme Opskrifter',
    description: 'Søg efter nemme opskrifter baseret på ingredienser, kategori eller tid. Udforsk over 211.000 nemme opskrifter fra hele verden.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk',
    siteName: 'Simpel Spis',
    locale: 'da_DK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nemme Opskrifter',
    description: 'Søg efter nemme opskrifter baseret på ingredienser, kategori eller tid.',
  },
}

export default function Home() {
  const recipes = getAllRecipes()
  const recipeCount = recipes.length

  return (
    <main className="overflow-hidden min-h-screen flex flex-col relative">
      <GradientBackground />
      {/* Bottom right gradient */}
      <div
        className="absolute -bottom-64 right-0 h-96 w-96 md:h-[500px] md:w-[500px] transform-gpu bg-linear-115 from-[#1e3a8a] from-28% via-[#1e40af] via-70% to-[#0f172a] dark:from-[#1e3a8a] dark:via-[#1e40af] dark:to-[#0f172a] rotate-12 rounded-full blur-3xl opacity-100 dark:opacity-40 -z-10"
      />
      <Navbar />
      <Container className="flex-1 flex items-center justify-center py-12 relative z-10">
        <div className="mx-auto max-w-5xl w-full flex flex-col items-center justify-center">
          {/* Hero Header Container */}
          <div className="mb-8 text-center w-full">
            <div className="relative inline-block">
              <Heading 
                as="h1" 
                className="text-4xl sm:text-5xl lg:text-6xl relative z-10 text-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]"
              >
                Simpel Spis
              </Heading>
              <Heading 
                as="h1" 
                className="text-4xl sm:text-5xl lg:text-6xl absolute inset-0 blur-2xl opacity-60 text-blue-600 pointer-events-none"
                aria-hidden="true"
              >
                Simpel Spis
              </Heading>
            </div>
            <Lead className="mt-4 hidden lg:block mx-auto">
              Udforsk hundredevis af nemme opskrifter fra hele verden. Fra klassiske
              retter til moderne fusion-køkken.
            </Lead>
          </div>

          {/* Pill Search Input */}
          <div className="mb-8 w-full max-w-2xl">
            <HomeSearchInput />
          </div>

          {/* Counter Container */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-950 dark:text-gray-50 sm:text-3xl">
                {recipeCount}
              </span>
            </div>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400 sm:text-lg">
              nemme opskrifter tilgængelige
            </span>
          </div>
        </div>
      </Container>
    </main>
  )
}
