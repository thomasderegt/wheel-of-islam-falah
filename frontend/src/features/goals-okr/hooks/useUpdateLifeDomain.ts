/**
 * useUpdateLifeDomain Hook
 * React Query mutation for updating a life domain
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateLifeDomain, type LifeDomainDTO } from '../api/goalsOkrApi'

export interface UpdateLifeDomainRequest {
  wheelId: number
  titleNl?: string
  titleEn?: string
  descriptionNl?: string
  descriptionEn?: string
  iconName?: string
  displayOrder?: number
}

export function useUpdateLifeDomain() {
  const queryClient = useQueryClient()

  return useMutation<LifeDomainDTO, Error, { id: number; request: UpdateLifeDomainRequest }>({
    mutationFn: ({ id, request }) => updateLifeDomain(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'lifeDomains'] })
    },
  })
}
