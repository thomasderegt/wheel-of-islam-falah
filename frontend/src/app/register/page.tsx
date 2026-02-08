'use client'

/**
 * Register Page Component
 * 
 * Deze pagina laat gebruikers een nieuw account aanmaken.
 * De gebruiker kan hier:
 * - Registreren met email en wachtwoord
 * - Navigeren naar de login pagina
 */

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/components/ui/select'
import { useRegister } from '@/features/auth'
import { getErrorMessage } from '@/shared/api/errors'
import { useTheme } from '@/shared/contexts/ThemeContext'

export default function RegisterPage() {
  const registerMutation = useRegister()
  const { availableGroups, setUserGroup } = useTheme()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<string>('universal')
  const [error, setError] = useState<string | null>(null)
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Email validatie
    if (!email.trim()) {
      setError('Email is verplicht')
      return
    }

    // Email format validatie
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Ongeldig email adres')
      return
    }

    // Password validatie
    if (!password) {
      setError('Wachtwoord is verplicht')
      return
    }

    // Password length validatie (minimaal 8 tekens)
    if (password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens lang zijn')
      return
    }

    if (password.length > 128) {
      setError('Wachtwoord mag maximaal 128 tekens lang zijn')
      return
    }

    // Password confirmation validatie
    if (password !== confirmPassword) {
      setError('Wachtwoorden komen niet overeen')
      return
    }

    try {
      await registerMutation.mutateAsync({
        email: email.trim(),
        password: password,
      })
      // Save selected theme to localStorage and apply it
      setUserGroup(selectedTheme)
      // useRegister hook redirects automatically to /login
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/BackgroundPictures/BackgroundLandingPageImage.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Card className="w-full max-w-md relative z-10 bg-card/90 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Account aanmaken
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Maak een nieuw account aan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Email input */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                disabled={registerMutation.isPending}
              />
            </div>
            
            {/* Password input */}
            <div className="space-y-2">
              <Label htmlFor="password">
                Wachtwoord
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wachtwoord"
                required
                disabled={registerMutation.isPending}
              />
            </div>

            {/* Confirm Password input */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Bevestig wachtwoord
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Bevestig wachtwoord"
                required
                disabled={registerMutation.isPending}
              />
            </div>

            {/* Theme selection */}
            <div className="space-y-2">
              <Label htmlFor="theme">
                Kies je theme
              </Label>
              <Select
                value={selectedTheme}
                onValueChange={setSelectedTheme}
                disabled={registerMutation.isPending}
              >
                <SelectTrigger id="theme" className="w-full">
                  <SelectValue placeholder="Selecteer een theme" />
                </SelectTrigger>
                <SelectContent>
                  {availableGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group === 'adult-woman' ? 'Adult Woman' :
                       group === 'adult-man' ? 'Adult Man' :
                       group === 'young-adult-male' ? 'Young Adult Male' :
                       group === 'young-adult-female' ? 'Young Adult Female' :
                       'Universal'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Register button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                variant="default"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Bezig...' : 'Registreren'}
              </Button>
            </div>
            
            {/* Link to login */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Heb je al een account?{' '}
              </span>
              <Link href="/login" className="text-primary hover:underline">
                Inloggen
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
