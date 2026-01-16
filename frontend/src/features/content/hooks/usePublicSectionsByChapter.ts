/**
 * usePublicSectionsByChapter Hook
 * React Query hook for fetching published sections in a chapter
 * 
 * IMPORTANT: Only returns sections with PUBLISHED status
 * This is a security requirement - DRAFT sections must never be shown to end users
 */

import { useQuery } from '@tanstack/react-query'
import { getPublicSectionsByChapter } from '../api/contentApi'

export function usePublicSectionsByChapter(chapterId: number | null) {
  return useQuery({
    queryKey: ['publicSectionsByChapter', chapterId],
    queryFn: async () => {
      // Use public endpoint - this MUST only return PUBLISHED sections
      // If this endpoint fails, we return empty array to ensure no DRAFT content is shown
      try {
        return await getPublicSectionsByChapter(chapterId!)
      } catch (error: any) {
        // Log error for debugging
        console.error('Failed to fetch published sections:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        })
        
        // Return empty array - this ensures DRAFT sections are NEVER shown
        // This is a security requirement, not a workaround
        return []
      }
    },
    enabled: !!chapterId,
    retry: false, // Don't retry on 404
  })
}


