'use client'

import { useState, useEffect } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { HeartRating } from './star-rating'

interface Review {
  id: string
  recipeSlug: string
  userId: string
  rating: number
  comment: string | null
  createdAt: string
  user?: {
    username: string | null
    email: string
  }
}

interface ReviewListProps {
  recipeSlug: string
}

export function ReviewList({ recipeSlug }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const fetchReviews = async () => {
    try {
      const [reviewsRes] = await Promise.all([
        fetch(`/api/reviews?recipeSlug=${recipeSlug}`),
      ])

      if (!reviewsRes.ok) {
        // Silently handle errors - database might not be available in static builds
        setReviews([])
        return
      }

      const reviewsData = await reviewsRes.json()

      // Ensure reviewsData is an array
      if (!Array.isArray(reviewsData)) {
        // Silently handle invalid data format
        setReviews([])
        return
      }

      // Show all reviews, even those without comments
      const filteredReviews = reviewsData

      // Fetch user data for each review
      const reviewsWithUsers = await Promise.all(
        filteredReviews.map(async (review: Review) => {
          try {
            const userRes = await fetch(`/api/reviews/users/${review.userId}`)
            if (userRes.ok) {
              const userData = await userRes.json()
              return { ...review, user: userData }
            }
          } catch {
            // Ignore errors
          }
          return review
        })
      )

      setReviews(reviewsWithUsers)
    } catch (error) {
      // Silently handle errors - database might not be available in static builds
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching reviews:', error)
      }
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    // Fetch current user
    fetch('/api/auth/user')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUserId(data.user.id)
        }
      })
      .catch(() => {
        // User not logged in
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeSlug])

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Er du sikker på, at du vil slette din anmeldelse?')) {
      return
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Kunne ikke slette anmeldelse')
        return
      }

      // Refresh reviews and stats
      await fetchReviews()
    } catch {
      alert('Noget gik galt. Prøv igen.')
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-md ring-1 ring-black/5 dark:ring-white/10">
        <p className="text-gray-600 dark:text-gray-400">Indlæser anmeldelser...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-md ring-1 ring-black/5 dark:ring-white/10">
          <p className="text-gray-600 dark:text-gray-400">
            Ingen anmeldelser endnu. Vær den første til at anmelde!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-black/5 dark:ring-white/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-950 dark:text-gray-50">
                      {review.user?.username || 'Anonym'}
                    </p>
                    {currentUserId === review.userId && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        title="Slet anmeldelse"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString('da-DK', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <HeartRating rating={review.rating} />
              </div>
              {review.comment && (
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

