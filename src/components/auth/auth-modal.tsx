'use client'

import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/button'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Check cookie consent - GDPR compliance: user must accept cookies before login
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (cookieConsent !== 'accepted') {
      setError(
        'Du skal acceptere cookies for at logge ind. Cookies er nødvendige for at håndtere din login-session. Klik på "Accepter" i cookie-banneren først.'
      )
      setLoading(false)
      return
    }

    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const body = isLogin
        ? { email, password }
        : { email, password, username: username || undefined }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Noget gik galt')
        return
      }

      // Refresh page to update auth state
      window.location.reload()
      onSuccess?.()
      onClose()
    } catch (err) {
      setError('Noget gik galt. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Noget gik galt')
        return
      }

      setSuccess('Vi har sendt dig en email med instruktioner til at nulstille din adgangskode.')
    } catch (err) {
      setError('Noget gik galt. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-md ring-1 ring-black/5 dark:ring-white/10">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-semibold text-gray-950 dark:text-gray-50 mb-6">
          {showForgotPassword ? 'Glemt adgangskode' : isLogin ? 'Log ind' : 'Opret konto'}
        </h2>

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
                placeholder="Indtast din email"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                {success}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Sender...' : 'Send nulstillingslink'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false)
                  setError('')
                  setSuccess('')
                }}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 underline"
              >
                Tilbage til login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Brugernavn (valgfrit)
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
                  placeholder="Vælg et brugernavn"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Adgangskode
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
              />
              {isLogin && (
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true)
                    setError('')
                  }}
                  className="mt-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 underline"
                >
                  Glemt adgangskode?
                </button>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Venter...' : isLogin ? 'Log ind' : 'Opret konto'}
            </Button>
          </form>
        )}

        {!showForgotPassword && (
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? (
              <>
                Har du ikke en konto?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setError('')
                  }}
                  className="font-medium text-gray-950 dark:text-gray-50 hover:underline"
                >
                  Opret konto
                </button>
              </>
            ) : (
              <>
                Har du allerede en konto?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true)
                    setError('')
                  }}
                  className="font-medium text-gray-950 dark:text-gray-50 hover:underline"
                >
                  Log ind
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

