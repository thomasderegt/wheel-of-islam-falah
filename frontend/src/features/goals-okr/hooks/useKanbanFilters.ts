import { useState } from 'react'

export interface KanbanFilters {
  itemType?: 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE'
}

export function useKanbanFilters(initialFilters: KanbanFilters = {}) {
  const [filters, setFilters] = useState<KanbanFilters>(initialFilters)
  return { filters, setFilters }
}
