/**
 * useSectionPublishedVersion Hook
 * React Query hook for fetching published section version
 */

import { useQuery } from '@tanstack/react-query'
import { getSectionPublishedVersion } from '../api/contentApi'

export function useSectionPublishedVersion(sectionId: number | null) {
  return useQuery({
    queryKey: ['sectionPublishedVersion', sectionId],
    queryFn: () => getSectionPublishedVersion(sectionId!),
    enabled: !!sectionId,
  })
}

