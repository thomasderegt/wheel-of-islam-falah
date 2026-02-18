'use client'

/**
 * Change Password Page
 *
 * Route: /user/settings/change-password
 */

import { ProtectedRoute } from '@/features/auth'
import Navbar from '@/shared/components/navigation/Navbar'
import { Container } from '@/shared/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { authApi } from '@/features/auth/api/authApi'
import { getErrorMessage } from '@/shared/api/errors'
import { useState } from 'react'
import Link from 'next/link'
import { Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function ChangePasswordPage() {
  const { user } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError(null)
    setSuccess(false)

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Vul alle velden in')
      return
    }
    if (newPassword.length < 8) {
      setError('Nieuw wachtwoord moet minimaal 8 tekens lang zijn')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }
    if (oldPassword === newPassword) {
      setError('Nieuw wachtwoord moet anders zijn dan het huidige wachtwoord')
      return
    }

    if (!user?.id) return

    setLoading(true)
    try {
      await authApi.changePassword(user.id, {
        oldPassword,
        newPassword,
      })
      setSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <Navbar variant="landing" />

        <main className="flex-1 flex flex-col p-8">
          <Container className="max-w-md mx-auto">
            <Link
              href="/user/settings"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Terug naar instellingen
            </Link>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Verander wachtwoord
                </h1>
                <p className="text-muted-foreground mt-1">
                  Wijzig je wachtwoord. Minimaal 8 tekens.
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Nieuw wachtwoord instellen
                  </CardTitle>
                  <CardDescription>
                    Voer je huidige wachtwoord in en kies een nieuw wachtwoord.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Huidig wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="oldPassword"
                        type={showOldPassword ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Huidig wachtwoord"
                        disabled={loading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        aria-label={showOldPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
                      >
                        {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nieuw wachtwoord"
                        disabled={loading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        aria-label={showNewPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Bevestig nieuw wachtwoord</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Bevestig nieuw wachtwoord"
                        disabled={loading}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Wachtwoord verbergen' : 'Wachtwoord tonen'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  {success && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Wachtwoord is succesvol gewijzigd.
                    </p>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Bezig...' : 'Wachtwoord wijzigen'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </Container>
        </main>
      </div>
    </ProtectedRoute>
  )
}
