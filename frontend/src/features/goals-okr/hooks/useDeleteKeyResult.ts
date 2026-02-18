/**
 * useDeleteKeyResult Hook
 * React Query mutation for deleting a key result (only when no user has started it)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteKeyResult } from '../api/goalsOkrApi'

export function useDeleteKeyResult() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteKeyResult,
    onSuccess: (_, keyResultId) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'keyResults'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'keyResult', keyResultId] })
    },
  })
}
