/**
 * useCreateInitiative Hook
 * React Query mutation for creating a new user initiative
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInitiative } from '../api/goalsOkrApi'
import type { UserInitiativeDTO } from '../api/goalsOkrApi'

interface CreateInitiativeRequest {
  userId: number
  keyResultId?: number | null
  userKeyResultInstanceId: number
  title: string
  description?: string | null
  targetDate?: string | null
  learningFlowEnrollmentId?: number | null
}

export function useCreateInitiative() {
  const queryClient = useQueryClient()

  return useMutation<UserInitiativeDTO, Error, CreateInitiativeRequest>({
    mutationFn: createInitiative,
    onSuccess: (data) => {
      // Invalidate initiatives queries
      queryClient.invalidateQueries({ 
        queryKey: ['goals-okr', 'initiatives', 'userKeyResultInstance', data.userKeyResultInstanceId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['goals-okr', 'initiatives', 'user', data.userId] 
      })
      if (data.keyResultId) {
        queryClient.invalidateQueries({ 
          queryKey: ['goals-okr', 'initiatives', 'keyResult', data.keyResultId] 
        })
      }
    },
  })
}
