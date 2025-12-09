'use client'

import { useState, useEffect, useRef } from 'react'
import { ClockIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline'

interface RecipeInstructionsProps {
  instructions: string[]
}

interface TimerState {
  isRunning: boolean
  timeLeft: number // i sekunder
  totalTime: number
}

// Ekstraher tid fra instruktion (f.eks. "lad simre i 15 minutter" -> 15)
function extractTime(instruction: string): number | null {
  // Match mønstre som "15 min", "15 minutter", "1 time", "2 timer"
  const patterns = [
    /(\d+)\s*(?:timer|time)/i, // timer
    /(\d+)\s*(?:min|minutter)/i, // minutter
  ]

  for (const pattern of patterns) {
    const match = instruction.match(pattern)
    if (match) {
      const num = parseInt(match[1])
      if (pattern.source.includes('timer')) {
        return num * 60 // konverter timer til minutter
      }
      return num
    }
  }

  return null
}


export function RecipeInstructions({ instructions }: RecipeInstructionsProps) {
  const [timers, setTimers] = useState<Map<number, TimerState>>(new Map())
  const intervalRefs = useRef<Map<number, NodeJS.Timeout>>(new Map())

  useEffect(() => {
    // Cleanup timers ved unmount
    return () => {
      const intervals = intervalRefs.current
      intervals.forEach(interval => clearInterval(interval))
      intervals.clear()
    }
  }, [])

  const startTimer = (index: number, minutes: number) => {
    // Stop eksisterende timer hvis der er en
    const existingInterval = intervalRefs.current.get(index)
    if (existingInterval) {
      clearInterval(existingInterval)
    }

    const totalSeconds = minutes * 60
    setTimers(prev => {
      const next = new Map(prev)
      next.set(index, {
        isRunning: true,
        timeLeft: totalSeconds,
        totalTime: totalSeconds,
      })
      return next
    })

    const interval = setInterval(() => {
      setTimers(prev => {
        const next = new Map(prev)
        const timer = next.get(index)
        if (!timer) {
          clearInterval(interval)
          return next
        }

        if (timer.timeLeft <= 1) {
          // Timer er færdig
          clearInterval(interval)
          next.delete(index)
          intervalRefs.current.delete(index)
          
          // Vis notifikation (hvis browser tillader det)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer færdig!', {
              body: `Din timer for step ${index + 1} er færdig.`,
              icon: '/favicon.ico',
            })
          }
          
          return next
        }

        next.set(index, {
          ...timer,
          timeLeft: timer.timeLeft - 1,
        })
        return next
      })
    }, 1000)

    intervalRefs.current.set(index, interval)

    // Request notification permission hvis ikke allerede givet
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const stopTimer = (index: number) => {
    const interval = intervalRefs.current.get(index)
    if (interval) {
      clearInterval(interval)
      intervalRefs.current.delete(index)
    }

    setTimers(prev => {
      const next = new Map(prev)
      const timer = next.get(index)
      if (timer) {
        next.set(index, {
          ...timer,
          isRunning: false,
        })
      }
      return next
    })
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
    }
    return `${secs}s`
  }

  // Tæl faktiske steps (ikke sektionstitler eller tomme linjer)
  const getStepNumber = (index: number): number => {
    let stepNumber = 0
    for (let i = 0; i < index; i++) {
      const inst = instructions[i]
      const isKnownHeader = inst.startsWith('FORBEREDELSE') || inst.startsWith('TILBEREDNING') || inst.startsWith('SAMMENSAETNING') || inst.startsWith('PRO TIPS') || inst.startsWith('TIP') || inst.startsWith('GLASUR') || inst.startsWith('FROSTING') || inst.startsWith('MÆSKNING') || inst.startsWith('FILTRERING') || inst.startsWith('KOGNING') || inst.startsWith('GÆRING') || inst.startsWith('FLASKNING') || inst.startsWith('LAGRING')
      const hasTimeInParens = /\([^)]+\)/.test(inst)
      const textBeforeParens = inst.replace(/\s*\([^)]+\)\s*$/, '').trim()
      const isAllCaps = textBeforeParens === textBeforeParens.toUpperCase() && /^[A-ZÆØÅ\s]+$/.test(textBeforeParens)
      const isHeaderCheck = isKnownHeader || (isAllCaps && hasTimeInParens)
      if (inst.trim() !== '' && !isHeaderCheck) {
        stepNumber++
      }
    }
    return stepNumber
  }

  // Filtrer PRO TIPS fra instruktioner (de vises i egen sektion)
  const filteredInstructions = instructions.filter((inst, index) => {
    // Stop ved PRO TIPS sektion
    if (inst.trim().toUpperCase() === 'PRO TIPS' || inst.trim().toUpperCase().startsWith('PRO TIPS')) {
      return false
    }
    
    // Check if we're in PRO TIPS section
    let inTipsSection = false
    for (let i = 0; i < index; i++) {
      if (instructions[i].trim().toUpperCase() === 'PRO TIPS' || instructions[i].trim().toUpperCase().startsWith('PRO TIPS')) {
        inTipsSection = true
        break
      }
      // Stop if we hit a new section
      if (instructions[i].trim().toUpperCase() === 'FORBEREDELSE' || 
          instructions[i].trim().toUpperCase() === 'TILBEREDNING' || 
          instructions[i].trim().toUpperCase() === 'SAMMENSAETNING') {
        inTipsSection = false
      }
    }
    
    return !inTipsSection
  })

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-950 dark:text-gray-50 mb-4">Fremgangsmåde</h2>
      <div className="space-y-6">
        {filteredInstructions.map((instruction, index) => {
          const isKnownHeader = instruction.startsWith('FORBEREDELSE') || instruction.startsWith('TILBEREDNING') || instruction.startsWith('SAMMENSAETNING') || instruction.startsWith('TIP') || instruction.startsWith('GLASUR') || instruction.startsWith('FROSTING') || instruction.startsWith('MÆSKNING') || instruction.startsWith('FILTRERING') || instruction.startsWith('KOGNING') || instruction.startsWith('GÆRING') || instruction.startsWith('FLASKNING') || instruction.startsWith('LAGRING')
          const hasTimeInParens = /\([^)]+\)/.test(instruction)
          const textBeforeParens = instruction.replace(/\s*\([^)]+\)\s*$/, '').trim()
          const isAllCaps = textBeforeParens === textBeforeParens.toUpperCase() && /^[A-ZÆØÅ\s]+$/.test(textBeforeParens)
          const isSectionHeader = isKnownHeader || (isAllCaps && hasTimeInParens)
          const isEmpty = instruction.trim() === ''
          // Calculate step number based on filtered instructions
          let stepNumber = 0
          filteredInstructions.slice(0, index).forEach((inst) => {
            const isKnownHeaderCheck = inst.startsWith('FORBEREDELSE') || inst.startsWith('TILBEREDNING') || inst.startsWith('SAMMENSAETNING') || inst.startsWith('TIP') || inst.startsWith('GLASUR') || inst.startsWith('FROSTING') || inst.startsWith('MÆSKNING') || inst.startsWith('FILTRERING') || inst.startsWith('KOGNING') || inst.startsWith('GÆRING') || inst.startsWith('FLASKNING') || inst.startsWith('LAGRING')
            const hasTimeCheck = /\([^)]+\)/.test(inst)
            const textBeforeParensCheck = inst.replace(/\s*\([^)]+\)\s*$/, '').trim()
            const isAllCapsCheck = textBeforeParensCheck === textBeforeParensCheck.toUpperCase() && /^[A-ZÆØÅ\s]+$/.test(textBeforeParensCheck)
            const isHeaderCheck = isKnownHeaderCheck || (isAllCapsCheck && hasTimeCheck)
            if (inst.trim() !== '' && !isHeaderCheck) {
              stepNumber++
            }
          })
          const timer = timers.get(index)
          const timeInInstruction = extractTime(instruction)
          const showTimerButton = timeInInstruction !== null && timeInInstruction > 0

          if (isEmpty) {
            return <div key={index} className="h-4" />
          }

          if (isSectionHeader) {
            const timeMatch = instruction.match(/\(([^)]+)\)/)
            const timeText = timeMatch ? timeMatch[1] : null
            let headerText = timeMatch ? instruction.replace(timeMatch[0], '').trim() : instruction
            headerText = headerText.replace(/:$/, '')

            return (
              <div key={index} className="mt-8 first:mt-0 flex items-center gap-3 flex-wrap">
                <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-50">
                  {headerText}
                </h3>
                {timeText && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10">
                    {timeText}
                  </span>
                )}
              </div>
            )
          }

          return (
            <div key={index} className="flex gap-6 text-base/7 text-gray-600 dark:text-gray-400">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-950 dark:text-gray-50">
                {stepNumber + 1}
              </span>
              <div className="pt-1 flex-1">
                <span>{instruction}</span>
                {showTimerButton && (
                  <div className="mt-3 flex items-center gap-3">
                    {timer ? (
                      <>
                        <div className="inline-flex items-center gap-2 rounded-full border border-transparent bg-white/15 dark:bg-gray-800/50 shadow-md ring-1 ring-[#D15052]/15 dark:ring-white/20 px-4 py-[calc(--spacing(2)-1px)]">
                          <ClockIcon className="h-5 w-5 text-gray-950 dark:text-gray-50" />
                          <span className="text-base font-medium text-gray-950 dark:text-gray-50 whitespace-nowrap">
                            {formatTime(timer.timeLeft)}
                          </span>
                        </div>
                        {timer.isRunning ? (
                          <button
                            onClick={() => stopTimer(index)}
                            className="inline-flex items-center justify-center rounded-full border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/20 px-4 py-[calc(--spacing(2)-1px)] text-base font-medium whitespace-nowrap text-gray-950 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <PauseIcon className="mr-2 h-5 w-5" />
                            Stop
                          </button>
                        ) : (
                          <button
                            onClick={() => startTimer(index, timeInInstruction!)}
                            className="inline-flex items-center justify-center rounded-full border border-transparent bg-gray-950 dark:bg-white shadow-md px-4 py-[calc(--spacing(2)-1px)] text-base font-medium whitespace-nowrap text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                          >
                            <PlayIcon className="mr-2 h-5 w-5" />
                            Start
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => startTimer(index, timeInInstruction!)}
                        className="inline-flex items-center justify-center rounded-full border border-transparent shadow-sm ring-1 ring-black/10 dark:ring-white/20 px-4 py-[calc(--spacing(2)-1px)] text-base font-medium whitespace-nowrap text-gray-950 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ClockIcon className="mr-2 h-5 w-5" />
                        Timer {timeInInstruction} min
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
