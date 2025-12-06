'use client'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to an error reporting service
    console.error('Error:', error)
  }, [error])

  return (
    <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <GradientBackground />
      <Navbar />
      <Container className="mt-28 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-2xl">
          <Heading as="h1" className="text-6xl sm:text-7xl mb-6">
            Oops!
          </Heading>
          <Subheading as="p" className="mb-4">Noget Gik Galt</Subheading>
          <Lead className="mb-8">
            Det ser ud til at noget brændte på... eller måske gik vi tom for ingredienser? 🔥
          </Lead>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Vi har stødt på en fejl i køkkenet. Måske blev opskriften for kompliceret, 
            eller måske mangler vi bare lidt mere salt? Prøv at genindlæse siden, eller 
            vend tilbage til vores opskrifter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} variant="primary">
              Prøv igen
            </Button>
            <Button href="/opskrifter" variant="outline">
              Se opskrifter
            </Button>
            <Button href="/" variant="outline">
              Tilbage til forsiden
            </Button>
          </div>
        </div>
      </Container>
    </main>
  )
}

