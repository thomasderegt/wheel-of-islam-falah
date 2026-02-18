/**
 * useCreateInitiative Hook
 * React Query mutation for creating a new user initiative
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createInitiative, addKanbanItem } from '../api/goalsOkrApi'
import type { UserInitiativeDTO } from '../api/goalsOkrApi'

interface CreateInitiativeRequest {
  userId: number
  keyResultId?: number | null
  userKeyResultInstanceId: number
  title: string
  description?: string | null
  targetDate?: string | null
  learningFlowEnrollmentId?: number | null
}

export function useCreateInitiative() {
  const queryClient = useQueryClient()

  return useMutation<UserInitiativeDTO, Error, CreateInitiativeRequest>({
    mutationFn: createInitiative,
    onSuccess: async (data) => {
      // Debug: trace why user-created initiative may not appear on kanban
      if (process.env.NODE_ENV === 'development') {
        console.log('[useCreateInitiative] Create response:', {
          id: data.id,
          userId: data.userId,
          userInitiativeInstanceId: data.userInitiativeInstanceId,
          keyResultId: data.keyResultId,
          hasInstanceId: !!data.userInitiativeInstanceId,
        })
      }
      // Add to kanban (backend also adds; frontend ensures it appears if backend add failed)
      if (data.userInitiativeInstanceId && data.userId) {
        try {
          await addKanbanItem({
            userId: data.userId,
            itemType: 'INITIATIVE',
            itemId: data.userInitiativeInstanceId,
          })
          if (process.env.NODE_ENV === 'development') {
            console.log('[useCreateInitiative] Kanban add succeeded for instance', data.userInitiativeInstanceId)
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e)
          const respError = (e as { response?: { data?: { error?: string } } })?.response?.data?.error ?? ''
          const isDuplicate = [msg, respError].some(s => /already exists|Item already exists/i.test(s))
          if (process.env.NODE_ENV === 'development') {
            console.log('[useCreateInitiative] Kanban add result:', { isDuplicate, msg, respError })
          }
          if (!isDuplicate) {
            console.warn('[useCreateInitiative] Failed to add initiative to kanban:', e)
          }
        }
      } else if (process.env.NODE_ENV === 'development') {
        console.warn('[useCreateInitiative] Skipped kanban add: missing userInitiativeInstanceId or userId', {
          userInitiativeInstanceId: data.userInitiativeInstanceId,
          userId: data.userId,
        })
      }
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'initiatives', 'userKeyResultInstance', data.userKeyResultInstanceId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'userInitiativeInstances', 'userKeyResultInstance', data.userKeyResultInstanceId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'kanban-items', 'user', data.userId] })
      queryClient.invalidateQueries({ queryKey: ['goals-okr', 'initiatives', 'user', data.userId] })
      if (data.keyResultId) {
        queryClient.invalidateQueries({ queryKey: ['goals-okr', 'initiatives', 'keyResult', data.keyResultId] })
      }
    },
  })
}
