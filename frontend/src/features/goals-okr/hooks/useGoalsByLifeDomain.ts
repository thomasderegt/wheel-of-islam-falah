/**
 * Hook for fetching goals by life domain
 */

import { useQuery } from '@tanstack/react-query'
import { getGoalsByLifeDomain } from '../api/goalsOkrApi'

/**
 * Get goals by life domain
 */
export function useGoalsByLifeDomain(lifeDomainId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'goals', 'lifeDomain', lifeDomainId],
    queryFn: () => getGoalsByLifeDomain(lifeDomainId!),
    enabled: lifeDomainId !== null,
  })
}
