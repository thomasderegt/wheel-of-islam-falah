/**
 * useParagraphsBySection Hook
 * React Query hook for fetching paragraphs in a section
 */

import { useQuery } from '@tanstack/react-query'
import { getParagraphsBySection } from '../api/contentApi'

export function useParagraphsBySection(sectionId: number | null) {
  return useQuery({
    queryKey: ['paragraphsBySection', sectionId],
    queryFn: () => getParagraphsBySection(sectionId!),
    enabled: !!sectionId,
  })
}

