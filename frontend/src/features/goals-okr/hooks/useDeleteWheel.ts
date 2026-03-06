/**
 * useDeleteWheel Hook
 * React Query mutation for deleting a wheel
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteWheel } from '../api/goalsOkrApi'

export function useDeleteWheel() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteWheel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'wheels'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'lifeDomains'] })
    },
  })
}
