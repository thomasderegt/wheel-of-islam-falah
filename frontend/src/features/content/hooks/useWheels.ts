'use client'

import { useQuery } from '@tanstack/react-query'
import { getAllContentWheels, getContentWheelByKey } from '../api/contentApi'
import type { WheelDTO } from '@/shared/api/types'

/**
 * Query key factory for content wheels
 */
export const contentWheelsKeys = {
  all: ['contentWheels'] as const,
  byKey: (wheelKey: string) => [...contentWheelsKeys.all, 'key', wheelKey] as const,
}

/**
 * Hook to get all content wheels
 */
export function useContentWheels() {
  return useQuery({
    queryKey: contentWheelsKeys.all,
    queryFn: () => getAllContentWheels(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to get a content wheel by key
 */
export function useContentWheelByKey(wheelKey: string | null) {
  return useQuery({
    queryKey: wheelKey ? contentWheelsKeys.byKey(wheelKey) : ['contentWheels', 'null'],
    queryFn: () => {
      if (!wheelKey) {
        throw new Error('Wheel key is required')
      }
      return getContentWheelByKey(wheelKey)
    },
    enabled: !!wheelKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
