'use client'

import { useState, useEffect } from 'react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

interface PortionAdjusterProps {
  defaultPortions: number
  onPortionsChange: (portions: number) => void
}

export function PortionAdjuster({ defaultPortions = 4, onPortionsChange }: PortionAdjusterProps) {
  const [portions, setPortions] = useState(defaultPortions)

  useEffect(() => {
    onPortionsChange(portions)
  }, [portions, onPortionsChange])

  const decreasePortions = () => {
    if (portions > 1) {
      setPortions(portions - 1)
    }
  }

  const increasePortions = () => {
    if (portions < 12) {
      setPortions(portions + 1)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Portioner:</span>
      <div className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
        <button
          onClick={decreasePortions}
          disabled={portions <= 1}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Reducer portioner"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="min-w-[3rem] text-center text-sm font-semibold text-gray-950 dark:text-gray-50">
          {portions}
        </span>
        <button
          onClick={increasePortions}
          disabled={portions >= 12}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Øg portioner"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
