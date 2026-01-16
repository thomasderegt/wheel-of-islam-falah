/**
 * useContentFilters Hook
 * Hook for managing content filters state
 */

import { useState } from 'react'
import type { ContentFilters } from './useContentItems'

export function useContentFilters() {
  const [filters, setFilters] = useState<ContentFilters>({})
  
  const clearFilters = () => {
    setFilters({})
  }
  
  return {
    filters,
    setFilters,
    clearFilters,
  }
}

