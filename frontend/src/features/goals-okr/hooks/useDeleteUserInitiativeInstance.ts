/**
 * useDeleteUserInitiativeInstance Hook
 * React Query mutation for deleting a user initiative instance (e.g. started from template)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUserInitiativeInstance } from '../api/goalsOkrApi'

export function useDeleteUserInitiativeInstance() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: deleteUserInitiativeInstance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'initiatives'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userInitiativeInstances'] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items'] })
    },
  })
}
