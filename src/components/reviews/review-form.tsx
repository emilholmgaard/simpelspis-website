'use client'

import { useState, useEffect } from 'react'
import { HeartRating } from './star-rating'
import { Button } from '@/components/button'
import { AuthModal } from '@/components/auth/auth-modal'

interface ReviewFormProps {
  recipeSlug: string
  onReviewSubmitted?: () => void
}

interface User {
  id: string
  email: string
  username: string | null
}

export function ReviewForm({ recipeSlug, onReviewSubmitted }: ReviewFormProps) {
  const [user, setUser] = useState<User | null>(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    fetch('/api/auth/user')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check cookie consent - GDPR compliance
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (cookieConsent !== 'accepted') {
      setError('Du skal acceptere cookies for at skrive anmeldelser. Cookies er nødvendige for at håndtere din login-session.')
      return
    }

    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (rating === 0) {
      setError('Vælg venligst en vurdering')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeSlug,
          rating,
          comment: comment.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Noget gik galt')
      }

      setRating(0)
      setComment('')
      setError('')
      onReviewSubmitted?.()
      // Small delay to ensure the review is saved
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noget gik galt')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <>
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-md ring-1 ring-black/5 dark:ring-white/10">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Log ind for at skrive en anmeldelse
          </p>
          <Button onClick={() => setShowAuthModal(true)}>Log ind</Button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => window.location.reload()}
        />
      </>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-md ring-1 ring-black/5 dark:ring-white/10">
        <h3 className="text-xl font-medium text-gray-950 dark:text-gray-50 mb-4">
          Skriv en anmeldelse
        </h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Din vurdering
          </label>
          <HeartRating
            rating={rating}
            onRatingChange={setRating}
            interactive
            size="lg"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Din kommentar (valgfrit)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Del dine tanker om denne opskrift..."
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading || rating === 0}>
          {loading ? 'Sender...' : 'Indsend anmeldelse'}
        </Button>
      </div>
    </form>
  )
}

