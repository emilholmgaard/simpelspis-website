'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { Subheading } from '@/components/text'

interface RecipeTipsProps {
  instructions: string[]
}

export function RecipeTips({ instructions }: RecipeTipsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Find alle PRO TIPS
  const tips: string[] = []
  let inTipsSection = false

  instructions.forEach((instruction) => {
    if (instruction.trim().toUpperCase() === 'PRO TIPS' || instruction.trim().toUpperCase().startsWith('PRO TIPS')) {
      inTipsSection = true
      return
    }
    
    if (inTipsSection) {
      // Stop hvis vi rammer en ny sektion
      if (instruction.trim().toUpperCase() === 'FORBEREDELSE' || 
          instruction.trim().toUpperCase() === 'TILBEREDNING' || 
          instruction.trim().toUpperCase() === 'SAMMENSAETNING') {
        inTipsSection = false
        return
      }
      
      // Tilføj tip hvis det ikke er tomt
      if (instruction.trim() && !instruction.trim().startsWith('TIP:')) {
        tips.push(instruction.trim())
      }
    }
  })

  if (tips.length === 0) {
    return null
  }

  // Vis de første 3 tips som standard, resten når expanded
  const visibleTips = isExpanded ? tips : tips.slice(0, 3)
  const hasMoreTips = tips.length > 3

  return (
    <div className="mt-12">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <LightBulbIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
          <Subheading as="h3" className="mb-0">
            Pro Tips ({tips.length})
          </Subheading>
        </div>
        {hasMoreTips && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{isExpanded ? 'Vis færre' : `Vis alle ${tips.length} tips`}</span>
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </div>
        )}
      </button>

      <div className="mt-4 space-y-3">
        {visibleTips.map((tip, index) => (
          <div
            key={index}
            className="flex gap-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4"
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">
                  {index + 1}
                </span>
              </div>
            </div>
            <p className="text-sm/6 text-gray-600 dark:text-gray-400 flex-1">
              {tip}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
