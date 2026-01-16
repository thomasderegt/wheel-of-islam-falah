/**
 * useBookCurrentVersion Hook
 * React Query hook for fetching current book version
 */

import { useQuery } from '@tanstack/react-query'
import { getBookCurrentVersion } from '../api/contentApi'

export function useBookCurrentVersion(bookId: number | null) {
  return useQuery({
    queryKey: ['bookCurrentVersion', bookId],
    queryFn: () => getBookCurrentVersion(bookId!),
    enabled: !!bookId,
  })
}
