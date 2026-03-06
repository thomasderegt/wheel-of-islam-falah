/**
 * useCreateLifeDomain Hook
 * React Query mutation for creating a life domain
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLifeDomain, type LifeDomainDTO } from '../api/goalsOkrApi'

export interface CreateLifeDomainRequest {
  wheelId: number
  titleNl?: string
  titleEn?: string
  descriptionNl?: string
  descriptionEn?: string
  iconName?: string
  displayOrder?: number
}

export function useCreateLifeDomain() {
  const queryClient = useQueryClient()

  return useMutation<LifeDomainDTO, Error, CreateLifeDomainRequest>({
    mutationFn: createLifeDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'lifeDomains'] })
    },
  })
}
