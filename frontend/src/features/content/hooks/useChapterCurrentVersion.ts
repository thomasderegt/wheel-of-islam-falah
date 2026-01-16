/**
 * useChapterCurrentVersion Hook
 * React Query hook for fetching current chapter version
 */

import { useQuery } from '@tanstack/react-query'
import { getChapterCurrentVersion } from '../api/contentApi'

export function useChapterCurrentVersion(chapterId: number | null) {
  return useQuery({
    queryKey: ['chapterCurrentVersion', chapterId],
    queryFn: () => getChapterCurrentVersion(chapterId!),
    enabled: !!chapterId,
  })
}
