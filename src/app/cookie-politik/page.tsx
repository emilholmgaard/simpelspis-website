import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { EmailLink } from '@/components/email-link'
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
              Vi bruger forskellige typer cookies afhængigt af dine præferencer:
            </p>
            
            <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-50 mt-4 mb-2">
              Nødvendige cookies
            </h3>
            <p className="mb-3">
              Disse cookies er essentielle for, at hjemmesiden fungerer korrekt. De bruges til at håndtere 
              din login-session og sikre, at du kan logge ind og forblive logget ind.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>
                <strong>Session cookies:</strong> Disse cookies gemmes kun midlertidigt og slettes, 
                når du lukker din browser. De bruges til at håndtere din login-session.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-50 mt-4 mb-2">
              Analyse cookies (kun hvis du giver samtykke)
            </h3>
            <p className="mb-3">
              Hvis du giver samtykke til analyse cookies, bruger vi analyseværktøjer til at indsamle 
              anonymiseret statistik om, hvordan besøgende bruger hjemmesiden. Dette hjælper os med 
              at forbedre hjemmesiden og forstå, hvilke sider der er mest populære.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>
                <strong>Google Analytics:</strong> Vi bruger Google Analytics til at indsamle anonymiseret 
                data om besøg på hjemmesiden. IP-adresser anonymiseres automatisk, og vi deler ikke 
                personlige oplysninger med Google. Du kan til enhver tid framelde analyse cookies i 
                cookie-indstillingerne.
              </li>
              <li>
                <strong>Vercel Analytics:</strong> Vi bruger Vercel Analytics til at indsamle anonymiseret 
                data om hjemmesidens ydeevne og brug. Dette hjælper os med at forbedre hjemmesidens hastighed 
                og brugeroplevelse. Data er anonymiseret og deles ikke med tredjeparter.
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
              <li>At indsamle anonymiseret statistik om hjemmesidens brug (kun hvis du giver samtykke til analyse cookies)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Deler vi dine data?
            </h2>
            <p className="mb-3">
              <strong>Nødvendige cookies:</strong> Vi deler ikke dine data med tredjeparter. Vi bruger kun 
              cookies til at håndtere din login-session internt på vores hjemmeside.
            </p>
            <p className="mb-3">
              <strong>Analyse cookies (kun hvis du giver samtykke):</strong> Hvis du giver samtykke til 
              analyse cookies, bruger vi Google Analytics og Vercel Analytics. Disse værktøjer indsamler 
              anonymiseret data, og IP-adresser anonymiseres automatisk. Vi deler ikke personlige 
              oplysninger eller identificerbare data med tredjeparter. Data bruges kun til at forstå, 
              hvordan hjemmesiden bruges, så vi kan forbedre den.
            </p>
            <p>
              Vi bruger <strong>ikke</strong> marketing-cookies eller tracking-cookies til reklamer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Hvordan kan du administrere cookies?
            </h2>
            <p className="mb-3">
              Du kan til enhver tid administrere dine cookie-præferencer ved at klikke på 
              &quot;Cookie-indstillinger&quot; knappen i bunden af hjemmesiden. Her kan du vælge, hvilke typer 
              cookies du vil acceptere.
            </p>
            <p className="mb-3">
              <strong>Nødvendige cookies:</strong> Disse cookies er altid aktive og kan ikke deaktiveres, 
              da de er nødvendige for, at hjemmesiden fungerer korrekt. Hvis du afviser alle cookies, 
              kan du <strong>ikke</strong> logge ind eller skrive anmeldelser.
            </p>
            <p className="mb-3">
              <strong>Analyse cookies:</strong> Du kan til enhver tid tilmelde eller framelde analyse cookies. 
              Hvis du framelder analyse cookies, vil Google Analytics ikke indsamle data om dit besøg. 
              Du kan ændre dette valg når som helst i cookie-indstillingerne.
            </p>
            <p className="mb-3">
              Du kan også slette cookies direkte fra din browser. Bemærk, at hvis du sletter cookies, 
              kan det påvirke din oplevelse på hjemmesiden, og du kan blive nødt til at logge ind igen.
            </p>
            <p>
              Hvis du sletter alle cookies og besøger hjemmesiden igen, vil cookie-banneren blive vist igen, 
              så du kan vælge dine præferencer på ny.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-3">
              Kontakt
            </h2>
            <p>
              Hvis du har spørgsmål til vores brug af cookies, kan du kontakte os på{' '}
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

