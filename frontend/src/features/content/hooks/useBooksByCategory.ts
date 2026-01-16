/**
 * useBooksByCategory Hook
 * React Query hook for fetching books in a category
 */

import { useQuery } from '@tanstack/react-query'
import { getBooksByCategory } from '../api/contentApi'

export function useBooksByCategory(categoryId: number | null) {
  return useQuery({
    queryKey: ['booksByCategory', categoryId],
    queryFn: () => getBooksByCategory(categoryId!),
    enabled: !!categoryId,
  })
}

