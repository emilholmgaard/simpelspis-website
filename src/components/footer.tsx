import { EmailLink } from '@/components/email-link'

export function Footer() {
  return (
    <footer>
      <div className="p-4 sm:p-8 relative overflow-hidden rounded-lg bg-gray-950/[2.5%] after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-1 after:ring-inset after:ring-gray-950/5 dark:after:ring-white/10 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--color-gray-950)]/5 dark:[--pattern-fg:var(--color-white)]/10">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8 relative z-10">
          <div className="mt-8 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0 dark:text-gray-400">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span>
                &copy; {new Date().getFullYear()} Simpel Spis. Alle rettigheder forbeholdes.
              </span>
              <span className="text-gray-400">•</span>
              <a
                href="/cookie-politik"
                className="underline hover:text-gray-900 dark:hover:text-gray-50"
              >
                Cookie politik
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="/privatlivspolitik"
                className="underline hover:text-gray-900 dark:hover:text-gray-50"
              >
                Privatlivspolitik
              </a>
              <span className="text-gray-400">•</span>
              <a
                href="/brugsvilkar"
                className="underline hover:text-gray-900 dark:hover:text-gray-50"
              >
                Brugsvilkår
              </a>
              <span className="text-gray-400">•</span>
              <span>
                Kontakt os på{' '}
                <EmailLink className="underline hover:text-gray-900 dark:hover:text-gray-50 font-medium" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
