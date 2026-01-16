/**
 * useChapter Hook
 * React Query hook for fetching chapter data
 */

import { useQuery } from '@tanstack/react-query'
import { getChapter } from '../api/contentApi'

export function useChapter(chapterId: number | null) {
  return useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => getChapter(chapterId!),
    enabled: !!chapterId,
  })
}

