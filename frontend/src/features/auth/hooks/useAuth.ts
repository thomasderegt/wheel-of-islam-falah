'use client'

import { useAuthStore } from '../store/authStore'

/**
 * Main auth hook
 * Provides access to auth state and actions
 */
export function useAuth() {
  const { user, tokens, isAuthenticated, setAuth, setUser, setTokens, clearAuth } = useAuthStore()

  return {
    user,
    tokens,
    isAuthenticated,
    setAuth,
    setUser,
    setTokens,
    clearAuth,
  }
}

