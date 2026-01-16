/**
 * Hook for managing template filters
 */

import { useState, useCallback } from 'react'

export interface TemplateFilter {
  templateName?: string
  sectionId?: number
}

export function useTemplateFilters(initialFilters: TemplateFilter = {}) {
  const [filters, setFilters] = useState<TemplateFilter>(initialFilters)

  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  return { filters, setFilters, clearFilters }
}
