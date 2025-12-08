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

function updateConsent(granted: boolean) {
  if (typeof window === 'undefined' || !window.gtag || typeof window.gtag !== 'function') return
  
  window.gtag('consent', 'update', {
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    ad_storage: 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  })
  
  if (granted) {
    // Configure GDPR-compliant settings when consent is granted
    window.gtag('config', GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
  }
}

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  // Check initial consent on mount
  useEffect(() => {
    const checkConsent = () => {
      const consent = getCookiePreferences()
      setHasConsent(consent)
      return consent
    }
    
    const initialConsent = checkConsent()
    
    // If consent already exists, we need to wait a bit for gtag to be available
    if (initialConsent) {
      const timer = setInterval(() => {
        if (typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function') {
          updateConsent(true)
          setScriptLoaded(true)
          clearInterval(timer)
        }
      }, 100)
      
      // Stop checking after 5 seconds
      setTimeout(() => clearInterval(timer), 5000)
    }
  }, [])

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = () => {
      const newConsent = getCookiePreferences()
      setHasConsent(newConsent)
      
      if (newConsent) {
        // Wait for gtag to be available if script is loading
        const checkGtag = setInterval(() => {
          if (typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function') {
            updateConsent(true)
            setScriptLoaded(true)
            clearInterval(checkGtag)
          }
        }, 100)
        
        setTimeout(() => clearInterval(checkGtag), 5000)
      } else if (typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function') {
        // Revoke consent immediately if gtag is available
        updateConsent(false)
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

  // Update consent when hasConsent changes and script is loaded
  useEffect(() => {
    if (scriptLoaded && typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function') {
      updateConsent(hasConsent)
    }
  }, [hasConsent, scriptLoaded])

  // Monitor when NextGoogleAnalytics script loads
  useEffect(() => {
    if (!hasConsent) return

    // Check if script has loaded by looking for gtag function
    const checkScript = setInterval(() => {
      if (typeof window !== 'undefined' && window.gtag && typeof window.gtag === 'function') {
        // Script is loaded, update consent
        updateConsent(true)
        setScriptLoaded(true)
        clearInterval(checkScript)
      }
    }, 100)

    // Stop checking after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(checkScript)
    }, 10000)

    return () => {
      clearInterval(checkScript)
      clearTimeout(timeout)
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

