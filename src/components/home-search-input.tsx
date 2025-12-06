'use client'

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const typewriterTexts = [
  'Søg efter opskrifter...',
  'Søg efter ingredienser...',
  'Søg efter pasta opskrifter...',
  'Søg efter dessert opskrifter...',
]

export function HomeSearchInput() {
  const [value, setValue] = useState('')
  const [displayText, setDisplayText] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (value) {
      setDisplayText('')
      return
    }

    const currentText = typewriterTexts[currentTextIndex]
    let charIndex = 0

    const typeInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayText(currentText.slice(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
        
        // Wait before deleting
        setTimeout(() => {
          setIsTyping(true)
          const deleteInterval = setInterval(() => {
            if (charIndex > 0) {
              charIndex--
              setDisplayText(currentText.slice(0, charIndex))
            } else {
              clearInterval(deleteInterval)
              setCurrentTextIndex((prev) => (prev + 1) % typewriterTexts.length)
            }
          }, 30)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [currentTextIndex, value])

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 530)

    return () => clearInterval(cursorInterval)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleClear = () => {
    setValue('')
  }

  const handleFocus = () => {
    setDisplayText('')
  }

  const handleBlur = () => {
    if (!value) {
      setCurrentTextIndex(0)
      setDisplayText('')
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (value.trim()) {
      router.push(`/opskrifter?q=${encodeURIComponent(value.trim())}`)
    } else {
      router.push('/opskrifter')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="relative w-full">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 inline-flex flex-shrink-0 w-5 h-5 items-center justify-center">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=""
          className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-12 pr-12 py-4 text-base text-gray-950 dark:text-gray-50 focus:border-gray-400 dark:focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950/10 dark:focus:ring-gray-50/10 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow-md"
        />
        {!value && displayText && (
          <div className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-400 dark:text-gray-500">
            {displayText}
            {showCursor && <span className="ml-0.5">|</span>}
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Ryd"
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex flex-shrink-0 w-5 h-5 items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </form>
  )
}

