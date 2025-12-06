export function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <p className="mt-8 text-center text-sm/6 text-gray-600 md:order-1 md:mt-0 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Simpel Spis. Alle rettigheder forbeholdes.
        </p>
      </div>
    </footer>
  )
}
