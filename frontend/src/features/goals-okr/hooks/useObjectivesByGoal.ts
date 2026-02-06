/**
 * Hook for fetching objectives by goal
 */

import { useQuery } from '@tanstack/react-query'
import { getObjectivesByGoal } from '../api/goalsOkrApi'

/**
 * Get objectives by goal
 */
export function useObjectivesByGoal(goalId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'objectives', 'goal', goalId],
    queryFn: () => getObjectivesByGoal(goalId!),
    enabled: goalId !== null,
  })
}
