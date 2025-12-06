'use client'

import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ClockIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

function SearchInput({
  label,
  placeholder,
  icon: Icon,
  name,
  showMobile = true,
  showDesktop = true,
}: {
  label: string
  placeholder: string
  icon: React.ComponentType<{ className?: string }>
  name: string
  showMobile?: boolean
  showDesktop?: boolean
}) {
  const [value, setValue] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  const handleClear = () => {
    setValue('')
  }

  return (
    <div
      className={`relative flex flex-col ${showMobile ? 'flex' : 'hidden'} ${showDesktop ? 'lg:flex' : 'lg:hidden'}`}
    >
      <p className="mb-1.5 block text-xs font-semibold text-gray-900 dark:text-gray-100">
        {label}
      </p>
      <div className="relative w-full">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 inline-flex flex-shrink-0 w-5 h-5 items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-11 pr-10 py-3 text-sm text-gray-950 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-400 dark:focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950/10 dark:focus:ring-gray-50/10 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Ryd"
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex flex-shrink-0 w-5 h-5 items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

function TimeInput({
  label,
  icon: Icon,
  name,
  showMobile = true,
  showDesktop = true,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  name: string
  showMobile?: boolean
  showDesktop?: boolean
}) {
  const [value, setValue] = useState('')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Kun tillad tal
    const inputValue = e.target.value.replace(/[^0-9]/g, '')
    setValue(inputValue)
  }
  
  const handleClear = () => {
    setValue('')
  }

  return (
    <div
      className={`relative flex flex-col ${showMobile ? 'flex' : 'hidden'} ${showDesktop ? 'lg:flex' : 'lg:hidden'}`}
    >
      <p className="mb-1.5 block text-xs font-semibold text-gray-900 dark:text-gray-100">
        {label}
      </p>
      <div className="relative w-full">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 inline-flex flex-shrink-0 w-5 h-5 items-center justify-center">
          <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name={name}
          value={value}
          onChange={handleChange}
          placeholder="Alle tider"
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-11 pr-16 py-3 text-sm text-gray-950 dark:text-gray-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-gray-400 dark:focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-950/10 dark:focus:ring-gray-50/10 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
        />
        {value && (
          <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
            min
          </span>
        )}
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Ryd"
            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex flex-shrink-0 w-5 h-5 items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export function SearchForm() {
  return (
    <form action="/opskrifter" method="get" className="relative w-full">
      <div className="rounded-2xl bg-gradient-to-br from-blue-100/80 via-white to-purple-100/60 dark:from-blue-900/20 dark:via-gray-800 dark:to-purple-900/20 border border-gray-200/60 dark:border-gray-700/60 p-6 shadow-sm hover:shadow-lg transition-all backdrop-blur-sm" style={{ filter: 'saturate(1.5)' }}>
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:gap-3">
            <div className="w-full flex flex-col sm:flex-row lg:flex-row gap-4 lg:gap-3 flex-1">
              <div className="flex-1">
                <SearchInput
                  label="Nem Opskrift eller ingrediens"
                  placeholder="Alle nemme opskrifter og ingredienser"
                  icon={MagnifyingGlassIcon}
                  name="q"
                />
              </div>
              <div className="flex-1">
                <SearchInput
                  label="Kategori"
                  placeholder="Alle kategorier"
                  icon={MapPinIcon}
                  name="kategori"
                />
              </div>
              <div className="flex-1">
                <TimeInput
                  label="Tid"
                  icon={ClockIcon}
                  name="time"
                />
              </div>
            </div>
            <div className="hidden lg:flex lg:items-end lg:shrink-0">
              <button
                type="submit"
                className="rounded-lg bg-black dark:bg-white px-6 py-3 text-base font-semibold text-white dark:text-black transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-gray-50 focus:ring-offset-2 whitespace-nowrap h-[46px] flex items-center justify-center"
              >
                Søg
              </button>
            </div>
          </div>
          <div className="flex justify-center lg:hidden">
            <button
              type="submit"
              className="w-full rounded-lg bg-black dark:bg-white px-6 py-3 text-base font-semibold text-white dark:text-black transition-colors hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-gray-50 focus:ring-offset-2"
            >
              Søg opskrifter
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
