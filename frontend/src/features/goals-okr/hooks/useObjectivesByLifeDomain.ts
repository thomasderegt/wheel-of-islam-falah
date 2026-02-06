/**
 * Hook for fetching objectives by life domain
 */

import { useQuery } from '@tanstack/react-query'
import { getObjectivesByLifeDomain } from '../api/goalsOkrApi'

/**
 * Get objectives by life domain
 */
export function useObjectivesByLifeDomain(lifeDomainId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'objectives', 'lifeDomain', lifeDomainId],
    queryFn: () => getObjectivesByLifeDomain(lifeDomainId!),
    enabled: lifeDomainId !== null,
  })
}
