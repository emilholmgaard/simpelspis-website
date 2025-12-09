'use client'

import { useState, useEffect } from 'react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

interface PortionAdjusterProps {
  defaultPortions: number
  onPortionsChange: (portions: number) => void
}

export function PortionAdjuster({ defaultPortions = 1, onPortionsChange }: PortionAdjusterProps) {
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
    <div className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-white/15 dark:bg-gray-800/50 shadow-md ring-1 ring-[#D15052]/15 dark:ring-white/20 px-4 py-[calc(--spacing(2)-1px)]">
      <button
        onClick={decreasePortions}
        disabled={portions <= 1}
        className="text-gray-950 dark:text-gray-50 hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        aria-label="Reducer portioner"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="min-w-[3rem] text-center text-base font-medium text-gray-950 dark:text-gray-50 whitespace-nowrap">
        {portions} {portions === 1 ? 'portion' : 'portioner'}
      </span>
      <button
        onClick={increasePortions}
        disabled={portions >= 12}
        className="text-gray-950 dark:text-gray-50 hover:opacity-70 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        aria-label="Øg portioner"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
