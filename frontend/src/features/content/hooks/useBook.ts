/**
 * useBook Hook
 * React Query hook for fetching book data
 */

import { useQuery } from '@tanstack/react-query'
import { getBook } from '../api/contentApi'

export function useBook(bookId: number | null) {
  return useQuery({
    queryKey: ['book', bookId],
    queryFn: () => getBook(bookId!),
    enabled: !!bookId,
  })
}

