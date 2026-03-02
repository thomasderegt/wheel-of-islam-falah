'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { routes } from '@/shared/constants/routes'

interface ProtectedRouteProps {
  children: ReactNode
}

/**
 * Protected route component
 * Redirects to login if user is not authenticated.
 * Waits for client mount so Zustand persist can rehydrate from localStorage
 * before deciding, to avoid redirect loop on protected pages (e.g. /onboarding).
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return
    if (!isAuthenticated) {
      router.push(routes.login)
    }
  }, [hasMounted, isAuthenticated, router])

  if (!hasMounted || !isAuthenticated) {
    return null
  }

  return <>{children}</>
}

