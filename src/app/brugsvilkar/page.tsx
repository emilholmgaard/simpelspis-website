import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { EmailLink } from '@/components/email-link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brugsvilkår',
  description: 'Læs vores brugsvilkår for brug af Simpel Spis',
}

export default function BrugsvilkarPage() {
  return (
    <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <GradientBackground />
      <Navbar />
      <Container className="mt-28 pb-24">
        <Subheading>Brugsvilkår</Subheading>
        <Heading as="h1" className="mt-2">
          Vilkår for brug af Simpel Spis
        </Heading>

        <div className="mt-8 max-w-3xl space-y-6 text-base/7 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Accept af vilkår
            </h2>
            <p>
              Ved at bruge vores hjemmeside accepterer du disse brugsvilkår. 
              Hvis du ikke accepterer vilkårene, bedes du ikke bruge hjemmesiden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Brug af hjemmesiden
            </h2>
            <p className="mb-3">
              Du må bruge vores hjemmeside til personlige, ikke-kommercielle formål. 
              Du må ikke:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Bruge hjemmesiden på en måde, der krænker andres rettigheder</li>
              <li>Forsøge at få uautoriseret adgang til hjemmesiden eller relaterede systemer</li>
              <li>Indsende falske, vildledende eller stødende indhold i anmeldelser</li>
              <li>Bruge hjemmesiden til ulovlige formål</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Indhold og opskrifter
            </h2>
            <p>
              Alle opskrifter og indhold på hjemmesiden er tilgængelige til personligt 
              brug. Du må kopiere og bruge opskrifterne til personlige formål.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Anmeldelser og indhold fra brugere
            </h2>
            <p className="mb-3">
              Når du indsender en anmeldelse på hjemmesiden, giver du os ret til at:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Vise din anmeldelse på hjemmesiden</li>
              <li>Moderere og fjerne anmeldelser, der bryder vores retningslinjer</li>
            </ul>
            <p className="mt-3">
              Du er ansvarlig for, at din anmeldelse ikke indeholder stødende, 
              vildledende eller ulovligt indhold.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Ansvar og ansvarsfraskrivelse
            </h2>
            <p>
              Vi stræber efter at give præcise og opdaterede oplysninger, men vi kan 
              ikke garantere, at alle oplysninger er fejlfrie eller fuldstændige. Vi 
              påtager os ikke ansvar for skader, der opstår som følge af brug af 
              opskrifterne eller hjemmesiden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Ændringer i vilkårene
            </h2>
            <p>
              Vi forbeholder os retten til at ændre disse brugsvilkår til enhver 
              tid. Ændringer træder i kraft, når de offentliggøres på hjemmesiden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Kontakt
            </h2>
            <p>
              Hvis du har spørgsmål til vores brugsvilkår, kan du kontakte os på{' '}
              <EmailLink className="underline hover:text-gray-900 dark:hover:text-gray-50 font-medium" />
              .
            </p>
          </section>

          <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Sidst opdateret: {new Date().toLocaleDateString('da-DK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </section>
        </div>
      </Container>
    </main>
  )
}

