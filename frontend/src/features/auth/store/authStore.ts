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

/** SSR-safe storage: no localStorage access on server (Next.js) */
const safeStorage = {
  getItem: (name: string) =>
    typeof globalThis.window === 'undefined' ? null : localStorage.getItem(name),
  setItem: (name: string, value: string) => {
    if (typeof globalThis.window !== 'undefined') localStorage.setItem(name, value)
  },
  removeItem: (name: string) => {
    if (typeof globalThis.window !== 'undefined') localStorage.removeItem(name)
  },
}

/**
 * Auth Zustand store
 * Manages authentication state (user, tokens)
 * Persisted to localStorage (SSR-safe)
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        if (typeof globalThis.window !== 'undefined') {
          localStorage.setItem(config.auth.tokenKey, tokens.token)
          localStorage.setItem(config.auth.refreshTokenKey, tokens.refreshToken)
          localStorage.setItem(config.auth.userKey, JSON.stringify(user))
        }
        set({ user, tokens, isAuthenticated: true })
      },

      setUser: (user) => {
        if (typeof globalThis.window !== 'undefined') {
          localStorage.setItem(config.auth.userKey, JSON.stringify(user))
        }
        set({ user })
      },

      setTokens: (tokens) => {
        if (typeof globalThis.window !== 'undefined') {
          localStorage.setItem(config.auth.tokenKey, tokens.token)
          localStorage.setItem(config.auth.refreshTokenKey, tokens.refreshToken)
        }
        set({ tokens })
      },

      clearAuth: () => {
        if (typeof globalThis.window !== 'undefined') {
          localStorage.removeItem(config.auth.tokenKey)
          localStorage.removeItem(config.auth.refreshTokenKey)
          localStorage.removeItem(config.auth.userKey)
        }
        set({ user: null, tokens: null, isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      storage: safeStorage as unknown as { getItem: (n: string) => string | null; setItem: (n: string, v: string) => void; removeItem: (n: string) => void },
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

