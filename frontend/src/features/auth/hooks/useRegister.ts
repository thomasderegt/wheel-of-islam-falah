'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authApi } from '../api/authApi'
import { RegisterRequest } from '@/shared/api/types'
import { getErrorMessage } from '@/shared/api/errors'
import { routes } from '@/shared/constants/routes'

/**
 * Register mutation hook
 */
export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      // Redirect to login after successful registration
      router.push(routes.login)
    },
    onError: (error) => {
      // Error is handled by component
      console.error('Register error:', getErrorMessage(error))
    },
  })
}

