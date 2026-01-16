import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthTokens } from '../types'
import { config } from '@/shared/constants/config'

interface AuthStore {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  
  // Actions
  setAuth: (user: User, tokens: AuthTokens) => void
  setUser: (user: User) => void
  setTokens: (tokens: AuthTokens) => void
  clearAuth: () => void
}

/**
 * Auth Zustand store
 * Manages authentication state (user, tokens)
 * Persisted to localStorage
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        // Store tokens in localStorage for API client
        localStorage.setItem(config.auth.tokenKey, tokens.token)
        localStorage.setItem(config.auth.refreshTokenKey, tokens.refreshToken)
        localStorage.setItem(config.auth.userKey, JSON.stringify(user))
        
        set({
          user,
          tokens,
          isAuthenticated: true,
        })
      },

      setUser: (user) => {
        localStorage.setItem(config.auth.userKey, JSON.stringify(user))
        set({ user })
      },

      setTokens: (tokens) => {
        localStorage.setItem(config.auth.tokenKey, tokens.token)
        localStorage.setItem(config.auth.refreshTokenKey, tokens.refreshToken)
        set({ tokens })
      },

      clearAuth: () => {
        localStorage.removeItem(config.auth.tokenKey)
        localStorage.removeItem(config.auth.refreshTokenKey)
        localStorage.removeItem(config.auth.userKey)
        
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

