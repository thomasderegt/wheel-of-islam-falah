/**
 * useParagraph Hook
 * React Query hook for fetching paragraph data
 */

import { useQuery } from '@tanstack/react-query'
import { getParagraph } from '../api/contentApi'

export function useParagraph(paragraphId: number | null) {
  return useQuery({
    queryKey: ['paragraph', paragraphId],
    queryFn: () => getParagraph(paragraphId!),
    enabled: !!paragraphId,
  })
}

