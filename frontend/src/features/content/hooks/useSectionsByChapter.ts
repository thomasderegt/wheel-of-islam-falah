/**
 * useSectionsByChapter Hook
 * React Query hook for fetching sections in a chapter
 */

import { useQuery } from '@tanstack/react-query'
import { getSectionsByChapter } from '../api/contentApi'

export function useSectionsByChapter(chapterId: number | null) {
  return useQuery({
    queryKey: ['sectionsByChapter', chapterId],
    queryFn: () => getSectionsByChapter(chapterId!),
    enabled: !!chapterId,
  })
}

