'use client'

import { useQuery } from '@tanstack/react-query'
import { getCategoriesByWheelId } from '../api/contentApi'
import type { CategoryDTO } from '@/shared/api/types'

/**
 * Query key factory for categories by wheel
 */
export const categoriesByWheelKeys = {
  all: ['categoriesByWheel'] as const,
  byWheelId: (wheelId: number) => [...categoriesByWheelKeys.all, wheelId] as const,
}

/**
 * Hook to get categories by wheel ID
 */
export function useCategoriesByWheelId(wheelId: number | null) {
  return useQuery({
    queryKey: wheelId ? categoriesByWheelKeys.byWheelId(wheelId) : ['categoriesByWheel', 'null'],
    queryFn: () => {
      if (!wheelId) {
        throw new Error('Wheel ID is required')
      }
      return getCategoriesByWheelId(wheelId)
    },
    enabled: !!wheelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
