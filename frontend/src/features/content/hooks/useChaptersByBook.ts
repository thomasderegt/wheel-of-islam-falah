/**
 * useChaptersByBook Hook
 * React Query hook for fetching chapters in a book
 */

import { useQuery } from '@tanstack/react-query'
import { getChaptersByBook } from '../api/contentApi'

export function useChaptersByBook(bookId: number | null) {
  return useQuery({
    queryKey: ['chaptersByBook', bookId],
    queryFn: () => getChaptersByBook(bookId!),
    enabled: !!bookId,
  })
}

