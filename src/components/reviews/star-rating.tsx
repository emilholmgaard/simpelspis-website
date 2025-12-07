'use client'

import { useState } from 'react'
import { HeartIcon } from '@heroicons/react/24/solid'
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline'

interface HeartRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  interactive?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function HeartRating({
  rating,
  onRatingChange,
  interactive = false,
  size = 'md',
}: HeartRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  const handleMouseEnter = (heartValue: number) => {
    if (interactive) {
      setHoverRating(heartValue)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(null)
    }
  }

  // Use hover rating if available, otherwise use actual rating
  const displayRating = hoverRating !== null ? hoverRating : rating

  return (
    <div 
      className="flex items-center gap-0.5 relative z-10"
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((heart) => (
        <button
          key={heart}
          type="button"
          onClick={() => handleClick(heart)}
          onMouseEnter={() => handleMouseEnter(heart)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer transition-transform hover:scale-110 p-1' : 'cursor-default p-1'}
          aria-label={`Rate ${heart} out of 5`}
        >
          {heart <= displayRating ? (
            <HeartIcon
              className={`${sizeClasses[size]} text-red-500 transition-colors ${
                interactive ? 'hover:text-red-600' : ''
              }`}
            />
          ) : (
            <HeartOutlineIcon
              className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600 transition-colors ${
                interactive ? 'hover:text-red-400' : ''
              }`}
            />
          )}
        </button>
      ))}
    </div>
  )
}

