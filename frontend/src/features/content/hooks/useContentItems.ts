/**
 * useContentItems Hook
 * React Query hook for fetching content items list (single API call to GET /api/v2/content/items).
 */

import { useQuery } from '@tanstack/react-query'
import { getContentItems } from '../api/contentApi'
import type { ContentItem } from '../components/ContentItemsTable'

export interface ContentFilters {
  type?: 'BOOK' | 'CHAPTER' | 'SECTION' | 'PARAGRAPH'
  bookId?: number
  categoryId?: number
}

export function useContentItems(filters?: ContentFilters) {
  return useQuery({
    queryKey: ['contentItems', filters],
    queryFn: async (): Promise<ContentItem[]> => {
      const items = await getContentItems(filters)
      return items as ContentItem[]
    },
  })
}
