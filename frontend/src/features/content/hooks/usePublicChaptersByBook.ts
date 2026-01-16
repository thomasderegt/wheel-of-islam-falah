/**
 * usePublicChaptersByBook Hook
 * React Query hook for fetching published chapters in a book
 * 
 * IMPORTANT: Only returns chapters with PUBLISHED status
 * This is a security requirement - DRAFT chapters must never be shown to end users
 */

import { useQuery } from '@tanstack/react-query'
import { getPublicChaptersByBook } from '../api/contentApi'

export function usePublicChaptersByBook(bookId: number | null) {
  return useQuery({
    queryKey: ['publicChaptersByBook', bookId],
    queryFn: async () => {
      // Use public endpoint - this MUST only return PUBLISHED chapters
      // If this endpoint fails, we return empty array to ensure no DRAFT content is shown
      try {
        return await getPublicChaptersByBook(bookId!)
      } catch (error: any) {
        // Log error for debugging
        console.error('Failed to fetch published chapters:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        })
        
        // Return empty array - this ensures DRAFT chapters are NEVER shown
        // This is a security requirement, not a workaround
        return []
      }
    },
    enabled: !!bookId,
    retry: false, // Don't retry on 404
  })
}


