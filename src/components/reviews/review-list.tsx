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
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingCounts: [0, 0, 0, 0, 0],
  })

  const fetchReviews = async () => {
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        fetch(`/api/reviews?recipeSlug=${recipeSlug}`),
        fetch(`/api/reviews/stats?recipeSlug=${recipeSlug}`),
      ])

      if (!reviewsRes.ok || !statsRes.ok) {
        console.error('Failed to fetch reviews or stats')
        setReviews([])
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingCounts: [0, 0, 0, 0, 0],
        })
        return
      }

      const reviewsData = await reviewsRes.json()
      const statsData = await statsRes.json()

      // Ensure reviewsData is an array
      if (!Array.isArray(reviewsData)) {
        console.error('Reviews data is not an array:', reviewsData)
        setReviews([])
        setStats(statsData || {
          averageRating: 0,
          totalReviews: 0,
          ratingCounts: [0, 0, 0, 0, 0],
        })
        return
      }

      // Fetch user data for each review
      const reviewsWithUsers = await Promise.all(
        reviewsData.map(async (review: Review) => {
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
      setStats(statsData || {
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: [0, 0, 0, 0, 0],
      })
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: [0, 0, 0, 0, 0],
      })
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
      {/* Stats */}
      {stats.totalReviews > 0 && (
        <div className="rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-md ring-1 ring-black/5 dark:ring-white/10">
          <h3 className="text-xl font-medium text-gray-950 dark:text-gray-50 mb-4">
            Anmeldelser
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-3xl font-bold text-gray-950 dark:text-gray-50">
              {stats.averageRating.toFixed(1)}
            </div>
            <div>
              <HeartRating rating={Math.round(stats.averageRating)} size="lg" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stats.totalReviews} anmeldelse{stats.totalReviews !== 1 ? 'r' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

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

