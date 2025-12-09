'use client'

import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

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

  // Vis de første 5 tips som standard, resten når expanded
  const visibleTips = isExpanded ? tips : tips.slice(0, 5)
  const hasMoreTips = tips.length > 5

  return (
    <div className="mt-8 space-y-6">
      {/* Section Header - samme stil som FORBEREDELSE, TILBEREDNING, etc. */}
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-50">
          PRO TIPS
        </h3>
        {hasMoreTips && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isExpanded ? (
              <>
                Vis færre
                <ChevronUpIcon className="h-3 w-3" />
              </>
            ) : (
              <>
                Vis alle {tips.length} tips
                <ChevronDownIcon className="h-3 w-3" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Tips - samme stil som instruktioner */}
      <div className="space-y-6">
        {visibleTips.map((tip, index) => (
          <div
            key={index}
            className="flex gap-6 text-base/7 text-gray-600 dark:text-gray-400"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-950 dark:text-gray-50">
              {index + 1}
            </span>
            <span className="pt-1 flex-1">{tip}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
