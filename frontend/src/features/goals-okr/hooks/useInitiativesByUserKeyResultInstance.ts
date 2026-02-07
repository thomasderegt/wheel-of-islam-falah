/**
 * Hook for fetching initiatives by user key result instance
 */

import { useQuery } from '@tanstack/react-query'
import { getInitiativesByUserKeyResultInstance } from '../api/goalsOkrApi'

/**
 * Get initiatives by user key result instance
 */
export function useInitiativesByUserKeyResultInstance(userKeyResultInstanceId: number | null) {
  return useQuery({
    queryKey: ['goals-okr', 'initiatives', 'userKeyResultInstance', userKeyResultInstanceId],
    queryFn: () => getInitiativesByUserKeyResultInstance(userKeyResultInstanceId!),
    enabled: userKeyResultInstanceId !== null,
  })
}
