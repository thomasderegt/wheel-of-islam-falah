/**
 * Auth Feature Types
 */

export interface User {
  id: number
  email: string
  profileName: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED'
  createdAt: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface AuthTokens {
  token: string
  refreshToken: string
  expiresAt: string
}

export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
}

