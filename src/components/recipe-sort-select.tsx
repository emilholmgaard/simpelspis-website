'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface SortSelectProps {
  currentSort: string
}

export function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'standard') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    
    router.push(`/opskrifter?${params.toString()}`)
  }

  const sortOptions = [
    { label: 'Standard', value: 'standard' },
    { label: 'Tid: Hurtigst først', value: 'tid-op' },
    { label: 'Tid: Længst først', value: 'tid-ned' },
    { label: 'Sværhedsgrad: Nemmest først', value: 'sværhed-op' },
    { label: 'Sværhedsgrad: Sværest først', value: 'sværhed-ned' },
    { label: 'Alfabetisk: A-Z', value: 'alfabetisk-op' },
    { label: 'Alfabetisk: Z-A', value: 'alfabetisk-ned' },
  ]

  return (
    <div className="w-full">
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}


