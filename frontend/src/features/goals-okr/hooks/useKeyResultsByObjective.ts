/**
 * Hook for fetching key results by objective
 */

import { useQuery } from '@tanstack/react-query'
import { getKeyResultsByObjective } from '../api/goalsOkrApi'

/**
 * Get key results by objective
 */
export function useKeyResultsByObjective(objectiveId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'keyResults', 'objective', objectiveId],
    queryFn: () => getKeyResultsByObjective(objectiveId!),
    enabled: objectiveId !== null,
  })
}
