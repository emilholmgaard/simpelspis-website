'use client'

import { useState, useEffect } from 'react'
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

      const reviewsData = await reviewsRes.json()
      const statsData = await statsRes.json()

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
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [recipeSlug])

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
                <div>
                  <p className="font-medium text-gray-950 dark:text-gray-50">
                    {review.user?.username || 'Anonym'}
                  </p>
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

