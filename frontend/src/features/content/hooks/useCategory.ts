/**
 * useCategory Hook
 * React Query hook for fetching category data
 */

import { useQuery } from '@tanstack/react-query'
import { getCategory } from '../api/contentApi'

export function useCategory(categoryId: number | null) {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => getCategory(categoryId!),
    enabled: !!categoryId,
  })
}

