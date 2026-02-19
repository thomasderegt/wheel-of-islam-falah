/**
 * Hook for fetching objectives by life domain
 */

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth'
import { getObjectivesByLifeDomain } from '../api/goalsOkrApi'

/**
 * Get objectives by life domain (filtered by user: templates + own custom)
 * Includes userId in query key so cache is invalidated when switching users.
 */
export function useObjectivesByLifeDomain(lifeDomainId: number | null) {
  const { user } = useAuth()
  const userId = user?.id ?? null

  return useQuery({
    queryKey: ['goals-okr', 'objectives', 'lifeDomain', lifeDomainId, userId],
    queryFn: () => getObjectivesByLifeDomain(lifeDomainId!),
    enabled: lifeDomainId !== null,
  })
}
