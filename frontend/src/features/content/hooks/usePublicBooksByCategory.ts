/**
 * usePublicBooksByCategory Hook
 * React Query hook for fetching published books in a category
 * 
 * IMPORTANT: Only returns books with PUBLISHED status
 * This is a security requirement - DRAFT books must never be shown to end users
 */

import { useQuery } from '@tanstack/react-query'
import { getPublicBooksByCategory } from '../api/contentApi'

export function usePublicBooksByCategory(categoryId: number | null) {
  return useQuery({
    queryKey: ['publicBooksByCategory', categoryId],
    queryFn: async () => {
      // Use public endpoint - this MUST only return PUBLISHED books
      // If this endpoint fails, we return empty array to ensure no DRAFT content is shown
      try {
        return await getPublicBooksByCategory(categoryId!)
      } catch (error: any) {
        // Log error for debugging
        console.error('Failed to fetch published books:', {
          status: error.response?.status,
          message: error.message,
          url: error.config?.url
        })
        
        // Return empty array - this ensures DRAFT books are NEVER shown
        // This is a security requirement, not a workaround
        return []
      }
    },
    enabled: !!categoryId,
    retry: false, // Don't retry on 404
  })
}

