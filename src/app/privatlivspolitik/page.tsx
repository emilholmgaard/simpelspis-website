import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privatlivspolitik',
  description: 'Læs om hvordan vi håndterer dine personoplysninger på Simpel Spis',
}

export default function PrivatlivspolitikPage() {
  return (
    <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <GradientBackground />
      <Navbar />
      <Container className="mt-28 pb-24">
        <Subheading>Privatlivspolitik</Subheading>
        <Heading as="h1" className="mt-2">
          Hvordan vi håndterer dine personoplysninger
        </Heading>

        <div className="mt-8 max-w-3xl space-y-6 text-base/7 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Ansvar
            </h2>
            <p>
              Simpel Spis er ansvarlig for behandlingen af dine personoplysninger. 
              Vi respekterer dit privatliv og behandler dine personoplysninger i 
              overensstemmelse med gældende databeskyttelseslovgivning, herunder 
              GDPR (General Data Protection Regulation). Simpel Spis er en privat 
              hjemmeside og ikke en kommerciel virksomhed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvilke personoplysninger indsamler vi?
            </h2>
            <p className="mb-3">
              Når du opretter en konto på vores hjemmeside, indsamler vi følgende oplysninger:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Email-adresse:</strong> Bruges til at identificere dig og håndtere din konto</li>
              <li><strong>Brugernavn (valgfrit):</strong> Vises i anmeldelser i stedet for din email</li>
              <li><strong>Anmeldelser og vurderinger:</strong> De anmeldelser og stjerner du giver til opskrifter</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvorfor indsamler vi dine personoplysninger?
            </h2>
            <p className="mb-3">
              Vi indsamler og behandler dine personoplysninger for følgende formål:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>At håndtere din konto og login</li>
              <li>At give dig mulighed for at skrive anmeldelser og give vurderinger</li>
              <li>At sikre hjemmesidens funktionalitet og sikkerhed</li>
              <li>At overholde gældende lovgivning</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvordan gemmer vi dine personoplysninger?
            </h2>
            <p>
              Dine personoplysninger gemmes sikkert i vores database. Vi bruger 
              moderne sikkerhedsteknologier til at beskytte dine data mod uautoriseret 
              adgang, tab eller ødelæggelse.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Deler vi dine personoplysninger?
            </h2>
            <p>
              <strong>Nej.</strong> Vi deler ikke dine personoplysninger med tredjeparter. 
              Vi sælger ikke, udlejer ikke eller på anden måde videregiver dine 
              personoplysninger til tredjeparter.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvor længe gemmer vi dine personoplysninger?
            </h2>
            <p>
              Vi gemmer dine personoplysninger så længe du har en aktiv konto på vores 
              hjemmeside. Hvis du sletter din konto, sletter vi også alle dine 
              personoplysninger, medmindre vi er forpligtet til at bevare dem i 
              overensstemmelse med gældende lovgivning.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Dine rettigheder
            </h2>
            <p className="mb-3">
              Du har følgende rettigheder i forhold til dine personoplysninger:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Indsigtsret:</strong> Du har ret til at få oplyst, hvilke personoplysninger vi behandler om dig</li>
              <li><strong>Berigtigelsesret:</strong> Du har ret til at få berigtiget forkerte eller misvisende oplysninger</li>
              <li><strong>Sletningsret:</strong> Du har ret til at få slettet dine personoplysninger</li>
              <li><strong>Dataportabilitetsret:</strong> Du har ret til at modtage dine personoplysninger i et struktureret format</li>
              <li><strong>Indsigelsesret:</strong> Du har ret til at gøre indsigelse mod behandling af dine personoplysninger</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Cookies
            </h2>
            <p>
              Vi bruger cookies til at håndtere din login-session. Læs mere om vores 
              brug af cookies i vores{' '}
              <a href="/cookie-politik" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 underline">
                cookie-politik
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Kontakt
            </h2>
            <p>
              Hvis du har spørgsmål til vores behandling af dine personoplysninger, 
              eller hvis du ønsker at udøve dine rettigheder, kan du kontakte os på{' '}
              <a
                href="mailto:hej@simpelspis.dk"
                className="underline hover:text-gray-900 dark:hover:text-gray-50 font-medium"
              >
                hej@simpelspis.dk
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Kontakt
            </h2>
            <p>
              Hvis du har spørgsmål til vores privatlivspolitik eller ønsker at udøve dine rettigheder, 
              kan du kontakte os på{' '}
              <a
                href="mailto:hej@simpelspis.dk"
                className="underline hover:text-gray-900 dark:hover:text-gray-50 font-medium"
              >
                hej@simpelspis.dk
              </a>
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

