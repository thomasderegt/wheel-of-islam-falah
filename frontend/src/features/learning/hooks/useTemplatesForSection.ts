/**
 * useTemplatesForSection Hook
 * React Query hook for fetching templates for a section
 */

import { useQuery } from '@tanstack/react-query'
import { getTemplatesForSection } from '../api/learningApi'

export function useTemplatesForSection(sectionId: number | null) {
  return useQuery({
    queryKey: ['templatesForSection', sectionId],
    queryFn: () => getTemplatesForSection(sectionId!),
    enabled: !!sectionId,
  })
}
