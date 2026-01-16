/**
 * useContentDetail Hook
 * React Query hook for fetching content detail
 */

import { useQuery } from '@tanstack/react-query'

export function useContentDetail(entityId: number | null, entityType: 'BOOK' | 'CHAPTER' | 'SECTION' | 'PARAGRAPH') {
  return useQuery({
    queryKey: ['contentDetail', entityType, entityId],
    queryFn: async () => {
      if (!entityId) return null
      // TODO: Implement API call
      return null
    },
    enabled: !!entityId,
  })
}

