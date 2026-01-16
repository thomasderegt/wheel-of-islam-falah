'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from './useAuth'
import { routes } from '@/shared/constants/routes'

/**
 * Logout hook
 */
export function useLogout() {
  const router = useRouter()
  const { clearAuth } = useAuth()

  return () => {
    clearAuth()
    router.push(routes.login)
  }
}

