'use client'

import { useEffect, useState } from 'react'

const GA_MEASUREMENT_ID = 'G-CJ1SZDVENB'

// Declare gtag function for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

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

function loadGoogleAnalyticsScript() {
  // Check if script is already loaded
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`)) {
    return
  }

  // Load the gtag.js script
  const script1 = document.createElement('script')
  script1.async = true
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.appendChild(script1)

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  // Set default consent to denied (GDPR compliance)
  gtag('consent', 'default', {
    analytics_storage: 'denied',
  })

  // Configure with GDPR-compliant settings
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })
}

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check initial consent
    const initialConsent = getCookiePreferences()
    setHasConsent(initialConsent)

    // If consent is given initially, load the script
    if (initialConsent) {
      loadGoogleAnalyticsScript()
      // Small delay to ensure script is loaded
      setTimeout(() => {
        if (window.gtag) {
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
          })
        }
      }, 100)
    }

    // Listen for consent changes
    const handleConsentChange = () => {
      const newConsent = getCookiePreferences()
      setHasConsent(newConsent)

      if (newConsent) {
        // User has given consent - load script if not already loaded and enable tracking
        if (!window.gtag) {
          loadGoogleAnalyticsScript()
          setTimeout(() => {
            if (window.gtag) {
              window.gtag('consent', 'update', {
                analytics_storage: 'granted',
              })
            }
          }, 100)
        } else {
          // Script already loaded, just update consent
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
          })
        }
      } else if (!newConsent && window.gtag) {
        // User has revoked consent - disable tracking
        window.gtag('consent', 'update', {
          analytics_storage: 'denied',
        })
      }
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

  // This component doesn't render anything - it handles script loading via useEffect
  return null
}

