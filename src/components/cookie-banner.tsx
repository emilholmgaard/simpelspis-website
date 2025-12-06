'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from './button'
import { Link } from './link'

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    // Delete any existing auth cookies
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      if (name.startsWith('sb-')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      }
    })
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
              Vi bruger cookies
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vi bruger kun nødvendige cookies til at håndtere din login-session. 
              Disse cookies er påkrævet for at logge ind og skrive anmeldelser. 
              Hvis du afviser cookies, kan du ikke logge ind eller skrive anmeldelser. 
              Vi deler ikke dine data med tredjeparter.{' '}
              <Link
                href="/cookie-politik"
                className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
              >
                Læs mere
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-3 lg:flex-shrink-0">
            <Button variant="outline" onClick={handleReject} className="text-sm">
              Afvis
            </Button>
            <Button onClick={handleAccept} className="text-sm">
              Accepter
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

