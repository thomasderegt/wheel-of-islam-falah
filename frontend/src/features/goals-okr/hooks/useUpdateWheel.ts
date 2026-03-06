/**
 * useUpdateWheel Hook
 * React Query mutation for updating a wheel
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateWheel, type WheelDTO } from '../api/goalsOkrApi'

export interface UpdateWheelRequest {
  wheelKey: string
  nameNl?: string
  nameEn?: string
  descriptionNl?: string
  descriptionEn?: string
  displayOrder?: number
}

export function useUpdateWheel() {
  const queryClient = useQueryClient()

  return useMutation<WheelDTO, Error, { id: number; request: UpdateWheelRequest }>({
    mutationFn: ({ id, request }) => updateWheel(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'wheels'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'lifeDomains'] })
    },
  })
}
