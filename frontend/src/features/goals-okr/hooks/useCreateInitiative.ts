/**
 * useCreateInitiative Hook
 * React Query mutation for creating a new initiative
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInitiative } from '../api/goalsOkrApi'
import type { InitiativeDTO } from '../api/goalsOkrApi'

interface CreateInitiativeRequest {
  userId: number
  keyResultId: number
  userObjectiveInstanceId: number
  title: string
  description?: string | null
  targetDate?: string | null
  learningFlowEnrollmentId?: number | null
}

export function useCreateInitiative() {
  const queryClient = useQueryClient()

  return useMutation<InitiativeDTO, Error, CreateInitiativeRequest>({
    mutationFn: createInitiative,
    onSuccess: (data) => {
      // Invalidate initiatives queries
      queryClient.invalidateQueries({ 
        queryKey: ['goals-okr', 'initiatives', 'userObjectiveInstance', data.userObjectiveInstanceId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['goals-okr', 'initiatives', 'user', data.userId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['goals-okr', 'initiatives', 'keyResult', data.keyResultId] 
      })
    },
  })
}
