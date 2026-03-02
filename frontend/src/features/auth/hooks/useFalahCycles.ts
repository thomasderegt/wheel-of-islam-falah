'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api/authApi'

/**
 * Hook to fetch user's Falah cycles
 */
export function useFalahCycles(userId: number | null) {
  return useQuery({
    queryKey: ['falahCycles', userId],
    queryFn: () => authApi.getFalahCycles(userId!),
    enabled: !!userId,
  })
}

/**
 * Hook to start a new Falah cycle
 */
export function useStartFalahCycle(userId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.startFalahCycle(userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['falahCycles', userId] })
    },
  })
}

/**
 * Hook to exit the Falah cycle creation flow (Finish)
 */
export function useExitFalahCycleFlow(userId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cycleId: number) => authApi.exitFalahCycleFlow(userId!, cycleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['falahCycles', userId] })
    },
  })
}

/**
 * Hook to re-enter the Falah cycle creation flow (Continue)
 */
export function useReEnterFalahCycleFlow(userId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cycleId: number) => authApi.reEnterFalahCycleFlow(userId!, cycleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['falahCycles', userId] })
    },
  })
}

/**
 * Hook to complete a Falah cycle
 */
export function useCompleteFalahCycle(userId: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (cycleId: number) => authApi.completeFalahCycle(userId!, cycleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['falahCycles', userId] })
    },
  })
}
