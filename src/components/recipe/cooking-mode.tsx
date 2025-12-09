'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ClockIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/button'

interface CookingModeProps {
  instructions: string[]
  ingredients: string[]
  recipeTitle: string
}

interface TimerState {
  isRunning: boolean
  timeLeft: number
  totalTime: number
}

// Ekstraher tid fra instruktion
function extractTime(instruction: string): number | null {
  const patterns = [
    /(\d+)\s*(?:timer|time)/i,
    /(\d+)\s*(?:min|minutter)/i,
  ]

  for (const pattern of patterns) {
    const match = instruction.match(pattern)
    if (match) {
      const num = parseInt(match[1])
      if (pattern.source.includes('timer')) {
        return num * 60
      }
      return num
    }
  }
  return null
}

// Tæl faktiske steps
function getStepNumber(instructions: string[], index: number): number {
  let stepNumber = 0
  for (let i = 0; i < index; i++) {
    const inst = instructions[i]
    const isKnownHeader = inst.startsWith('FORBEREDELSE') || inst.startsWith('TILBEREDNING') || inst.startsWith('SAMMENSAETNING') || inst.startsWith('PRO TIPS') || inst.startsWith('TIP')
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

// Find alle faktiske steps (ikke headers)
function getActualSteps(instructions: string[]): Array<{ index: number; stepNumber: number; text: string }> {
  const steps: Array<{ index: number; stepNumber: number; text: string }> = []
  let currentStepNumber = 0

  instructions.forEach((instruction, index) => {
    const isKnownHeader = instruction.startsWith('FORBEREDELSE') || instruction.startsWith('TILBEREDNING') || instruction.startsWith('SAMMENSAETNING') || instruction.startsWith('PRO TIPS') || instruction.startsWith('TIP')
    const hasTimeInParens = /\([^)]+\)/.test(instruction)
    const textBeforeParens = instruction.replace(/\s*\([^)]+\)\s*$/, '').trim()
    const isAllCaps = textBeforeParens === textBeforeParens.toUpperCase() && /^[A-ZÆØÅ\s]+$/.test(textBeforeParens)
    const isSectionHeader = isKnownHeader || (isAllCaps && hasTimeInParens)
    const isEmpty = instruction.trim() === ''

    if (!isEmpty && !isSectionHeader) {
      currentStepNumber++
      steps.push({
        index,
        stepNumber: currentStepNumber,
        text: instruction.trim(),
      })
    }
  })

  return steps
}

export function CookingMode({ instructions, ingredients, recipeTitle }: CookingModeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [timers, setTimers] = useState<Map<number, TimerState>>(new Map())
  const intervalRefs = useState<Map<number, NodeJS.Timeout>>(new Map())[0]

  const actualSteps = getActualSteps(instructions)
  const currentStep = actualSteps[currentStepIndex]
  const totalSteps = actualSteps.length

  useEffect(() => {
    return () => {
      intervalRefs.forEach(interval => clearInterval(interval))
    }
  }, [intervalRefs])

  const startTimer = (minutes: number) => {
    const totalSeconds = minutes * 60
    const timerKey = currentStepIndex

    setTimers(prev => {
      const next = new Map(prev)
      next.set(timerKey, {
        isRunning: true,
        timeLeft: totalSeconds,
        totalTime: totalSeconds,
      })
      return next
    })

    const interval = setInterval(() => {
      setTimers(prev => {
        const next = new Map(prev)
        const timer = next.get(timerKey)
        if (!timer) {
          clearInterval(interval)
          return next
        }

        if (timer.timeLeft <= 1) {
          clearInterval(interval)
          next.delete(timerKey)
          intervalRefs.delete(timerKey)
          
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Timer færdig!', {
              body: `Din timer for step ${currentStepIndex + 1} er færdig.`,
              icon: '/favicon.ico',
            })
          }
          
          return next
        }

        next.set(timerKey, {
          ...timer,
          timeLeft: timer.timeLeft - 1,
        })
        return next
      })
    }, 1000)

    intervalRefs.set(timerKey, interval)

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins > 0) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
    }
    return `${secs}s`
  }

  const timeInStep = currentStep ? extractTime(currentStep.text) : null
  const timer = currentStep ? timers.get(currentStepIndex) : null

  if (!isOpen) {
    return (
      <div className="mt-6">
        <Button
          variant="primary"
          onClick={() => setIsOpen(true)}
          className="w-full sm:w-auto"
        >
          <ClockIcon className="mr-2 h-5 w-5" />
          Start Kog-modus
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Luk kog-modus"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-950 dark:text-gray-50">{recipeTitle}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStepIndex + 1} af {totalSteps}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl px-4 py-8">
            {/* Step Number */}
            <div className="mb-8 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-3xl font-bold text-gray-950 dark:text-gray-50">
                {currentStepIndex + 1}
              </div>
            </div>

            {/* Step Text */}
            <div className="mb-8">
              <p className="text-2xl/8 text-center text-gray-950 dark:text-gray-50">
                {currentStep?.text}
              </p>
            </div>

            {/* Timer */}
            {timeInStep && (
              <div className="mb-8 flex justify-center">
                {timer ? (
                  <div className="flex items-center gap-4 rounded-full border border-transparent bg-white/15 dark:bg-gray-800/50 shadow-md ring-1 ring-[#D15052]/15 dark:ring-white/20 px-6 py-3">
                    <ClockIcon className="h-6 w-6 text-gray-950 dark:text-gray-50" />
                    <span className="text-xl font-semibold text-gray-950 dark:text-gray-50">
                      {formatTime(timer.timeLeft)}
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => startTimer(timeInStep)}
                  >
                    <ClockIcon className="mr-2 h-5 w-5" />
                    Start Timer {timeInStep} min
                  </Button>
                )}
              </div>
            )}

            {/* Ingredients Reminder */}
            <div className="mt-12 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
              <h3 className="mb-4 text-sm font-semibold text-gray-950 dark:text-gray-50">
                Ingredienser
              </h3>
              <ul className="space-y-2">
                {ingredients
                  .filter(ing => ing.trim() && !ing.endsWith(':'))
                  .slice(0, 8)
                  .map((ingredient, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                      • {ingredient}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
            >
              <ChevronLeftIcon className="mr-2 h-5 w-5" />
              Forrige
            </Button>

            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStepIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentStepIndex
                      ? 'bg-gray-950 dark:bg-white'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  aria-label={`Gå til step ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="primary"
              onClick={() => setCurrentStepIndex(Math.min(totalSteps - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === totalSteps - 1}
            >
              Næste
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
