'use client'

/**
 * Login Page Component
 * 
 * Dit is de login pagina waar gebruikers kunnen inloggen.
 * De gebruiker kan hier:
 * - Inloggen met email en wachtwoord
 * - Navigeren naar de register pagina
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { getErrorMessage } from '@/shared/api/errors'

export default function LoginPage() {
  const router = useRouter()
  const loginMutation = useLogin()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const handleLogin = async (e: React.FormEvent) => {
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

    try {
      await loginMutation.mutateAsync({ 
        email: email.trim(), 
        password 
      })
      // useLogin hook redirects automatically to /home
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
      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Inloggen
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Log in op je account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error message */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="Email"
              />
            </div>
          
            {/* Password input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                placeholder="Wachtwoord"
                required
              />
            </div>
          
            {/* Login button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                variant="default"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Inloggen...' : 'Inloggen'}
              </Button>
            </div>
          </form>
          
          {/* Link to register */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Nog geen account?{' '}
            </span>
            <Link href="/register" className="text-primary hover:underline">
              Registreren
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

