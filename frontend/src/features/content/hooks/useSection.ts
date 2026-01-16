/**
 * useSection Hook
 * React Query hook for fetching section data (admin)
 */

import { useQuery } from '@tanstack/react-query'
import { getSection } from '../api/contentApi'

export function useSection(sectionId: number | null) {
  return useQuery({
    queryKey: ['section', sectionId],
    queryFn: () => getSection(sectionId!),
    enabled: !!sectionId,
  })
}

