/**
 * useCreateWheel Hook
 * React Query mutation for creating a wheel
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createWheel, type WheelDTO } from '../api/goalsOkrApi'

export interface CreateWheelRequest {
  wheelKey: string
  nameNl?: string
  nameEn?: string
  descriptionNl?: string
  descriptionEn?: string
  displayOrder?: number
}

export function useCreateWheel() {
  const queryClient = useQueryClient()

  return useMutation<WheelDTO, Error, CreateWheelRequest>({
    mutationFn: createWheel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'wheels'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'lifeDomains'] })
    },
  })
}
