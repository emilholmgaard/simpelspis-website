export function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
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
              <a
                href="mailto:hej@simpelspis.dk"
                className="underline hover:text-gray-900 dark:hover:text-gray-50 font-medium"
              >
                hej@simpelspis.dk
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
