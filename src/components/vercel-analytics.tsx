'use client'

import { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

function getCookiePreferences() {
  if (typeof window === 'undefined') return false
  
  try {
    const preferences = localStorage.getItem('cookie-preferences')
    if (!preferences) return false
    
    const parsed = JSON.parse(preferences)
    return parsed.analytics === true
  } catch {
    return false
  }
}

export function VercelAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check initial consent
    const initialConsent = getCookiePreferences()
    setHasConsent(initialConsent)

    // Listen for consent changes
    const handleConsentChange = () => {
      const newConsent = getCookiePreferences()
      setHasConsent(newConsent)
    }

    // Listen for storage changes (when user updates preferences in another tab)
    window.addEventListener('storage', handleConsentChange)
    
    // Listen for custom events (for same-tab updates)
    window.addEventListener('cookie-preferences-changed', handleConsentChange)

    return () => {
      window.removeEventListener('storage', handleConsentChange)
      window.removeEventListener('cookie-preferences-changed', handleConsentChange)
    }
  }, [])

  // Only render Analytics if consent is given
  if (!hasConsent) {
    return null
  }

  return <Analytics mode="production" />
}

