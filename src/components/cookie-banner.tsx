'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Button } from './button'
import { Link } from './link'
import { useCookiePreferences } from './cookie-preferences-provider'

interface CookiePreferences {
  essential: boolean
  marketing: boolean
  analytics: boolean
  functional: boolean
}

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const { isModalOpen, setIsModalOpen } = useCookiePreferences()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always enabled
    marketing: false,
    analytics: false,
    functional: false,
  })

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('cookie-consent')
    const savedPreferences = localStorage.getItem('cookie-preferences')
    
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences)
        setPreferences(parsed)
      } catch {
        // Invalid preferences, use defaults
      }
    }
    
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-preferences', JSON.stringify({
      essential: true,
      marketing: true,
      analytics: true,
      functional: true,
    }))
    // Dispatch event for Google Analytics to listen to
    window.dispatchEvent(new Event('cookie-preferences-changed'))
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    localStorage.setItem('cookie-preferences', JSON.stringify({
      essential: true,
      marketing: false,
      analytics: false,
      functional: false,
    }))
    // Dispatch event for Google Analytics to listen to
    window.dispatchEvent(new Event('cookie-preferences-changed'))
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

  const handleSave = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences))
    // Dispatch event for Google Analytics to listen to
    window.dispatchEvent(new Event('cookie-preferences-changed'))
    setIsModalOpen(false)
    setIsVisible(false)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return // Essential cannot be toggled
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  return (
    <>
      {isVisible && !isModalOpen && (
        <div className="fixed bottom-4 left-4 z-50 max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-lg">
        <div className="px-6 py-4">
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
                Dit Privatliv
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Denne side bruger tracking-teknologier. Du kan vælge at tilmelde eller framelde brugen af disse teknologier.{' '}
                <Link
                  href="/cookie-politik"
                  className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 underline"
                >
                  Privatlivspolitik
                </Link>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button variant="outline" onClick={handleReject} className="text-sm">
                Afvis
              </Button>
              <Button onClick={handleAccept} className="text-sm">
                Accepter alle
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(true)}
                className="text-sm"
              >
                Samtykkeindstillinger
              </Button>
            </div>
          </div>
        </div>
      </div>
      )}

      <CookiePreferencesModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        preferences={preferences}
        expandedCategories={expandedCategories}
        toggleCategory={toggleCategory}
        togglePreference={togglePreference}
        handleSave={handleSave}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
    </>
  )
}

function CookiePreferencesModal({
  isModalOpen,
  setIsModalOpen,
  preferences,
  expandedCategories,
  toggleCategory,
  togglePreference,
  handleSave,
  handleAccept,
  handleReject,
}: {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
  preferences: CookiePreferences
  expandedCategories: Set<string>
  toggleCategory: (category: string) => void
  togglePreference: (key: keyof CookiePreferences) => void
  handleSave: () => void
  handleAccept: () => void
  handleReject: () => void
}) {
  return (
    <Dialog open={isModalOpen} onClose={setIsModalOpen} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  Dit Privatliv
                </h2>
                <Button
                  variant="outline"
                  href="/cookie-politik"
                  className="text-sm"
                >
                  Privatlivspolitik
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Luk modal"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Denne side bruger tracking-teknologier. Du kan vælge at tilmelde eller framelde brugen af disse teknologier.
              </p>

              <div className="space-y-4">
                {/* Essential */}
                <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => toggleCategory('essential')}
                        className="flex items-center justify-between w-full text-left"
                        aria-expanded={expandedCategories.has('essential')}
                        aria-controls="essential-description"
                      >
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">
                          Nødvendige
                        </h3>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${
                            expandedCategories.has('essential') ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {expandedCategories.has('essential') && (
                        <div id="essential-description" className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Nødvendige cookies og tjenester bruges til at aktivere kernesidefunktioner, såsom at sikre webstedets sikkerhed.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 cursor-not-allowed">
                        <span className="inline-block h-4 w-4 transform translate-x-6 rounded-full bg-white transition" />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Til</span>
                    </div>
                  </div>
                </div>

                {/* Marketing */}
                <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => toggleCategory('marketing')}
                        className="flex items-center justify-between w-full text-left"
                        aria-expanded={expandedCategories.has('marketing')}
                        aria-controls="marketing-description"
                      >
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">
                          Marketing
                        </h3>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${
                            expandedCategories.has('marketing') ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {expandedCategories.has('marketing') && (
                        <div id="marketing-description" className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Marketing cookies og tjenester bruges til at levere personificerede annoncer, kampagner og tilbud. Disse teknologier muliggør målrettet reklame og marketingkampagner ved at indsamle oplysninger om brugernes interesser, præferencer og onlineaktiviteter.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePreference('marketing')
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.marketing
                            ? 'bg-blue-600 dark:bg-blue-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        aria-label="Marketing cookies"
                        role="switch"
                        aria-checked={preferences.marketing}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            preferences.marketing ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {preferences.marketing ? 'Til' : 'Fra'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Analytics */}
                <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => toggleCategory('analytics')}
                        className="flex items-center justify-between w-full text-left"
                        aria-expanded={expandedCategories.has('analytics')}
                        aria-controls="analytics-description"
                      >
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">
                          Analyse
                        </h3>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${
                            expandedCategories.has('analytics') ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {expandedCategories.has('analytics') && (
                        <div id="analytics-description" className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Analyse cookies og tjenester bruges til at indsamle statistiske oplysninger om, hvordan besøgende interagerer med et websted. Disse teknologier giver indsigt i webstedsbrug, besøgeradfærd og sideydelse for at forstå og forbedre webstedet og forbedre brugeroplevelsen.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePreference('analytics')
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.analytics
                            ? 'bg-blue-600 dark:bg-blue-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        aria-label="Analytics cookies"
                        role="switch"
                        aria-checked={preferences.analytics}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            preferences.analytics ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {preferences.analytics ? 'Til' : 'Fra'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Functional */}
                <div className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => toggleCategory('functional')}
                        className="flex items-center justify-between w-full text-left"
                        aria-expanded={expandedCategories.has('functional')}
                        aria-controls="functional-description"
                      >
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-50">
                          Funktionelle
                        </h3>
                        <ChevronDownIcon
                          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${
                            expandedCategories.has('functional') ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                      {expandedCategories.has('functional') && (
                        <div id="functional-description" className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Funktionelle cookies og tjenester bruges til at tilbyde forbedrede og personificerede funktioner. Disse teknologier giver yderligere funktioner og forbedrede brugeroplevelser, såsom at huske dine sprogpræferencer, skriftstørrelser, regionsvalg og tilpassede layouts. Hvis du framelder disse cookies, kan visse tjenester eller funktionalitet på webstedet blive utilgængelig.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePreference('functional')
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          preferences.functional
                            ? 'bg-blue-600 dark:bg-blue-500'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                        aria-label="Functional cookies"
                        role="switch"
                        aria-checked={preferences.functional}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            preferences.functional ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {preferences.functional ? 'Til' : 'Fra'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" onClick={handleReject} className="text-sm">
                    Afvis
                  </Button>
                  <Button onClick={handleAccept} className="text-sm">
                    Accepter alle
                  </Button>
                </div>
                <Button onClick={handleSave} className="text-sm">
                  Gem
                </Button>
              </div>
            </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

