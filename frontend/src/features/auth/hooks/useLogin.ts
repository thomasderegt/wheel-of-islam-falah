'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '../api/authApi'
import { useAuth } from './useAuth'
import { LoginRequest, LoginResponse } from '@/shared/api/types'
import { getErrorMessage } from '@/shared/api/errors'
import { routes } from '@/shared/constants/routes'

/**
 * Login mutation hook
 */
export function useLogin() {
  const router = useRouter()
  const { setAuth } = useAuth()

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: async (response: LoginResponse) => {
      // Get user details
      const user = await authApi.getCurrentUser(response.userId)
      
      // Set auth state
      setAuth(
        {
          id: user.id,
          email: user.email,
          profileName: user.profileName,
          status: user.status,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        {
          token: response.token,
          refreshToken: response.refreshToken,
          expiresAt: response.expiresAt,
        }
      )

      // Redirect to home
      router.push(routes.home)
    },
    onError: (error) => {
      // Error is handled by component
      console.error('Login error:', getErrorMessage(error))
    },
  })
}

