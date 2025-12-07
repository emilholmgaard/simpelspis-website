'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from './link'
import { Logo } from './logo'
import { Button } from './button'
import { AuthModal } from './auth/auth-modal'
import { UserMenu } from './auth/user-menu'

const navigation = [
  { name: 'Nemme Opskrifter', href: '/opskrifter' },
  { name: 'Blog', href: '/blog' } // Navigation items
]

interface User {
  id: string
  email: string
  username: string | null
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/user')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.reload()
  }

  return (
    <header className="relative z-50">
      <nav aria-label="Global" className="px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl lg:max-w-6xl items-center justify-between py-6">
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Simpel Spis</span>
          <Logo className="h-12" />
        </Link>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 lg:items-center">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-base font-medium tracking-tight text-gray-950 dark:text-gray-50"
            >
              {item.name}
            </Link>
          ))}
          {!loading && (
            user ? (
              <UserMenu user={user} />
            ) : (
              <Button variant="outline" onClick={() => setAuthModalOpen(true)}>
                Log ind
              </Button>
            )
          )}
        </div>
      </div>
      </nav>
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:bg-gray-900 dark:sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Simpel Spis</span>
              <Logo className="h-12" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-medium tracking-tight text-gray-950 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-white/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {!loading && (
                  user ? (
                    <>
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                        Logget ind som {user.username || user.email}
                      </div>
                      <Link
                        href="/konto"
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-800"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Indstillinger
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          handleLogout()
                        }}
                        className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-800"
                      >
                        Log ud
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setAuthModalOpen(true)
                      }}
                      className="-mx-3 block w-full text-left rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 dark:text-gray-50 dark:hover:bg-gray-800"
                    >
                      Log ind
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </header>
  )
}
