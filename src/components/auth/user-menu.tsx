'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserIcon, ArrowRightOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/button'

interface User {
  id: string
  email: string
  username: string | null
}

interface UserMenuProps {
  user: User
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.reload()
  }

  if (!user) {
    return null
  }

  return (
    <>
      <div className="relative flex items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2"
        >
          <span>Konto</span>
          <ChevronDownIcon className={`h-4 w-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
        </Button>
        
        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 rounded-3xl bg-white dark:bg-gray-800 p-3 shadow-lg ring-1 ring-black/5 dark:ring-white/10 z-50">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowMenu(false)
                    router.push('/konto')
                  }}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-950 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors flex items-center gap-3"
                >
                  <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  Indstillinger
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-950 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors flex items-center gap-3"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  Log ud
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
