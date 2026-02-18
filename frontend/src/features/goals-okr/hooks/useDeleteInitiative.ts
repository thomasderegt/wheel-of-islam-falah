/**
 * useDeleteInitiative Hook
 * React Query mutation for deleting a user initiative
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteInitiative } from '../api/goalsOkrApi'

export function useDeleteInitiative() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteInitiative,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'initiatives'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items'] })
    },
  })
}
