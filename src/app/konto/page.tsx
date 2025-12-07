'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrashIcon } from '@heroicons/react/24/outline'
import { Container } from '@/components/container'
import { GradientBackground } from '@/components/gradient'
import { Navbar } from '@/components/navbar'
import { Heading, Subheading } from '@/components/text'
import { Button } from '@/components/button'

interface User {
  id: string
  email: string
  username: string | null
}

export default function KontoPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form states
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmCode, setDeleteConfirmCode] = useState('')
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/user')
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
        setUsername(data.user.username || '')
        setEmail(data.user.email || '')
        setLoading(false)
      } else {
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      router.push('/')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const updates: { username?: string | null; email?: string } = {}
      if (username !== user?.username) {
        updates.username = username || null
      }
      if (email !== user?.email) {
        updates.email = email
      }

      if (Object.keys(updates).length === 0) {
        setSuccess('Ingen ændringer at gemme')
        setSaving(false)
        return
      }

      const response = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Noget gik galt')
        return
      }

      setSuccess('Profil opdateret')
      fetchUser()
    } catch {
      setError('Noget gik galt. Prøv igen.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    if (newPassword !== confirmPassword) {
      setError('Nye adgangskoder matcher ikke')
      setSaving(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Ny adgangskode skal være mindst 6 tegn')
      setSaving(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Noget gik galt')
        return
      }

      setSuccess('Adgangskode ændret')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setError('Noget gik galt. Prøv igen.')
    } finally {
      setSaving(false)
    }
  }

  const generateDeleteCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleShowDeleteConfirm = () => {
    const code = generateDeleteCode()
    setDeleteConfirmCode(code)
    setShowDeleteConfirm(true)
    setDeleteConfirmText('')
    setError('')
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== deleteConfirmCode) {
      setError('Bekræftelseskoden matcher ikke. Prøv igen.')
      return
    }

    setDeleting(true)
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Kunne ikke slette konto')
        return
      }

      // Logout and redirect
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch {
      setError('Noget gik galt. Prøv igen.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
        <GradientBackground />
        <Navbar />
        <Container className="mt-28 pb-24">
          <p className="text-gray-600 dark:text-gray-400">Indlæser...</p>
        </Container>
      </main>
    )
  }

  return (
    <main className="overflow-hidden min-h-screen bg-white dark:bg-gray-950">
      <GradientBackground />
      <Navbar />
      <Container className="mt-28 pb-24">
        <Subheading>Konto</Subheading>
        <Heading as="h1" className="mt-2">
          Profil indstillinger
        </Heading>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-600 dark:text-green-400">
            {success}
          </div>
        )}

        <div className="mt-8 max-w-2xl space-y-12">
          {/* Update Profile */}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-50">
              Opdater profil
            </h3>
            
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Brugernavn
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full max-w-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
                placeholder="Dit brugernavn"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full max-w-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? 'Gemmer...' : 'Gem ændringer'}
            </Button>
          </form>

          {/* Change Password */}
          <form onSubmit={handleChangePassword} className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-50">
              Skift adgangskode
            </h3>

            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nuværende adgangskode
              </label>
              <input
                id="current-password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full max-w-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Ny adgangskode
              </label>
              <input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                className="w-full max-w-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Bekræft ny adgangskode
              </label>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                className="w-full max-w-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:focus:ring-white"
              />
            </div>

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? 'Skifter...' : 'Skift adgangskode'}
            </Button>
          </form>

          {/* Delete Account */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
              Slet konto
            </h3>
            
            {!showDeleteConfirm ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Når du sletter din konto, bliver alle dine anmeldelser og data permanent slettet. 
                  Denne handling kan ikke fortrydes.
                </p>
                <Button
                  variant="outline"
                  onClick={handleShowDeleteConfirm}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  <TrashIcon className="h-4 w-4" />
                  Slet min konto
                </Button>
              </div>
            ) : (
              <div className="space-y-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm font-medium text-red-900 dark:text-red-200">
                  ⚠️ Dette kan ikke fortrydes!
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  For at bekræfte, at du vil slette din konto, skriv følgende kode i feltet nedenfor:
                </p>
                <div 
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 border-2 border-red-300 dark:border-red-700 select-none"
                  onCopy={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <p className="text-lg font-mono font-bold text-center text-red-600 dark:text-red-400 tracking-wider">
                    {deleteConfirmCode}
                  </p>
                </div>
                <label htmlFor="delete-confirm-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bekræftelseskode
                </label>
                <input
                  id="delete-confirm-code"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                  onPaste={(e) => {
                    e.preventDefault()
                    setError('Du kan ikke indsætte tekst. Skriv koden manuelt.')
                  }}
                  onCopy={(e) => {
                    e.preventDefault()
                    setError('Du kan ikke kopiere fra dette felt.')
                  }}
                  onCut={(e) => {
                    e.preventDefault()
                    setError('Du kan ikke klippe fra dette felt.')
                  }}
                  placeholder="Indtast bekræftelseskoden manuelt"
                  className="w-full max-w-sm rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-mono text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 uppercase tracking-wider"
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDeleteAccount}
                    disabled={deleting || deleteConfirmText !== deleteConfirmCode}
                    className="flex-1 text-red-600 dark:text-red-400"
                  >
                    {deleting ? 'Sletter...' : 'Ja, slet min konto permanent'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteConfirmText('')
                      setDeleteConfirmCode('')
                      setError('')
                    }}
                    className="flex-1"
                  >
                    Annuller
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}

