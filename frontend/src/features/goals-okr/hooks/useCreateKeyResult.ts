/**
 * useCreateKeyResult Hook
 * React Query mutation for creating a new key result
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createKeyResult } from '../api/goalsOkrApi'
import type { KeyResultDTO } from '../api/goalsOkrApi'

interface CreateKeyResultRequest {
  objectiveId: number
  titleNl?: string
  titleEn?: string
  descriptionNl?: string
  descriptionEn?: string
  targetValue: number
  unit: string
  orderIndex: number
}

export function useCreateKeyResult() {
  const queryClient = useQueryClient()

  return useMutation<KeyResultDTO, Error, CreateKeyResultRequest>({
    mutationFn: createKeyResult,
    onSuccess: (data) => {
      // Invalidate key results queries
      queryClient.invalidateQueries({ 
        queryKey: ['goals-okr', 'keyResults', 'objective', data.objectiveId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ['goals-okr', 'keyResults'] 
      })
    },
  })
}
