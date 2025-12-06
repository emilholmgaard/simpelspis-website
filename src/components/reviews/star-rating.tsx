'use client'

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

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((heart) => (
        <button
          key={heart}
          type="button"
          onClick={() => handleClick(heart)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
        >
          {heart <= rating ? (
            <HeartIcon
              className={`${sizeClasses[size]} text-red-500 ${
                interactive ? 'hover:text-red-600' : ''
              }`}
            />
          ) : (
            <HeartOutlineIcon
              className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600 ${
                interactive ? 'hover:text-red-400' : ''
              }`}
            />
          )}
        </button>
      ))}
    </div>
  )
}

