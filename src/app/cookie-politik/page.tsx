import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Politik',
  description: 'Læs om hvordan vi bruger cookies på Simpel Spis',
}

export default function CookiePolitikPage() {
  return (
    <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <GradientBackground />
      <Navbar />
      <Container className="mt-28 pb-24">
        <Subheading>Cookie Politik</Subheading>
        <Heading as="h1" className="mt-2">
          Hvordan vi bruger cookies
        </Heading>

        <div className="mt-8 max-w-3xl space-y-6 text-base/7 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvad er cookies?
            </h2>
            <p>
              Cookies er små tekstfiler, der gemmes på din enhed (computer, tablet eller mobil), 
              når du besøger en hjemmeside. De bruges til at huske dine præferencer og forbedre 
              din oplevelse på hjemmesiden.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvilke cookies bruger vi?
            </h2>
            <p className="mb-3">
              Vi bruger kun nødvendige cookies til at håndtere din login-session. Disse cookies er 
              essentielle for, at du kan logge ind og forblive logget ind på vores hjemmeside.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Session cookies:</strong> Disse cookies gemmes kun midlertidigt og slettes, 
                når du lukker din browser. De bruges til at håndtere din login-session.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvad bruger vi cookies til?
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>At håndtere din login-session</li>
              <li>At huske, at du er logget ind</li>
              <li>At sikre, at du kan skrive anmeldelser og give stjerner</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Deler vi dine data?
            </h2>
            <p>
              <strong>Nej.</strong> Vi deler ikke dine data med tredjeparter. Vi bruger kun cookies 
              til at håndtere din login-session internt på vores hjemmeside. Vi bruger ikke 
              marketing-cookies, tracking-cookies eller analytics-cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvordan kan du administrere cookies?
            </h2>
            <p className="mb-3">
              Du kan til enhver tid slette cookies fra din browser. Bemærk, at hvis du sletter 
              cookies, kan det påvirke din oplevelse på hjemmesiden, og du kan blive nødt til 
              at logge ind igen.
            </p>
            <p className="mb-3">
              <strong>Vigtigt:</strong> Hvis du afviser cookies, kan du <strong>ikke</strong> logge ind 
              eller skrive anmeldelser. Cookies er nødvendige for at håndtere din login-session og 
              sikre, at du forbliver logget ind.
            </p>
            <p className="mb-3">
              Hvis du accepterer cookies, kan du logge ind og bruge alle funktioner på hjemmesiden. 
              Vi bruger kun cookies til at håndtere din login-session - vi bruger ikke tracking-cookies 
              eller marketing-cookies.
            </p>
            <p>
              Du kan til enhver tid ændre dit valg ved at slette cookies fra din browser og besøge 
              hjemmesiden igen, hvor cookie-banneren vil blive vist igen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Kontakt
            </h2>
            <p>
              Hvis du har spørgsmål til vores brug af cookies, kan du kontakte os gennem vores 
              kontaktformular eller email.
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

