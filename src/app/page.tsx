import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { SearchForm } from '@/components/search-form'
import { Heading, Lead } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simpel Spis - Nemme Opskrifter',
  description:
    'Søg efter nemme opskrifter baseret på ingredienser, kategori eller tid. Udforsk over 211.000 nemme opskrifter fra hele verden. Fra klassiske retter til moderne fusion-køkken.',
  keywords: ['nemme opskrifter', 'søg nemme opskrifter', 'nemme madopskrifter', 'nemme opskrifter', 'hurtige nemme opskrifter', 'nemme opskrifter efter ingredienser', 'dansk mad', 'kogebog'],
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk',
  },
  openGraph: {
    title: 'Simpel Spis - Nemme Opskrifter',
    description: 'Søg efter nemme opskrifter baseret på ingredienser, kategori eller tid. Udforsk over 211.000 nemme opskrifter fra hele verden.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://simpelspis.dk',
    siteName: 'Simpel Spis',
    locale: 'da_DK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simpel Spis - Nemme Opskrifter',
    description: 'Søg efter nemme opskrifter baseret på ingredienser, kategori eller tid.',
  },
}

export default function Home() {
  return (
    <main className="overflow-hidden min-h-screen flex flex-col">
      <GradientBackground />
      <Navbar />
      <Container className="flex-1 flex items-center justify-center py-12">
        <div className="mx-auto max-w-5xl w-full flex flex-col items-center justify-center">
          {/* Hero Header Container */}
          <div className="mb-8 text-center w-full">
            <Heading as="h1" className="text-4xl sm:text-5xl lg:text-6xl">
              Simpel Spis
            </Heading>
            <Lead className="mt-4 hidden lg:block mx-auto">
              Udforsk tusindvis af nemme opskrifter fra hele verden. Fra klassiske
              retter til moderne fusion-køkken.
            </Lead>
          </div>

          {/* Search Container */}
          <div className="mb-8 w-full max-w-4xl">
            <SearchForm />
          </div>

          {/* Counter Container */}
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold text-gray-950 dark:text-gray-50 sm:text-3xl">
                39
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
