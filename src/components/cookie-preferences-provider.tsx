'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface CookiePreferencesContextType {
  isModalOpen: boolean
  setIsModalOpen: (open: boolean) => void
}

const CookiePreferencesContext = createContext<CookiePreferencesContextType | undefined>(undefined)

export function CookiePreferencesProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <CookiePreferencesContext.Provider value={{ isModalOpen, setIsModalOpen }}>
      {children}
    </CookiePreferencesContext.Provider>
  )
}

export function useCookiePreferences() {
  const context = useContext(CookiePreferencesContext)
  if (context === undefined) {
    throw new Error('useCookiePreferences must be used within a CookiePreferencesProvider')
  }
  return context
}
