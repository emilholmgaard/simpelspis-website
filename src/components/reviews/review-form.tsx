'use client'

import { useState, useEffect } from 'react'
import { HeartRating } from './star-rating'
import { Button } from '@/components/button'

interface ReviewFormProps {
  recipeSlug: string
  onReviewSubmitted?: () => void
}

export function ReviewForm({ recipeSlug, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load existing review if present
    const loadExistingReview = async () => {
      try {
        const [userRes, reviewsRes] = await Promise.all([
          fetch('/api/auth/user'),
          fetch(`/api/reviews?recipeSlug=${recipeSlug}`)
        ])
        
        const userData = await userRes.json().catch(() => ({ user: null }))
        const reviewsData = await reviewsRes.json().catch(() => [])
        
        if (!Array.isArray(reviewsData)) return

        let myReview = null
        
        // Check for user review
        if (userData?.user) {
          myReview = reviewsData.find((r: any) => r.userId === userData.user.id)
        }
        
        // If not found, check for anonymous review
        if (!myReview) {
          const anonymousId = localStorage.getItem('anonymous-id')
          if (anonymousId) {
            myReview = reviewsData.find((r: any) => r.anonymousId === anonymousId)
          }
        }
        
        if (myReview) {
          setRating(myReview.rating)
          if (myReview.comment) {
            setComment(myReview.comment)
          }
        }
      } catch (err) {
        console.error('Error loading existing review:', err)
      }
    }
    
    loadExistingReview()
  }, [recipeSlug])

  const getOrCreateAnonymousId = (): string => {
    let anonymousId = localStorage.getItem('anonymous-id')
    if (!anonymousId) {
      anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('anonymous-id', anonymousId)
    }
    return anonymousId
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Vælg venligst en vurdering')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Always send anonymousId to allow conversion of anonymous reviews to user reviews
      const anonymousId = getOrCreateAnonymousId()
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeSlug,
          rating,
          comment: comment.trim() || null,
          anonymousId,
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

