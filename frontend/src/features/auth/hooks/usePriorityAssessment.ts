'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/authApi'

const QUERY_KEY = 'priorityAssessment'

/**
 * Hook to fetch priority assessment for user
 */
export function usePriorityAssessment(userId: number | null, falahCycleId?: number | null) {
  return useQuery({
    queryKey: [QUERY_KEY, userId, falahCycleId ?? 'standalone'],
    queryFn: () => authApi.getPriorityAssessment(userId!, falahCycleId),
    enabled: !!userId,
  })
}

/**
 * Hook to save priority assessment
 */
export function useSavePriorityAssessment(userId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { scores: Record<string, number>; skippedWheels: string[]; falahCycleId?: number | null }) =>
      authApi.savePriorityAssessment(userId!, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY, userId] })
    },
  })
}
