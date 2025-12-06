'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Button } from './button'

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

  const currentLabel = sortOptions.find(opt => opt.value === currentSort)?.label || 'Standard'

  return (
    <Menu as="div" className="relative">
      <MenuButton as={Button} variant="outline" className="text-sm">
        {currentLabel}
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </MenuButton>
      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-2xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
        <div className="py-1">
          {sortOptions.map((option) => (
            <MenuItem key={option.value}>
              {({ focus }) => (
                <button
                  onClick={() => handleChange(option.value)}
                  className={`${
                    focus ? 'bg-gray-50 dark:bg-gray-700' : ''
                  } ${
                    currentSort === option.value ? 'font-semibold' : ''
                  } block w-full text-left px-4 py-2 text-sm text-gray-950 dark:text-gray-50`}
                >
                  {option.label}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  )
}



