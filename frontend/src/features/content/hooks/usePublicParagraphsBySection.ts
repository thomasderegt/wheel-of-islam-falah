/**
 * usePublicParagraphsBySection Hook
 * React Query hook for fetching published paragraphs in a section
 * 
 * IMPORTANT: Only returns paragraphs with PUBLISHED status
 * This is a security requirement - DRAFT paragraphs must never be shown to end users
 */

import { useQuery } from '@tanstack/react-query'
import { getPublicParagraphsBySection } from '../api/contentApi'

export function usePublicParagraphsBySection(sectionId: number | null) {
  return useQuery({
    queryKey: ['publicParagraphsBySection', sectionId],
    queryFn: async () => {
      // Use public endpoint - this MUST only return PUBLISHED paragraphs
      // If this endpoint fails, we return empty array to ensure no DRAFT content is shown
      try {
        return await getPublicParagraphsBySection(sectionId!)
      } catch (error: any) {
        // Log error for debugging
        console.error('Failed to fetch published paragraphs:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        })
        
        // Return empty array - this ensures DRAFT paragraphs are NEVER shown
        // This is a security requirement, not a workaround
        return []
      }
    },
    enabled: !!sectionId,
    retry: false, // Don't retry on 404
  })
}


