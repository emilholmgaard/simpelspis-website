'use client'

import { useCookiePreferences } from './cookie-preferences-provider'

export function CookiePreferencesButton() {
  const { setIsModalOpen } = useCookiePreferences()

  return (
    <button
      type="button"
      onClick={() => setIsModalOpen(true)}
      aria-label="Åbn samtykkeindstillinger"
      className="fixed bottom-4 right-4 z-40 w-12 h-12 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center hover:border-gray-400 dark:hover:border-gray-600"
    >
      <div className="w-5 h-5 rounded-full border-2 border-gray-400 dark:border-gray-500" />
    </button>
  )
}

