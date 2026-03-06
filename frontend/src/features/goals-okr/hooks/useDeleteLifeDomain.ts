/**
 * useDeleteLifeDomain Hook
 * React Query mutation for deleting a life domain
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteLifeDomain } from '../api/goalsOkrApi'

export function useDeleteLifeDomain() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteLifeDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'lifeDomains'] })
    },
  })
}
