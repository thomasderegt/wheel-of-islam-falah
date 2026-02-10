import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export interface KanbanFilters {
  itemType?: 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT' | 'INITIATIVE'
  lifeDomainId?: number
  wheelType?: 'life' | 'business'
  showInitiatives?: boolean
  wipLimits?: {
    life?: {
      TODO?: number
      IN_PROGRESS?: number
      IN_REVIEW?: number
      DONE?: number
    }
    business?: {
      TODO?: number
      IN_PROGRESS?: number
      IN_REVIEW?: number
      DONE?: number
    }
  }
}

export function useKanbanFilters(initialFilters: KanbanFilters = {}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  // Load WIP limits from localStorage
  const loadWipLimitsFromStorage = (): KanbanFilters['wipLimits'] => {
    if (typeof window === 'undefined') return undefined
    try {
      const stored = localStorage.getItem('kanban-wip-limits')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load WIP limits from localStorage:', e)
    }
    return undefined
  }

  // Save WIP limits to localStorage
  const saveWipLimitsToStorage = (wipLimits: KanbanFilters['wipLimits']) => {
    if (typeof window === 'undefined') return
    try {
      if (wipLimits && Object.keys(wipLimits).length > 0) {
        localStorage.setItem('kanban-wip-limits', JSON.stringify(wipLimits))
      } else {
        localStorage.removeItem('kanban-wip-limits')
      }
    } catch (e) {
      console.error('Failed to save WIP limits to localStorage:', e)
    }
  }
  
  // Helper function to get filters from URL
  const getFiltersFromURL = (params: URLSearchParams | null): KanbanFilters => {
    const filters: KanbanFilters = {}
    
    if (!params) return filters
    
    const itemType = params.get('itemType')
    if (itemType && ['GOAL', 'OBJECTIVE', 'KEY_RESULT', 'INITIATIVE'].includes(itemType)) {
      filters.itemType = itemType as KanbanFilters['itemType']
    }
    
    const lifeDomainId = params.get('lifeDomainId')
    if (lifeDomainId) {
      const id = parseInt(lifeDomainId)
      if (!isNaN(id)) {
        filters.lifeDomainId = id
      }
    }
    
    const wheelType = params.get('wheelType')
    if (wheelType && (wheelType === 'life' || wheelType === 'business')) {
      filters.wheelType = wheelType as 'life' | 'business'
    }
    
    const showInitiatives = params.get('showInitiatives')
    if (showInitiatives === 'true') {
      filters.showInitiatives = true
    }
    
    return filters
  }
  
  const [filters, setFiltersState] = useState<KanbanFilters>(() => {
    const urlFilters = getFiltersFromURL(searchParams)
    const wipLimits = loadWipLimitsFromStorage()
    // Merge with initialFilters, URL takes precedence, but include WIP limits from storage
    return { ...initialFilters, ...urlFilters, wipLimits }
  })
  
  // Update filters when URL changes
  useEffect(() => {
    const urlFilters = getFiltersFromURL(searchParams)
    const wipLimits = loadWipLimitsFromStorage()
    setFiltersState(prev => {
      // Only update if URL filters are different, but preserve WIP limits
      const newFilters = { ...initialFilters, ...urlFilters, wipLimits: prev.wipLimits || wipLimits }
      if (JSON.stringify(prev) !== JSON.stringify(newFilters)) {
        return newFilters
      }
      return prev
    })
  }, [searchParams, initialFilters])
  
  const setFilters = useCallback((newFilters: KanbanFilters | ((prev: KanbanFilters) => KanbanFilters)) => {
    const updatedFilters = typeof newFilters === 'function' 
      ? newFilters(filters) 
      : newFilters
    
    // Save WIP limits to localStorage when they change
    if (updatedFilters.wipLimits !== filters.wipLimits) {
      saveWipLimitsToStorage(updatedFilters.wipLimits)
    }
    
    setFiltersState(updatedFilters)
    
    // Update URL query parameters (but not WIP limits - they're stored in localStorage)
    const params = new URLSearchParams()
    
    if (updatedFilters.itemType) {
      params.set('itemType', updatedFilters.itemType)
    }
    
    if (updatedFilters.lifeDomainId) {
      params.set('lifeDomainId', updatedFilters.lifeDomainId.toString())
    }
    
    if (updatedFilters.wheelType) {
      params.set('wheelType', updatedFilters.wheelType)
    }
    
    if (updatedFilters.showInitiatives) {
      params.set('showInitiatives', 'true')
    }
    
    // WIP limits are not stored in URL
    
    // Update URL without causing a page reload
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.replace(newUrl, { scroll: false })
  }, [filters, pathname, router])
  
  return { filters, setFilters }
}
