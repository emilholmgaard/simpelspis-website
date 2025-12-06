'use client'

import { useState, useEffect } from 'react'
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/button'

interface User {
  id: string
  email: string
  username: string | null
}

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/user')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.reload()
  }

  if (loading) {
    return null
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <UserIcon className="h-5 w-5" />
        <span>{user.username || user.email}</span>
      </div>
      <Button
        variant="outline"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
        Log ud
      </Button>
    </div>
  )
}

