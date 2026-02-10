'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { UserPreferenceResponse, UpdateUserPreferencesRequest } from '@/shared/api/types'
import { getErrorMessage } from '@/shared/api/errors'

/**
 * Query key factory for user preferences
 */
export const userPreferencesKeys = {
  all: ['userPreferences'] as const,
  byUserId: (userId: number) => [...userPreferencesKeys.all, userId] as const,
}

/**
 * Hook to get user preferences
 */
export function useUserPreferences(userId: number | null) {
  return useQuery({
    queryKey: userId ? userPreferencesKeys.byUserId(userId) : ['userPreferences', 'null'],
    queryFn: () => {
      if (!userId) {
        throw new Error('User ID is required')
      }
      return authApi.getUserPreferences(userId)
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to update user preferences
 */
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateUserPreferencesRequest }) =>
      authApi.updateUserPreferences(userId, data),
    onSuccess: (response: UserPreferenceResponse) => {
      // Invalidate and refetch user preferences
      queryClient.invalidateQueries({ queryKey: userPreferencesKeys.byUserId(response.userId) })
    },
    onError: (error) => {
      console.error('Update preferences error:', getErrorMessage(error))
    },
  })
}
