'use client'

import { useState, useEffect, useRef } from 'react'
import { PlayIcon, PauseIcon, ArrowPathIcon, ClockIcon } from '@heroicons/react/24/outline'

export function Timer() {
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0) // tid tilbage i sekunder
  const [initialTime, setInitialTime] = useState(0) // indstillet tid i sekunder
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleStartPause = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setTimeLeft(initialTime)
  }

  const handleSetTime = (hours: number, minutes: number) => {
    const totalSeconds = hours * 3600 + minutes * 60
    setInitialTime(totalSeconds)
    setTimeLeft(totalSeconds)
    setIsRunning(false)
    setShowSettings(false)
  }

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

  const formatTime = (value: number) => value.toString().padStart(2, '0')

  const presetTimes = [
    { label: '15 min', hours: 0, minutes: 15 },
    { label: '30 min', hours: 0, minutes: 30 },
    { label: '45 min', hours: 0, minutes: 45 },
    { label: '1 time', hours: 1, minutes: 0 },
    { label: '1.5 time', hours: 1, minutes: 30 },
    { label: '2 timer', hours: 2, minutes: 0 },
  ]

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showSettings && (
        <div className="mb-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Vælg tid
          </div>
          <div className="grid grid-cols-3 gap-2">
            {presetTimes.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleSetTime(preset.hours, preset.minutes)}
                className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-950 dark:text-gray-50 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-xl border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          aria-label="Indstil tid"
        >
          <ClockIcon className="w-5 h-5 text-gray-950 dark:text-gray-50" />
        </button>
        <div className="text-3xl font-mono font-bold text-gray-950 dark:text-gray-50 tabular-nums">
          {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartPause}
            disabled={timeLeft === 0}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? (
              <PauseIcon className="w-5 h-5 text-gray-950 dark:text-gray-50" />
            ) : (
              <PlayIcon className="w-5 h-5 text-gray-950 dark:text-gray-50" />
            )}
          </button>
          <button
            onClick={handleReset}
            disabled={initialTime === 0}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Nulstil"
          >
            <ArrowPathIcon className="w-5 h-5 text-gray-950 dark:text-gray-50" />
          </button>
        </div>
      </div>
    </div>
  )
}

