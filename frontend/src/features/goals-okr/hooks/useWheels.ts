/**
 * Hook for fetching wheels from OKR module
 */

import { useQuery } from '@tanstack/react-query'
import { getAllWheels } from '../api/goalsOkrApi'

/**
 * Get all wheels
 */
export function useWheels() {
  return useQuery({
    queryKey: ['goals-okr', 'wheels'],
    queryFn: getAllWheels,
    retry: (failureCount, error: any) => {
      // Don't retry on network errors (no response) - backend might not be available
      if (!error?.response && failureCount >= 1) {
        return false
      }
      // Retry up to 2 times for other errors
      return failureCount < 2
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  })
}
