'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics as NextGoogleAnalytics } from '@next/third-parties/google'

const GA_MEASUREMENT_ID = 'G-CJ1SZDVENB'

// Declare gtag function for TypeScript
declare global {
  interface Window {
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

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // Check initial consent
    const initialConsent = getCookiePreferences()
    setHasConsent(initialConsent)
  }, [])

  useEffect(() => {
    // Listen for consent changes
    const handleConsentChange = () => {
      const newConsent = getCookiePreferences()
      setHasConsent(newConsent)

      if (newConsent && window.gtag) {
        // User has given consent - update consent with all Consent Mode v2 parameters
        window.gtag('consent', 'update', {
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          ad_storage: 'denied',
          analytics_storage: 'granted',
        })
      } else if (!newConsent && window.gtag) {
        // User has revoked consent - disable tracking with all Consent Mode v2 parameters
        window.gtag('consent', 'update', {
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          ad_storage: 'denied',
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

  useEffect(() => {
    // Update consent and configure GDPR settings when component mounts and consent is given
    if (hasConsent && window.gtag) {
      // Small delay to ensure gtag is available after NextGoogleAnalytics loads
      const timer = setTimeout(() => {
        if (window.gtag) {
          // Update consent with all Consent Mode v2 parameters
          window.gtag('consent', 'update', {
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            ad_storage: 'denied',
            analytics_storage: 'granted',
          })
          
          // Configure GDPR-compliant settings
          window.gtag('config', GA_MEASUREMENT_ID, {
            anonymize_ip: true,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
          })
        }
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [hasConsent])

  // Only load Google Analytics if consent is given
  if (!hasConsent) {
    return null
  }

  return (
    <NextGoogleAnalytics 
      gaId={GA_MEASUREMENT_ID}
    />
  )
}

