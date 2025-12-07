'use client'

import { useState, useEffect } from 'react'
import { HeartRating } from './star-rating'

interface ReviewStatsDisplayProps {
  averageRating: number
  totalReviews: number
  recipeSlug: string
  onRatingUpdate?: () => void
}

interface User {
  id: string
  email: string
  username: string | null
}

export function ReviewStatsDisplay({ 
  averageRating, 
  totalReviews, 
  recipeSlug,
  onRatingUpdate 
}: ReviewStatsDisplayProps) {
  const [user, setUser] = useState<User | null>(null)
  const [currentRating, setCurrentRating] = useState(Math.round(averageRating))
  const [userRating, setUserRating] = useState<number | null>(null)
  const [stats, setStats] = useState({
    averageRating,
    totalReviews,
  })

  const getOrCreateAnonymousId = (): string => {
    try {
      let anonymousId = localStorage.getItem('anonymous-id')
      if (!anonymousId || anonymousId.trim() === '') {
        anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('anonymous-id', anonymousId)
      }
      return anonymousId
    } catch (error) {
      // Fallback if localStorage is not available
      return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  useEffect(() => {
    let isMounted = true
    
    // Fetch current user and latest stats
    Promise.all([
      fetch('/api/auth/user').then((res) => res.json()).catch(() => ({ user: null })),
      fetch(`/api/reviews/stats?recipeSlug=${recipeSlug}`).then((res) => res.json()).catch(() => ({ averageRating: 0, totalReviews: 0 })),
      fetch(`/api/reviews?recipeSlug=${recipeSlug}`).then((res) => res.json()).catch(() => [])
    ])
      .then(([userData, statsData, reviewsData]) => {
        if (!isMounted) return
        
        // Update stats
        if (statsData && statsData.totalReviews > 0) {
          setStats({
            averageRating: statsData.averageRating || 0,
            totalReviews: statsData.totalReviews || 0,
          })
        }
        
        // Set user and their rating
        if (userData?.user) {
          setUser(userData.user)
          // First check for user review
          const userReview = Array.isArray(reviewsData) 
            ? reviewsData.find((r: any) => r.userId === userData.user.id)
            : null
          if (userReview) {
            setUserRating(userReview.rating)
          } else {
            // If no user review, check for anonymous review (user might have rated before logging in)
            try {
              const anonymousId = getOrCreateAnonymousId()
              const anonymousReview = Array.isArray(reviewsData)
                ? reviewsData.find((r: any) => r.anonymousId === anonymousId)
                : null
              if (anonymousReview) {
                setUserRating(anonymousReview.rating)
              }
            } catch (error) {
              // Silently handle localStorage errors
            }
          }
        } else {
          // Check for anonymous review
          try {
            const anonymousId = getOrCreateAnonymousId()
            const anonymousReview = Array.isArray(reviewsData)
              ? reviewsData.find((r: any) => r.anonymousId === anonymousId)
              : null
            if (anonymousReview) {
              setUserRating(anonymousReview.rating)
            }
          } catch (error) {
            // Silently handle localStorage errors
          }
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Error fetching review data:', error)
        }
      })
    
    return () => {
      isMounted = false
    }
  }, [recipeSlug])

  useEffect(() => {
    setCurrentRating(Math.round(stats.averageRating))
  }, [stats.averageRating])

  const handleRatingChange = async (newRating: number) => {
    // Optimistic update
    const previousRating = userRating
    setUserRating(newRating)
    
    // Calculate new optimistic stats (approximate)
    // Only update if we have stats, otherwise keep existing
    if (stats.totalReviews > 0) {
      // Logic for updating average locally is complex without knowing all ratings, 
      // so we'll just wait for server response for the average, but update user's view immediately
    }

    try {
      // Always send anonymousId to allow conversion of anonymous reviews to user reviews
      const anonymousId = getOrCreateAnonymousId()
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeSlug,
          rating: newRating,
          comment: null,
          anonymousId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Kunne ikke opdatere vurdering'
        throw new Error(errorMessage)
      }

      // Refresh stats and reviews to get updated data from server
      // This ensures we have the correct average and counts
      const [statsRes, reviewsRes] = await Promise.all([
        fetch(`/api/reviews/stats?recipeSlug=${recipeSlug}`),
        fetch(`/api/reviews?recipeSlug=${recipeSlug}`)
      ])
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
      
      // Update user rating from server response to be sure
      if (reviewsRes.ok && user) {
        const reviewsData = await reviewsRes.json()
        const userReview = reviewsData.find((r: any) => r.userId === user.id)
        if (userReview) {
          setUserRating(userReview.rating)
        }
      }

      onRatingUpdate?.()
    } catch (err) {
      // Revert optimistic update on error
      setUserRating(previousRating)
      
      console.error('Error updating rating:', err)
      // Show user-friendly error message
      const errorMessage = err instanceof Error ? err.message : 'Kunne ikke opdatere vurdering'
      alert(errorMessage)
    }
  }

  // Show user's rating if they have one, otherwise show average (or 0 if no reviews)
  const displayRating = userRating !== null ? userRating : (stats.totalReviews > 0 ? currentRating : 0)

  return (
    <>
      <div className="flex items-center gap-3 mt-3">
        <HeartRating 
          rating={displayRating} 
          onRatingChange={handleRatingChange}
          interactive={true}
          size="lg" 
        />
        {stats.totalReviews > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-950 dark:text-gray-50">
              {stats.averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({stats.totalReviews} anmeldelse{stats.totalReviews !== 1 ? 'r' : ''})
            </span>
          </div>
        )}
        {stats.totalReviews === 0 && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Vurder denne opskrift
          </span>
        )}
      </div>
    </>
  )
}

