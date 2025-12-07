'use client'

import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from 'framer-motion'

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
  const [showCursor, setShowCursor] = useState(true)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  let mouseX = useMotionValue(0)
  let mouseY = useMotionValue(0)

  function onMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    let { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`
  let style = { maskImage, WebkitMaskImage: maskImage }

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
        clearInterval(typeInterval)
        
        // Wait before deleting
        setTimeout(() => {
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
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div 
        onMouseMove={onMouseMove}
        className="group relative w-full"
      >
        <label htmlFor="home-search-input" className="sr-only">
          Søg efter opskrifter
        </label>
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 inline-flex flex-shrink-0 w-5 h-5 items-center justify-center z-10">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
        </div>
        <input
          id="home-search-input"
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=""
          aria-label="Søg efter opskrifter"
          className="relative w-full rounded-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/5 pl-12 pr-12 py-4 text-base text-gray-950 dark:text-gray-50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-950/10 dark:focus:ring-white/10 hover:border-gray-300 dark:hover:border-gray-700 transition-all shadow-sm hover:shadow-md dark:ring-1 dark:ring-inset dark:ring-white/10 z-10"
        />
        {/* Cursor spotlight effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full bg-linear-to-r from-blue-50 to-blue-100 opacity-0 transition duration-300 group-hover:opacity-100 dark:from-blue-950/20 dark:to-blue-900/20"
          style={style}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
          style={style}
        >
          <div className="absolute inset-0 rounded-full bg-white/30 dark:bg-white/5" />
        </motion.div>
        {!value && displayText && (
          <div className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 text-base text-gray-500 dark:text-gray-400 z-10" aria-hidden="true">
            {displayText}
            {showCursor && <span className="ml-0.5">|</span>}
          </div>
        )}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Ryd"
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex flex-shrink-0 w-5 h-5 items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors z-10"
          >
            <XMarkIcon className="w-5 h-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </form>
  )
}

