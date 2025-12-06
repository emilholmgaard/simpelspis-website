import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Lead, Subheading } from '@/components/text'

export default function NotFound() {
  return (
    <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <GradientBackground />
      <Navbar />
      <Container className="mt-28 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-2xl">
          <Heading as="h1" className="text-6xl sm:text-7xl mb-6">
            404
          </Heading>
          <Subheading as="p" className="mb-4">Opskrift Ikke Fundet</Subheading>
          <Lead className="mb-8">
            Denne opskrift er desværre forsvundet... måske blev den spist? 🍽️
          </Lead>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Vi har ledt overalt, men kunne ikke finde den opskrift du leder efter. 
            Måske den blev for varm i ovnen, eller måske den blev serveret for hurtigt?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/opskrifter" variant="primary">
              Se alle opskrifter
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

