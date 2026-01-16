/**
 * useVersionHistory Hook
 * React Query hook for fetching version history
 */

import { useQuery } from '@tanstack/react-query'
import { 
  getBookVersionHistory, 
  getChapterVersionHistory, 
  getParagraphVersionHistory, 
  getSectionVersionHistory 
} from '../api/contentApi'

export type EntityType = 'BOOK' | 'CHAPTER' | 'PARAGRAPH' | 'SECTION'

export function useVersionHistory(entityId: number | null, entityType: EntityType) {
  return useQuery({
    queryKey: ['versionHistory', entityType, entityId],
    queryFn: async () => {
      if (!entityId) return []
      
      switch (entityType) {
        case 'BOOK':
          return getBookVersionHistory(entityId)
        case 'CHAPTER':
          return getChapterVersionHistory(entityId)
        case 'PARAGRAPH':
          return getParagraphVersionHistory(entityId)
        case 'SECTION':
          return getSectionVersionHistory(entityId)
        default:
          return []
      }
    },
    enabled: !!entityId,
  })
}

