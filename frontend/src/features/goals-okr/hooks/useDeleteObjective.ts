/**
 * useDeleteObjective Hook
 * React Query mutation for deleting an objective (only when no user has started it)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteObjective } from '../api/goalsOkrApi'

export function useDeleteObjective() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteObjective,
    onSuccess: (_, objectiveId) => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'objectives'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'objective', objectiveId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'keyResults'] })
    },
  })
}
